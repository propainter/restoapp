const express = require('express');
const { check } = require('express-validator');

const reviewsControllers = require('../controllers/reviews-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();


router.get('/place/:placeid', reviewsControllers.getReviewsByPlaceId);

router.use(checkAuth);

router.post(
  '/:placeid',
  reviewsControllers.createReview
);

router.patch(
    '/:reviewid',
    // [
    //     check('reply').not().isEmpty()
    // ],
    reviewsControllers.replyReview
);

router.delete(
    '/:reviewid', reviewsControllers.deleteReview
)


module.exports = router;
