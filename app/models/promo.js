var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var promoSchema = new Schema({
    product: String,
    promoCode: String,
    category: String,
    brand: String,
    details: String,
    expireDate: Date,
    link: String,
    imageLink: String
},{collection:'Promo'});
module.exports = mongoose.model('Promo', promoSchema);
