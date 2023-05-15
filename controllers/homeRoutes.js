const router = require('express').Router();
const { User, Review, Comment } = require('../models');

router.get('/', async (req, res) => {
    try {
      const reviewData = await Review.findAll({
            attributes: ['id', 'title', 'description', 'rating'],
            include: [
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'name',
                        'description',,
                        'user_id',
                        'review_id'
                    ],
                    include: {
                        model: User,
                        attributes: [
                        'name',
                        ],
                    },
                },
                {
                    model: User,
                    attributes: [
                        'name',
                    ],
                },
            ],
        })

        const review = reviewData.map((review) => review.get({ plain: true }));

        res.render('feed', {
            review
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.get('/:id', async (req, res) => {
    try {
        const reviewData = await Review.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ['id', 'title', 'description', 'rating'],
            include: [
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'name',
                        'description',
                        'user_id',
                        'review_id'
                    ],
                    include: {
                        model: User,
                        attributes: ['name'],
                    },
                },
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        })

        if (!reviewData) {
            res.status(404).json({ message: "No review found" });
            return;
        }
    
        const review = reviewData.get({ plain: true });

        res.render('view', {
            review
        });
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.get('/', async, (req, res) => {
    try {
        res.render('homepage');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});


router.get('*', (req, res) => {
    res.status(404).send("Can't go there!");
    // res.redirect('/');
});


module.exports = router;