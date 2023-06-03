const express = require("express");
const userModel = require("../model/userModel");
const foodModel = require("../model/foodModel");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../secret");

async function protectRoute(req, res, next) {
    try {
        let decreptedToken = jwt.verify(req.cookies.JWT, jwt_secret);
        if (decreptedToken) {
            let userId = decreptedToken.id;
            req.userId = userId;
            next();
        } else {
            res.send("kindly login to access this record");
        }

    } catch (err) {
        res.status(404)
            .json({
                message: err.message,
            })
    }
}

async function signUpUser(req, res) {
    try {
        // console.log("hello")
        console.log(req.body);
        let newUser = await userModel.create(req.body);
        res.status(200).json({
            message: "user created successfully",
            user: newUser,
        })

    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: err.message,
        })
    }
}

async function loginUser(req, res) {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email });
        if (user) {
            if (user.password == password) {
                let token = jwt.sign({ id: user["_id"] }, jwt_secret);
                res.cookie("JWT", token);
                res.status(200).json({
                    message: "user logged in",
                    user: user,
                })
            } else {
                res.status(404).json({
                    message: "email or password is not correct",
                })
            }
        } else {
            res.status(404).json({
                message: "user not found",
            })
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: err.message,
        })
    }
}

async function getUser(req, res) {
    try {
        let { id } = req.params;
        let user = await userModel.findById(id);
        res.status(200).json({
            user: user,
        })

    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: err.message,
        })
    }
}

async function addIntoCart(req, res) {
    try {
        let userId = req.body.user;
        let foodId = req.body.food;

        let user = await userModel.findById(userId);
        let foodItem = await foodModel.findById(foodId);

        user.cart.push(foodItem);
        await user.save();

        res.status(200).json({
            user: user,
        })

    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: err.message,
        })
    }
}


async function removeFromCart(req, res) {
    try {
        let userId = req.body.user;
        let foodId = req.body.food;

        let user = await userModel.findById(userId);
        let foodItem = await foodModel.findById(foodId);

        // if (foodItem.qty > 1) {
        //     foodItem.qty--;
        // } else if (foodItem.qty == 1) {
        //     user.cart.remove(foodId);
        //     foodItem.qty--;
        // }
        let flag = false;
        for (let i = 0; i < user.cart.length; i++) {
            if (JSON.stringify(user.cart[i]) == JSON.stringify(foodItem._id)) {
                flag = true;
                user.cart.splice(i, 1);
            }
            if (flag)
                break;
        }

        await user.save();

        res.status(200).json({
            user: user,
        })

    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: err.message,
        })
    }
}

const updateUserCart = async (req, res) => {
    try {
        let { id } = req.params;
        console.log(id);

        let user = await userModel.findById(id);
        user.cart = [];
        await user.save();

        res.status(200).json({
            user: user,
        })

    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: err.message,
        })
    }
}

userRouter
    .route("/signup")
    .post(signUpUser)

userRouter
    .route("/login")
    .post(loginUser)

userRouter
    .route("/:id")
    // .get(protectRoute, getUser)
    .get(getUser)

userRouter
    .route("/cart")
    .post(addIntoCart)

userRouter
    .route("/cart/:id")
    .put(updateUserCart)

userRouter
    .route("/cart/delete")
    .post(removeFromCart);

module.exports = userRouter;
