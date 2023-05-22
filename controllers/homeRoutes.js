const router = require("express").Router();
const { response } = require("express");
const { User, Review, Comment } = require("../models");
const withAuth = require("../utils/auth");
const ifetch = require("isomorphic-fetch");

// GET all reviews and join with user data
router.get("/", async (req, res) => {
  try {
    const reviewData = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    // Serialize data so the template can read it
    const reviews = reviewData.map((review) => review.get({ plain: true }));

    const albumIds = [...new Set(reviews.map((review) => review.albumId))];
    let albumData = [];
    for (const id of albumIds) {
      await ifetch(`https://api.deezer.com/album/${id}`)
        .then((response) => response.json())
        .then((data) => albumData.push(data));
    }
    const reviewsToReturn = reviews.map((review) => {
      const match = albumData.filter(
        (item) => item.id == parseInt(review.albumId)
      );
      return {
        albumData: match[0],
        ...review,
      };
    });
    // Pass serialized data and session flag into template
    res.render("homepage", {
      reviews: reviewsToReturn,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET all reviews from a specific user
router.get("/review/:id", async (req, res) => {
  try {
    const reviewData = await Review.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: ["id", "name", "description", "user_id", "review_id"],
        },
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    if (!reviewData) {
      res.status(404).json({ message: "No review found" });
      return;
    }

    const review = reviewData.get({ plain: true });

    res.render("review", {
      ...review,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new review
router.get("/review", withAuth, async (req, res) => {
  try {
    const UserData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Review }],
    });

    const user = UserData.get({ plain: true });

    res.render("createReview", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Edit/delete an existing review
router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    const UserData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Review }],
    });

    const user = UserData.get({ plain: true });

    res.render("editReview", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/comments/:review_id", withAuth, async (req, res) => {
  try {
    const CommentData = await Comment.findAll({
      where: {
        review_id: req.params.review_id,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    if (!CommentData) {
      res.status(404).json({ message: "No comments found" });
      return;
    }

    const comments = CommentData.map((comment) => comment.get({ plain: true }));

    res.render("comments", {
      comments: comments,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/comment/:review_id", withAuth, async (req, res) => {
  try {
    const ReviewData = await Review.findByPk(req.params.review_id, {
      include: [{ model: Comment }],
    });

    const review = ReviewData.get({ plain: true });

    res.render("createComment", {
      ...review,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login route
router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

// Signup route
router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("signup");
});

module.exports = router;
