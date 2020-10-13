const user = require("../models/user");

const ROLES = ['USER', 'OWNER', 'ADMIN'];
const isAdmin = (userRole) => {return userRole &&  userRole === ROLES[2]};
const isOwner = (userRole) => {return userRole && userRole === ROLES[1]};


const placeReviewBuckets = ['reviews5star', 
    'reviews4star', 
    'reviews3star', 
    'reviews2star', 
    'reviews1star',
    'reviews',
    'reviewsNotReplied'];
const getReviewBucketName = (rating) => {
    switch (rating) {
        case 5:
          return 'reviews5star'
        case 4:
          return 'reviews4star'
        case 3:
          return 'reviews3star'
        case 2:
          return 'reviews2star'
        default:
          // 1 rating is at least
          return 'reviews1star'
      }
    
}
const placePartialReadQueryString = (fieldsToRead=[]) => {
    return placeReviewBuckets.filter(item => fieldsToRead.indexOf(item) === -1).map(item => '-'+item).join(' ')
}


module.exports = {
    ROLES, isAdmin, isOwner, placePartialReadQueryString, getReviewBucketName
}

