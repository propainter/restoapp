//export const SITE_URL = 'http://localhost:5000'
export const SITE_URL = process.env.REACT_APP_BACKEND_ENDPOINT
export const SITE_STATIC_URL = SITE_URL
export const BASE_URL = SITE_URL + '/api'
// const BASE_URL = 'http://192.168.43.35:5000/api'
export const LOGIN_URL = BASE_URL + '/users/login';
export const SIGNUP_URL = BASE_URL + '/users/signup'
export const GET_USERS_URL = BASE_URL + '/users';
export const GET_ALL_PLACES_URL = BASE_URL + '/places';
export const GET_USER_PLACES_URL = (userID) => {return  BASE_URL + '/places/user/' + userID};
export const PLACE_BY_ID_URL = (placeID) =>  {return BASE_URL + '/places/' + placeID};
export const GET_PLACE_REVIEWS_URL = (placeID) => {return BASE_URL + '/reviews/place/' + placeID};
export const USER_ROLES = ['USER', 'OWNER', 'ADMIN'];
export const isAdmin = (userRole) => {return userRole && userRole === USER_ROLES[2]}
export const isOwner = (userRole) => {return userRole && userRole === USER_ROLES[1]}


export const GET_REVIEWS_BY_PLACEID_URL = (placeID, populateBy) => { return BASE_URL + '/reviews/place/' + placeID +'?populateBy='+populateBy};
export const POST_REVIEW_FOR_PLACE_URL = (placeID) => { return BASE_URL + '/reviews/' + placeID };
export const PUT_REPLY_BY_REVIEWID_PLACEID_URL  = (placeID, reviewID) => { return BASE_URL + '/reviews/' + placeID + '/' + reviewID };
