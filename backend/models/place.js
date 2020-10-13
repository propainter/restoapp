const mongoose = require('mongoose');

const Schema = mongoose.Schema;



/**
 * Editable fields:
 *  - title
 *  - description
 * 
 * 
 */

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  
  // review/rating related
  ratingAverage: {type: Number, default: 0},
  reviews5star: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review' }],
  reviews4star: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review' }],
  reviews3star: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review' }],
  reviews2star: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review' }],
  reviews1star: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review' }],
  reviewsNotReplied: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review' }],

  reviews: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review' }],
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  created : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Place', placeSchema);
