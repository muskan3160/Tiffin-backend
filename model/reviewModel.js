const mongoose = require("mongoose");
const { db_link } = require("../secret");

mongoose.connect(db_link).then(function () {
    console.log("database is connected");
}).catch(function (err) {
    console.log(err);
})

const reviewSchema = new mongoose.Schema({
    description: String,
    rating: {
        type: Number,
        min: 0.5,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    food: {
        type: mongoose.Schema.ObjectId,
        ref: "foodModel",
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "userModel",
    }

})

const reviewModel = mongoose.model("review", reviewSchema);
module.exports = reviewModel;