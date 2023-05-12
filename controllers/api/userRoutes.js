const router = require('express').Router();
const { User, Review, Comment } = require('../../models');

// GET all users
router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll();
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a single user
router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findOne();
        if (!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        };
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREATE a new user
router.post('/', async (req, res) => {
    try {
        const userData = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// UPDATE a user by their id value
router.put('/:id', async (req, res) => {
    try {
        const userData = await User.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        if (!userData[0]) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE a user by id value
router.delete('/:id', async (req, res) => {
    try {
        const userData = await User.destroy({
            where: {
                id: req.params.id
            },
        });
        if (!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
