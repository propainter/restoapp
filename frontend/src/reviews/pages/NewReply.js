import React, { useContext } from 'react';


import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {POST_REPLY_FOR_REVIEW_URL} from '../../Constants';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './ReviewForm.css';

const NewReply = (props) => {
  const auth = useContext(AuthContext);
  const reviewId = props.reviewId;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      comment: {
        value: '',
        isValid: false
      }
    },
    false
  );


  const reviewSubmitHandler = async event => {
    event.preventDefault();
    if(!reviewId){
        console.log("reviewId not provided", reviewId)   
    }
    try {
        const responseData = await sendRequest(
          POST_REPLY_FOR_REVIEW_URL(reviewId), 
          'POST', 
          JSON.stringify({comment: formState.inputs.comment.value}), 
          {Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json'}
        );

    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="reply-form" onSubmit={replySubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="comment"
          element="textarea"
          label="Reply"
          validators={[VALIDATOR_REQUIRE]}
          errorText="Please enter a valid reply."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          SAVE REPLY
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewReply;
