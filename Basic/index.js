const express = require("express");
const app = express();
const port = 5000;
// respond with "hello world" when a GET request is made to the homepage
const mongoose = require("mongoose");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
//express 4버전 이상부터는 bodyparser내장
// const bodyParser = require("body-parser");
const config = require("./config/key");
const cookieParser = require("cookie-parser");
//application/x-www-form-urlencoded 을 처리
app.use(express.urlencoded({ extended: true }));
//appliction/json 을 처리
app.use(express.json());
app.use(cookieParser());

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

	app.post("/api/users/register", (req, res) => {
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

app.post("/api/users/login", (req, res) => {
	//요청된 이메일을 데이터베이스에서 검색 후 비밀번호 동일여부 확인 후 맞으면 토큰생성

	//이메일로 찾기
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user) {
			return res.json({
				loginSuccess: false,
				message: "当たるユーザーがありません",
			});
		}
		//이메일로 찾은 유저정보를 받아와서 비밀번호 비교
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch) {
				return res.json({
					loginSuccess: false,
					message: "暗証番号エラー",
				});
			} else {
				// 비밀번호 맞으면 토큰생성
				user.generateToken((err, user) => {
					if (err) return res.status(400).send(err);
					// 토큰을 쿠키나 로컬스토리지등에 저장한다.
					res.cookie("x_auth", user.token)
						.status(200)
						.json({ loginSuccess: true, userId: user._id });
				});
			}
		});
	});
});

app.get("/api/users/auth", auth, (req, res) => {
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image,
	});
});

app.get("/api/users/logout", auth, (req, res) => {
	// 토큰을 삭제하여 로그아웃처리함
	User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).send({ success: true });
	});
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
