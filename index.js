const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3001;
const Razorpay = require('razorpay')
const cors = require('cors')
const shortid = require('shortid')
// const bodyParser = require('body-parser');

const userRouter = require("./router/userRouter");
const foodRouter = require("./router/foodRouter");
const reviewRouter = require("./router/reviewRouter");
const orderRouter = require("./router/orderRouter");
// const updateUserCart = require("./router/userRouter");

app.use(express.json());
app.use(cookieParser());
// app.use(express.json({ limit: '35mb' }));
// app.use(express.urlencoded({ limit: '35mb' }));
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cors());
// app.use(
// 	cors({
// 		origin: ["https://alan-eats.netlify.app/"],
// 		methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
// 		credentials: true,
// 		origin: true,
// 	})
// );

const razorpay = new Razorpay({
	key_id: 'rzp_test_oKt4aYMDlmmRMX',
	key_secret: 'MXZ1TIQbedSFNZZ2RVtPYYwc'
})

app.post('/razorpay', async (req, res) => {
	let { name, email, userId, cartAmount } = req.body;
	// console.log("====================", name, email)

	const payment_capture = 1
	const amount = cartAmount
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
		// await userRouter.updateUserCart(req,res);
	} catch (error) {
		console.log(error)
	}
})


app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/api/review", reviewRouter);
app.use("/api/order", orderRouter);


app.listen(PORT, () => {
	console.log(`server is successfully started at port ${PORT}`)
})

module.exports = app;