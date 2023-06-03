const express = require("express");
const foodModel = require("../model/foodModel");
const foodRouter = express.Router();

//second one
//trynew
//one more
//ok
async function createFoodItem(req, res) {
    try {
        let data = req.body;
        let foodItem = await foodModel.create(data);
        res.status(200).json({
            foodData: foodItem,
        })

    } catch (err) {
        consol.log(err);
        res.status(500).json({
            message: err.message,
        })
    }
}

async function getAllFoodItems(req, res) {
    try {
        let foodData = await foodModel.find()
        res.status(200).json({
            data: foodData,
        })

    } catch (err) {
        consol.log(err);
        res.status(500).json({
            message: err.message,
        })
    }
}

async function getParticularFoodItem(req, res) {
    try {
        let { id } = req.params;
        let foodItem = await foodModel.findById(id);
        res.status(200).json({
            data: foodItem,
        })

    } catch (err) {
        res.status(404).json({
            message: err.message,
        })
    }
}

async function updateFoodItemInfo(req, res) {
    try {
        let { id } = req.params;
        let foodItem = await foodModel.findById(id);

        for (let key in req.body) {
            foodItem[key] = req.body[key];
        }

        res.status(200).json({
            data: foodItem,
        })

    } catch (err) {
        res.status(404).json({
            message: err.message,
        })
    }
}

async function deleteParticularFoodItem(req, res) {
    try {
        let { id } = req.params;
        let foodItem = await foodModel.findByIdAndDelete(id);
        res.status(200).json({
            data: foodItem,
        })

    } catch (err) {
        res.status(404).json({
            message: err.message,
        })
    }
}

foodRouter
    .route("/")
    .get(getAllFoodItems)
    .post(createFoodItem);

foodRouter
    .route("/:id")
    .get(getParticularFoodItem)
    .patch(updateFoodItemInfo)
    .delete(deleteParticularFoodItem)

module.exports = foodRouter;