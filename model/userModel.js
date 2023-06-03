const mongoose = require("mongoose");
const { db_link } = require("../secret");
const validator = require("email-validator");

mongoose.connect(db_link).then(function () {
    console.log("database is connected");
}).catch(function (err) {
    console.log(err);
})

const userSchema = new mongoose.Schema({
    userImage: String,

    name: {
        type: String,
        min: 4,
    },
    email: {
        type: String,
        validate: function () {
            return validator.validate(this.email);
        }
    },
    password: {
        type: String,
        min: 8
    },
    confirmPassword: {
        type: String,
        min: 8,
        validate: function () {
            return this.confirmPassword == this.password;
        }
    },
    token: String,

    cart: {
        type: [mongoose.Schema.ObjectId],
        ref: "foodModel",
    }

})

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;