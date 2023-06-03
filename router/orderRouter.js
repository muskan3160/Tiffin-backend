const express = require("express");
const orderModel = require("../model/orderModel");
const orderRouter = express.Router();
const orderArr = ["Placed",
    "Confirmed",
    "Prepared",
    "Out for Delivery",
    "Completed",]

async function saveOrder(req, res) {
    try {
        let data = req.body;
        let order = await orderModel.create(data);

        await order.save();

        res.status(200).json({
            message: "order created",
            order: order
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message,
        })
    }
}

async function getAllOrders(req, res) {
    try {
        let order = await orderModel.find()
        res.status(200).json({
            data: order,
        })

    } catch (err) {
        consol.log(err);
        res.status(500).json({
            message: err.message,
        })
    }
}

async function getParticularOrder(req, res) {
    try {
        let { id } = req.params;
        console.log("hello id", id)
        let order = await orderModel.find({ orderId: id });
        console.log("find vala order", order);
        if (order.length > 0) {
            let idx = orderArr.indexOf(order[0].status);
            res.status(200).json({
                data: {
                    status: idx,
                    createdAt: order[0].createdAt,
                    orderId: order[0].orderId
                }
            })
        } else {
            res.status(200).json({
                data: {
                    status: 4,
                    orderId: id,
                    createdAt: Date.now()
                }
            })
        }

    } catch (err) {
        res.status(404).json({
            message: err.message,
        })
    }
}

async function updateOrder(req, res) {
    try {
        let { id } = req.params;
        let order = await orderModel.find({ orderId: id });

        for (let key in req.body) {
            order[0][key] = req.body[key];
        }

        await order[0].save();
        res.status(200).json({
            data: order[0],
        })

    } catch (err) {
        res.status(404).json({
            message: err.message,
        })
    }
}

async function deleteOrder(req, res) {
    try {
        let { id } = req.params;
        let order = await orderModel.findOneAndDelete({ orderId: id });
        await order.save();

        res.status(200).json({
            message: "order successfully deleted",
            order: order,
        })

    } catch (err) {
        res.status(404).json({
            message: err.message,
        })
    }
}

orderRouter
    .route("/")
    .get(getAllOrders)
    .post(saveOrder);

orderRouter
    .route("/:id")
    .get(getParticularOrder)
    .patch(updateOrder)
    .delete(deleteOrder)

module.exports = orderRouter;