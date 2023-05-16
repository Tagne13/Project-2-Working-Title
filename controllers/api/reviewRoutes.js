const router = require('express').Router();
const { Review } = require('../../models');
const withAuth = require('../../utils/auth');

//// get all reviews////
router.get('/', withAuth, async (req, res) => {
  try {
      const reviewData = await Review.findAll();
      res.status(200).json(reviewData);
  } catch (err) {
      res.status(500).json(err);
  }
});


//// post new review/////
router.post('/', withAuth, async (req, res) => {
   try {
      const newReview = await Review.create({
        ...req.body,
        user_id: req.session.user_id,
      })
  
      res.status(200).json(newReview);
    } catch (err) {
      res.status(400).json(err);
    }
  });


  //// update a review/////
  router.put('/:id', withAuth, async (req, res) => {
    try {
    Review.update(
      {
        ...req.body,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.params.user_id,
        },
      }
    )
      .then((updatedReview) => {
        res.json(updatedReview);
      });
      
    }  catch(err) {
        res.json(err);
      };
  });
  
  router.delete('/:id', withAuth, async (req, res) => {
    try {
      const reviewData = await Review.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });
  
      if (!reviewData) {
        res.status(404).json({ message: 'No review found with this id!' });
        return;
      }
  
      res.status(200).json(reviewData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
  