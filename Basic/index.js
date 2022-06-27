const express = require("express");
const app = express();
const port = 5000;
// respond with "hello world" when a GET request is made to the homepage
const mongoose = require("mongoose");
const { User } = require("./models/User");
//express 4버전 이상부터는 bodyparser내장
// const bodyParser = require("body-parser");
const config = require("./config/key");
//application/x-www-form-urlencoded 을 처리
app.use(express.urlencoded({ extended: true }));
//appliction/json 을 처리
app.use(express.json());

mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,

		// mongoose version 6이상에서는 하기 2개의 세팅은 사용하지 않는다.
		// useCreateIndex : true,
		// useFindAndModify : false
	})
	.then(() => console.log("MongoDB Connected..."))
	.catch((err) => console.log(err));

app.get("/", (req, res) => {
	res.send("hello world welcome world");

	app.post("/register", (req, res) => {
		// 회원가입시 필요한 정보를 클라이언트에서 받으면 db에 넣어둔다
		// 내부에는 json형식으로 클라이언트 입력값이 들어있음
		const user = new User(req.body);


		user.save((err) => {
			if (err) return res.json({ success: false, err });
			return res.status(200).json({
				success: true,
			});
		});
	});
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
