var mongoose = require('mongoose'),
    Promo = mongoose.model('Promo');

module.exports = {
    createPromo: function (req, res) {
        console.log(req.body)
        var promo = new Promo({
            product: req.body.product,
            promoCode: req.body.code,
            category: req.body.category,
            brand: req.body.brand,
            details: req.body.details,
            expireDate: req.body.date,
            link: req.body.link,
            imageLink: req.body.image
        });
        promo.save(function (err) {
            if (err) {
                return res.status(500).send(err.message);
            }
            // send OK
            return res.status(200).send(promo);
        })
    },
    getView: function (req,res) {
        return res.status(200).render('promo')

    },
    searchPromo: function (req, res) {
        Promo.find({$or: [{product: new RegExp(req.body.searchTerm, "i")}, {brand: new RegExp(req.body.searchTerm, "i")},{category: new RegExp(req.body.searchTerm, "i")}]}, function (err, promo) {
            if (!err) {
                return res.status(200).send(promo);

            } else {
                return res.status(500).send(err);
            }
        })
    },
    searchPromoByCategory: function (req, res) {
        Promo.find({category: new RegExp(req.body.searchTerm, "i")}, function (err, promo) {
            if (!err) {
                return res.status(200).send(promo);
            } else {
                return res.status(500).send(err);
            }
        })
    },
    deleteExpirePromos: function () {
        var cursor = Promo.find({expireDate:{$lt: new Date()}}).cursor();
        cursor.on('data',function (promo) {
            Promo.findByIdAndRemove(promo._id,function (err) {})
        })
    }

}