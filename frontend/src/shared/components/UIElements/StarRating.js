import React from 'react';

import './StarRating.css';

const StarRating = (props) => {
    let rating = 0;
    if(props.rating){
        rating = props.rating;
    }
    const stars = [];
    for (let index = 0; index < 5; index++) {
      if(index < rating){
        stars.push(<span key={'star_'+index} className='star-yellow'>&#9733;</span>)
      }else{
        stars.push(<span key={'star_'+index} className='star-faded'>&#9734;</span>)
      }
    }
    return (
      <React.Fragment>
        <span style={props.style}>{stars}</span>
      </React.Fragment>
    )
  }

export default StarRating;