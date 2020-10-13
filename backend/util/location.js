const axios = require('axios');
const HttpError = require('../models/http-error');


const API_TOKEN = process.env.LOCATION_API_TOKEN;


async function getCoordsForAddress(addressString) {
//   return {
//     lat: 40.7484474,
//     lng: -73.9871516
//   };

let coordinates = null;
let response = null;
  try{
    response = await axios.get(
      // `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      //   address
      // )}&key=${API_KEY}`
      `https://us1.locationiq.com/v1/search.php?key=${API_TOKEN}&q=${encodeURIComponent(addressString)}&format=json`
    );
    
  }catch (err){
    console.error("Error response from GEOCODING:");
    console.error(err.response.status, err.response.data, err.response.headers);    // ***
  } finally {
    const data = response.data[0];
    if (!data || data.error) {
      const error = new HttpError(
        'Could not find location for the specified address.',
        422
      );
      throw error;
    }
    coordinates = {"lat": data.lat, "lng": data.lon };
  }
  
  return coordinates;
}

module.exports = getCoordsForAddress;



// [
// {
// place_id: "236274529",
// licence: "https://locationiq.com/attribution",
// osm_type: "relation",
// osm_id: "3715231",
// boundingbox: [
// "28.6091306",
// "28.6154467",
// "76.9787711",
// "76.9858047"
// ],
// lat: "28.612304",
// lon: "76.9823908",
// display_name: "Najafgarh, Najafgarh Tehsil, South West Delhi, Delhi, India",
// class: "boundary",
// type: "administrative",
// importance: 0.45,
// icon: "https://locationiq.org/static/images/mapicons/poi_boundary_administrative.p.20.png"
// }
// ]


// {
// error: "Unable to geocode"
// }
