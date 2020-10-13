import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import ReviewItem from './ReviewItem';
import Button from '../../shared/components/FormElements/Button';
import './ReviewList.css';

const ReviewList = props => {

  if (props.items.length === 0) {
    return (
      <div className="review-list center">
        <Card>
          <h2>No reviews found. Maybe create one?</h2>
          <Button to={`/${props.currentPlace._id}/reviews/new`}>Share review</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="review-list">
      {
      props.items.map(review => (
        <ReviewItem
          key={'review_'+review._id}
          id={review._id}
          comment={review.comment}
          rating={review.rating}
          visited={review.created}
          reply={review.reply}
          replied={review.replied}
          hideReply={review.hideReply}
          onReply={props.onReplyAction}
          creatorId={review.creator}
          currentPlace={props.currentPlace}
          onDelete={props.onDeleteAction}
        />
      ))}
    </ul>
  );
};

export default ReviewList;
