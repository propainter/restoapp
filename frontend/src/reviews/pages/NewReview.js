import React, { useContext } from 'react';
import { useHistory,useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {POST_REVIEW_FOR_PLACE_URL} from '../../Constants';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './ReviewForm.css';

const NewReview = () => {
  const auth = useContext(AuthContext);
  const placeId = useParams().placeId;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      comment: {
        value: '',
        isValid: false
      },
      rating: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const reviewSubmitHandler = async event => {
    event.preventDefault();
    try {
      
      await sendRequest(
          POST_REVIEW_FOR_PLACE_URL(placeId), 
          'POST', 
          JSON.stringify({comment: formState.inputs.comment.value,rating: formState.inputs.rating.value}), 
          {Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json'}
        );
      history.push(`/${placeId}/reviews`);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <ul className='topButtonRail'>
      <Button  onClick={() => {history.push(`/${placeId}/reviews`)}}>&#x2190; Go Back</Button>
      <Button  onClick={() => {history.push(`/`)}}>Go Home &#x2191;</Button>
      </ul>
      <form className="review-form" onSubmit={reviewSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        
        <Input
          id="comment"
          element="textarea"
          label="Comment"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          element="select"
          id="rating"
          label="Rating"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please select a Rating."
          onInput={inputHandler}
          >
            <option value="">-Select Rating-</option>
            <option value="1">&#9733;</option>
            <option value="2">&#9733; &#9733;</option>
            <option value="3">&#9733; &#9733; &#9733;</option>
            <option value="4">&#9733; &#9733; &#9733; &#9733;</option>
            <option value="5">&#9733; &#9733; &#9733; &#9733; &#9733;</option>
        </Input>

        
        <Button type="submit" disabled={!formState.isValid}>
          ADD REVIEW
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewReview;
