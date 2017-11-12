/**
 * Created by USER on 27/07/2017.
 */

// TODO: Agregar mas marcas y categorias.
var brands = {
  values:["Nike", "Adidas", "Puma", "Guess", "Lacoste", "Victoria's Secret", "Zara", "Microsoft" ,"Stradivarius", "Asus", "HP", "BMW", "Mercedes Benz"],
  message: 'Please type select brand'
};


var categories = {
    values:["Clothes", "Accesories", "Cars", "Motorcycles", "Shoes", "Make up", "Technology", "Watches"],
    message: 'Please type select category'
};


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var reviewSchema = new Schema({
    product: String,
    youtubeName: String,
    youtubeImage: String,
    youtubeDate: String,
    youtubeLink: String,
    category: {type:String, enum: categories},
    brand: {type:String, enum: brands},
    owner_username: String,
    verifiedUser: Boolean,
    goodRate: Number,
    badRate: Number
},{collection:'Review'});
module.exports = mongoose.model('Review', reviewSchema);
