const mongoose = require("mongoose");
const { db_link } = require("../secret");

mongoose.connect(db_link).then(function () {
    console.log("database is connected");
}).catch(function (err) {
    console.log(err);
})

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
    },

    orderId: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    }

})

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;