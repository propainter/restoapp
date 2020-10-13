import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Modal from '../../shared/components/UIElements/Modal';
import StarRating from '../../shared/components/UIElements/StarRating';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import {PLACE_BY_ID_URL, SITE_STATIC_URL} from '../../Constants';
import {
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import {isAdmin} from '../../Constants';
import './PlaceItem.css';

const PlaceItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

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
        // `http://localhost:5000/api/places/${props.id}`
        PLACE_BY_ID_URL(props.id),
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };



  const statsComponent = (props) => {
    
    return (
      <React.Fragment>
      <StarRating style={{fontSize: "3rem"}}  rating={props.ratingAverage} />({props.ratingAverage.toPrecision(2)} is overall average rating)
      <div id={props.id + "_stats"} className="place-item__stats-container">
      </div>
      </React.Fragment>
    )
  }


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
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
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          {props.image && 
            (<div className="place-item__image">
              <img
                src={`${SITE_STATIC_URL}/${props.image}`}
                alt={props.title}
              />
            </div>)
          }
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
            {statsComponent(props)}
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {props.parentIsPlaceList && props.id &&
              (<Button inverse to={`/${props.id}/reviews`}>VIEW</Button>)
            }
            {(auth.userId === props.creatorId || isAdmin(auth.userRole)) && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
              )}
            {(auth.userId === props.creatorId || isAdmin(auth.userRole)) && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
            { !props.parentIsPlaceList  && props.id &&
              (<Button to={`/${props.id}/reviews/new`}>Give Your Review</Button>)
            }
            
            
            { /* THIS PORTION ONLY USED IN CASE OF REVIEW PAGE  */
              !props.parentIsPlaceList && props.id &&
              (<>
              <Input
              element="select"
              id="role"
              label="Select Filter"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please select a Filter."
              onInput={props.onFilterChangeHandler}
              initialValid={true}
              initialValue={props.populateBy}
              style={{display: 'flex',  width: '100%', fontSize: 'x-large'}}
            >
              <option value="reviews" >All reviews</option>
              <option value="reviews1star" >&#9733;</option>
              <option value="reviews2star" >&#9733; &#9733;</option>
              <option value="reviews3star" >&#9733; &#9733; &#9733;</option>
              <option value="reviews4star" >&#9733; &#9733; &#9733; &#9733;</option>
              <option value="reviews5star" >&#9733; &#9733; &#9733; &#9733; &#9733;</option>
              <option value="reviewsNotReplied" >Not Replied Reviews</option>
            </Input>
            </>) 
            }


          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
