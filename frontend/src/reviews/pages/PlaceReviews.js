import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import ReviewList from '../components/ReviewList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import PlaceItem from '../../places/components/PlaceItem';
import { useHttpClient } from '../../shared/hooks/http-hook';
import {GET_REVIEWS_BY_PLACEID_URL} from '../../Constants';

import './PlaceReview.css';

const PlaceReviews = () => {
  const [loadedReviews, setLoadedReviews] = useState();
  const [loadedCurrentPlace, setLoadedCurrentPlace] = useState();
  const [populateBy, setPopulateBy] = useState("reviews");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const placeId = useParams().placeId;
  const history = useHistory();
  const forceReload = useCallback(() => setPopulateBy({}), [])


  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
            GET_REVIEWS_BY_PLACEID_URL(placeId, populateBy)
        );
        let loadedCurrentPlace = responseData.placeWithReviews;
        loadedCurrentPlace.ratingCount = responseData.ratingCount;
        const loadedReviewsData = responseData.placeWithReviews[responseData.populateReviewsBy];
        setLoadedReviews(loadedReviewsData);
        setLoadedCurrentPlace(loadedCurrentPlace);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, placeId, populateBy]);


  

  const onDelete = (reviewId) => {
      console.log("on delete action : ", reviewId);
      forceReload();
  }

  const onFilterChangeHandler = (id, value, isValid) => {
      setPopulateBy(value);
  }
  const onDeletePlace = () => {
    history.push('/')
  }

  
  const onReply = (reviewId, replyBody, replyTime) => {

    let i = loadedReviews.findIndex(review => review._id === reviewId);
    if(i >= 0){
      let newReview = loadedReviews[i];
      newReview.reply  = replyBody;
      newReview.replied = replyTime;
      setLoadedReviews(prevReviews => [...prevReviews]);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading  && loadedCurrentPlace && (
          <ul style={{listStyleType: "none", padding: "0"}}><PlaceItem
              key={loadedCurrentPlace._id}
              id={loadedCurrentPlace._id}
              image={loadedCurrentPlace.image}
              title={loadedCurrentPlace.title}
              description={loadedCurrentPlace.description}
              address={loadedCurrentPlace.address}
              creatorId={loadedCurrentPlace.creator}
              coordinates={loadedCurrentPlace.location}
              onDelete={onDeletePlace}
              lastReview={loadedCurrentPlace.lastReview}
              ratingMax={loadedCurrentPlace.ratingMax}
              ratingMin={loadedCurrentPlace.ratingMin}
              ratingAverage={loadedCurrentPlace.ratingAverage}
              ratingCount={loadedCurrentPlace.ratingCount}

              onFilterChangeHandler={onFilterChangeHandler}
              populateBy={populateBy}
            /></ul>
      )}
      {!isLoading && loadedReviews && loadedCurrentPlace && (
        <ReviewList items={loadedReviews} currentPlace={loadedCurrentPlace} onReplyAction={onReply} onDeleteAction={onDelete} />
      )}
      {!isLoading && !loadedReviews && loadedCurrentPlace && (
           <React.Fragment>
           <Card>
             <h2>Got some review?</h2>
             <Button to={`/${placeId}/reviews/new`}>Give Your Review</Button>
           </Card>
           </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default PlaceReviews;
