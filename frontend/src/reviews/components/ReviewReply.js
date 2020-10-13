import React, { useState, useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import {isAdmin} from '../../Constants';
import './ReviewReply.css'
import {getPrettyDate} from '../../shared/util/common';


const ReviewReply  = props => {
    const reviewId = props.reviewId;
    const reviewCreatorId = props.reviewCreatorId;
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [reply, setReply] = useState({comment: props.reply, repliedAt: props.replied, isHidden: props.isHidden})
    const [showReplyModal, setShowReplyModal] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const isValidReply = () => {
        if(reply.comment && reply.comment.length > 0 && reply.isHidden === false){
            return true;
        }return false;
    }

    const onReplyButtonClick = () => {
        setShowReplyModal(true);
    }
    const cancelReplyHandler = () => {
        setShowReplyModal(false);
    };
    const handleReplyChange = (event) => {
        setReply({comment: event.target.value, repliedAt: "just now", isHidden: false});
    };



    // delete
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
            `http://localhost:5000/api/reviews/${reviewId}`,
            'PATCH',
            JSON.stringify({hide: true}),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            }
          );
          setReply({comment: reply.comment, repliedAt: reply.repliedAt, isHidden: true});
        } catch (err) {}
      };
      
    

    
    const handleReplySubmit = async (event) => {
        event.preventDefault();
        setShowReplyModal(false);
        try {
          await sendRequest(
            `http://localhost:5000/api/reviews/${reviewId}`,
            'PATCH',
            JSON.stringify({reply: reply.comment, hide: reply.isHidden}),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            }
          );
        //   props.onDelete(props.id);
        cancelReplyHandler()
        } catch (err) {}
        // props.onReply(props.id, "dfsdff", "2020-10-07T05:50:41.152Z")
      };
    

return(
    <>
    {isLoading && <LoadingSpinner asOverlay />}
    <ErrorModal error={error} onClear={clearError} />

    {(<Modal
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
      can't be undone thereafter.</p></Modal>)}


    <Modal
    show={showReplyModal}
    onCancel={cancelReplyHandler}
    header="Enter Reply"
    footerClass="review-item__modal-actions"
    footer={
        <React.Fragment>
            <Button inverse onClick={cancelReplyHandler}>
              CANCEL
            </Button>
            { <Button  onClick={handleReplySubmit}>
              SAVE
            </Button> }
          </React.Fragment>
        }
        >
        <div>
        <textarea type="textarea" rows="4" cols="50"
          name="textValue"
          onChange={handleReplyChange}
        />
        </div>
      </Modal>

    {isValidReply() && (<p className='replyContent' style={{fontSize: 'x-small'}}>
        <span className='replyPrefix'>Reply by Owner:</span>
          <b style={{fontSize: 'large'}}>{reply.comment}</b>
          {/* ({getPrettyDate(props.replied)}) */}
          <span className='repliedAt'> [{getPrettyDate(reply.repliedAt)}]</span>
          </p>)}
    { !isValidReply() && reply.isHidden === false  &&  auth.userId === reviewCreatorId && (
      <Button   onClick={onReplyButtonClick}>
        REPLY
      </Button>)
      }
      { isAdmin(auth.userRole) && isValidReply() &&  (<span className="reply-item__button-close" onClick={showDeleteWarningHandler}>&times;<span className="tooltiptext">Delete Reply &#x2620;</span></span>)}
</>
)
}

export default ReviewReply;