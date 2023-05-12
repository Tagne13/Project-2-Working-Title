const router = require('express').Router();
const userRoutes = require('./userRoutes');
const reviewRoutes = require('./reviewRoutes');
const commentRoutes = require('./commentRoutes');

router.use('/user', userRoutes);
router.use('/review', reviewRoutes);
router.use('/comment', commentRoutes);

module.exports = router;