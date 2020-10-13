const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Place = require('../models/place');
// const User = require('../models/user');
const Review = require('../models/review');
const Constants = require('../util/Constants');

// TODO : APPLY CHECK FOR populateBy query param to be a valid
//

const getReviewsByPlaceId = async (req, res, next) => {

  const placeId = req.params.placeid;
  let populateReviewsBy = 'reviews';
  if(req.query.populateBy){
    populateReviewsBy = req.query.populateBy;
  }

  // let places;
  let placeWithReviews;
  try {
    placeWithReviews = await Place.findById(placeId,  Constants.placePartialReadQueryString([populateReviewsBy]))
    .populate({path: populateReviewsBy, options: { sort: { 'created': -1 } }});
  } catch (err) {
    const error = new HttpError(
      'Fetching reviews failed, please try again later.',
      500
    );
    return next(error);
  }


  // if (!places || places.length === 0) {
  if (!placeWithReviews /*|| placeWithReviews.reviews.length === 0*/) {
    return next(
      new HttpError('Could not find reviews for the provided place id.', 404)
    );
  }

  let reviewsCount = 0;
  if(placeWithReviews[populateReviewsBy] && placeWithReviews[populateReviewsBy].length>0){
    reviewsCount = placeWithReviews[populateReviewsBy].length
  }
  

  res.json({
    placeWithReviews: placeWithReviews,
    populateReviewsBy: populateReviewsBy,
    ratingCount: reviewsCount
  });
};

const createReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }

  const placeId = req.params.placeid;
  const userId = req.userData.userId;

  const { comment, rating } = req.body;


  let reviewRating;
  if(rating && rating > 0){
    reviewRating = parseInt(rating);
  }else{
    reviewRating = 1;
  }

  const createdReview = new Review({
    comment: comment,
    rating : reviewRating,
    place: placeId,
    creator: userId
  });

  let thePlace;
  try {
    thePlace = await Place.findById(placeId, Constants.placePartialReadQueryString([Constants.getReviewBucketName(reviewRating), 'reviews', 'reviewsNotReplied'])).populate('reviews');
  } catch (err) {
    const error = new HttpError(
      'Creating review failed, please try again.',
      500
    );
    return next(error);
  }

  if (!thePlace) {
    const error = new HttpError('Could not find Place for provided id.', 404);
    return next(error);
  }

  if(thePlace){
    let res = thePlace.reviews.filter(reviewItem => reviewItem.creator.toString() === userId);
    if(res.length > 0){
      const error = new HttpError('You can Review a place only Once', 401);
      return next(error);
    }
  }


  // updating valuesin places too.
  // pre calculating average, min & max rating  ..
  let newThePlace = thePlace;
  let reviewsCount = thePlace.reviews.length;
  newThePlace.ratingAverage = ((thePlace.ratingAverage*reviewsCount) + reviewRating)/(reviewsCount+1);
  newThePlace.reviews.push(createdReview)
  newThePlace.reviewsNotReplied.push(createdReview)
  newThePlace[Constants.getReviewBucketName(reviewRating)].push(createdReview)

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdReview.save({ session: sess });
    await newThePlace.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating review failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdReview });
};


const replyReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const reviewId = req.params.reviewid;

  const { reply, hide } = req.body;

  // // Fetch Review
  // Fetch Review
  let review;
  try{
    review = await Review.findById(reviewId).populate('place');
  } catch(err) {
    const error = new HttpError(
      'Something went wrong, could not find review by id',
      500
    );
    return next(error);
  }

  // if review is already replied and Trying to reply again , throw error
  if(reply && reply.length > 0 && review.reply && review.reply.length > 0){
    const error = new HttpError('You are not allowed to reply to this review. Its already replied', 401);
    return next(error);
  }else if(hide === true && !Constants.isAdmin(req.userData.userRole)){
    const error = new HttpError('You are not allowed to HIDE this review.', 401);
    return next(error);
  }

  // check permission
  if (review.place.creator.toString() !== req.userData.userId && !Constants.isAdmin(req.userData.userRole)) {
    const error = new HttpError('You are not allowed to reply to this review.', 401);
    return next(error);
  }

  // hide feature
  let isHidden = false;
  if(Constants.isAdmin(req.userData.userRole)){
    isHidden = hide;
  }

  
  // Update Review by adding reply
  if(!review || review.comment.length == 0){
    return next(new HttpError('Review for that reviewId not found', 500));
  }


  if(reply)
  review.reply = reply;
  review.replied = new Date(Date.now()).toISOString();
  if(isHidden)
  review.hideReply = isHidden;
  

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await review.save({session: sess});
    review.place.reviewsNotReplied.pull(review);
    await review.place.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not save reply to review.',
      500
    );
    return next(error);
  }

  res.status(200).json({ review: review.toObject({ getters: true }) });
};

const deleteReview = async (req, res, next) => {
  const reviewId = req.params.reviewid;

  let review;
  try {
    review = await Review.findById(reviewId).populate('place');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete review.',
      500
    );
    return next(error);
  }

  if (!review) {
    const error = new HttpError('Could not find review for this id.', 404);
    return next(error);
  }


  /**
   * Only ADMIN allowed to delete the review
   */
  if (!Constants.isAdmin(req.userData.userRole)) {
    const error = new HttpError(
      'You are not allowed to delete this review.',
      401
    );
    return next(error);
  }

  let newAvgRating = review.place.ratingAverage;
  if(review.place.reviews.length == 1){
    newAvgRating = 0;  
  }else{
    newAvgRating = (newAvgRating*(review.place.reviews.length) - review.rating)/(review.place.reviews.length-1)
  }

  try {

    const sess = await mongoose.startSession();
    sess.startTransaction();
    review.place.reviews.pull(review);
    review.place.ratingAverage = newAvgRating;
    review.place[Constants.getReviewBucketName(review.rating)].pull(review);
    if(!review.reply){
      review.place.reviewsNotReplied.pull(review);
    }
    await review.place.save({ session: sess });
    await review.remove({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not delete review.Transact failure',
      500
    );
    return next(error);
  }

    res.status(200).json({ message: 'Deleted review.' });
};

// needs placeid as param
exports.getReviewsByPlaceId = getReviewsByPlaceId;
// needs placeid as param
exports.createReview = createReview;
// needs placeid and reviewid as param
exports.replyReview = replyReview;
// needs reviewid in param
exports.deleteReview = deleteReview;
