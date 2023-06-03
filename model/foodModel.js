const mongoose = require("mongoose");
const { db_link } = require("../secret");

mongoose.connect(db_link).then(function () {
    console.log("database is connected");
}).catch(function (err) {
    console.log(err);
})
//trynew
const foodSchema = new mongoose.Schema({
    label: String,
    image_url: String,
    price: Number,

    ingredients: [{
        description: String,
        ingredient_Image: String
    }],

    reviews: {
        type: [mongoose.Schema.ObjectId],
        ref: "reviewModel",
    },

    type: String

})

const foodModel = mongoose.model("food", foodSchema);
module.exports = foodModel;