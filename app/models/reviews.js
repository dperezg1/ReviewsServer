/**
 * Created by USER on 27/07/2017.
 */
var genres = {
  values:["Action", "Adventure", "Comedy", "Crime", "Drama", "Romance", "Horror", "Musical", "Science fiction", "Mystery"],
  message: 'Please type select genre'
};

var visibilities = {
  values:["public", "private"],
  message: 'Please select a valid visibility'
};
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var movieSchema = new Schema({
    title: String,
    year: String,
    genre: {type:String, enum: genres},
    size: String,
    director: String,
    imageUrl: String,
    owner_username: String,
    filename: String,
    visibility: {type:String, enum: visibilities},
    shared_with: [String]
},{collection:'Movie'});
module.exports = mongoose.model('Movie', movieSchema);
