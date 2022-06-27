const { User } = require("../models/User");

let auth = (req, res, next) => {
    // 토큰을 복호화 하여 유저 검색
	let token = req.cookie.x_auth;
	// 유저가 있으면 인증완료 ,  유저가 없으면 인증불가
	User.findByToken(token, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({ isAuth: false, error: true });

		req.token = token;
		req.user = user;
		next();
	});
};

module.exports = { auth };
