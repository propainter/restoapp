import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import StarRating from '../../shared/components/UIElements/StarRating';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ReviewReply from './ReviewReply'
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import {getPrettyDate} from '../../shared/util/common';
import {isAdmin} from '../../Constants';
import './ReviewItem.css';

const ReviewItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/reviews/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };
  
  
  
  const reviewFooterComponent = (props) => {
    
    return (
      <>
        <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="review-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      ><p>Do you want to proceed and delete this review? Please note that it
      can't be undone thereafter.</p></Modal>

      
      <ReviewReply
        reply={props.reply}
        replied={props.replied}
        isHidden={props.hideReply}
        reviewCreatorId={props.currentPlace.creator}
        reviewId={props.id}
      />
      </>
    )   
  }


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="review-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      ><p>Do you want to proceed and delete this review? Please note that it
      can't be undone thereafter.</p></Modal>
      
      <li className="review-item">
        <Card className="review-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="review-item__info">
            <h2>"{props.comment}"</h2>
            <StarRating rating={props.rating} style={{fontSize: "3rem"}} />
            <p>visited on {getPrettyDate(props.visited)}</p>
            <p className='review-item__smalltext review-item__righttext'>comment by {props.creatorId}</p>
            
          </div>
          <div className="review-item__actions">
            {reviewFooterComponent(props)}
          </div>
        { isAdmin(auth.userRole) &&  (<span className="review-item__button-close" onClick={showDeleteWarningHandler}>&times;<span className="tooltiptext">Delete Review &#x2620;</span></span>)}
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ReviewItem;
