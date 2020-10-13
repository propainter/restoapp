const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    created : { type : Date, default: Date.now },
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    rating: {type: Number, required: true},
    place: { type: mongoose.Types.ObjectId, required: true, ref: 'Place' },
    comment: { type: String, required: true },
    creatorName: {type: String}, 
    reply: { type: String },
    replied: { type : Date },
    hideReply: {type: Boolean, default: false}
});


reviewSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Review', reviewSchema);
