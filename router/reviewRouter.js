const express = require("express");
const foodModel = require("../model/foodModel");
const reviewModel = require("../model/reviewModel");
const reviewRouter = express.Router();

async function createReview(req, res) {
    try {
        let data = req.body;
        let review = await reviewModel.create(data);

        let foodId = review.food;
        let food = await foodModel.findById(foodId);
        food.reviews.push(review["_id"]);

        await food.save();

        res.status(200).json({
            message: "review created",
            review: review,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message,
        })
    }
}

async function getAllReviews(req, res) {
    try {
        let review = await reviewModel.find()
        res.status(200).json({
            data: review,
        })

    } catch (err) {
        consol.log(err);
        res.status(500).json({
            message: err.message,
        })
    }
}

async function getParticularReview(req, res) {
    try {
        let { id } = req.params;
        let review = await reviewModel.findById(id);
        res.status(200).json({
            data: review,
        })

    } catch (err) {
        res.status(404).json({
            message: err.message,
        })
    }
}

async function updateReview(req, res) {
    try {
        let { id } = req.params;
        let review = await reviewModel.findById(id);

        for (let key in req.body) {
            review[key] = req.body[key];
        }

        res.status(200).json({
            data: review,
        })

    } catch (err) {
        res.status(404).json({
            message: err.message,
        })
    }
}

async function deleteReview(req, res) {
    try {
        let review = await reviewModel.findByIdAndDelete(req.body.id);
        let foodId = review.food;
        let food = await foodModel.findById(foodId);

        let indexOfReview = food.reviews.indexOf(review["_id"])
        food.reviews.splice(indexOfReview, 1);

        await food.save();

        res.status(200).json({
            message: "review successfully deleted",
            review: review,
        })

    } catch (err) {
        res.status(404).json({
            message: err.message,
        })
    }
}

reviewRouter
    .route("/")
    .get(getAllReviews)
    .post(createReview);

reviewRouter
    .route("/:id")
    .get(getParticularReview)
    .patch(updateReview)
    .delete(deleteReview)

module.exports = reviewRouter;