const router = require("express").Router();
const { response } = require("express");
const { User, Review, Comment } = require("../models");
const withAuth = require("../utils/auth");
const ifetch = require("isomorphic-fetch");

router.get("/", async (req, res) => {
  try {
    // Get all reviews and JOIN with user data
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
    console.log(reviewsToReturn);
    // Pass serialized data and session flag into template
    res.render("homepage", {
      reviews: reviewsToReturn,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// // router.get('/', withAuth, async (req, res) => {
//     try {
//       const reviewData = await Review.findAll({
//             attributes: ['id', 'title', 'description', 'rating'],
//             include: [
//                 {
//                     model: Comment,
//                     attributes: [
//                         'id',
//                         'name',
//                         'description',,
//                         'user_id',
//                         'review_id'
//                     ],
//                     include: {
//                         model: User,
//                         attributes: [
//                         'name',
//                         ],
//                     },
//                 },
//                 {
//                     model: User,
//                     attributes: [
//                         'name',
//                     ],
//                 },
//             ],
//         })

//         const review = reviewData.map((review) => review.get({ plain: true }));
//         console.log('AAAA', review);

//     res.status(200).json(review);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json(err);
//     };
// });

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

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("signup");
});

// router.get('*', (req, res) => {
//     res.status(404).send("Can't go there!");
//     // res.redirect('/');
// });

module.exports = router;
