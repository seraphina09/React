const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRound = 10;
const jwt = require("jsonwebtoken");

// Model 작성
// 1. 스키마를 작성한 후 그것을 모듈로 감싸야 한다.
// 2. userSchema를 작성한 후, const Var = mongoose.model ("", schemaName)
// 3. 추후 다른 부분에서도 본 스키마를 사용하기 위해서 exports를 진행한다.

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50,
	},
	email: {
		type: String,
		trim: true,
		unique: 1,
	},
	password: {
		type: String,
		minlength: 5,
	},
	lastname: {
		type: String,
		maxlength: 50,
	},
	role: {
		type: Number,
		default: 0,
	},
	image: String,
	token: {
		type: String,
	},
	tokenExp: {
		type: Number,
	},
});

userSchema.pre("save", function (next) {
	// 비밀번호 암호화 (index.js의 user.save전)
	let user = this;
	if (user.isModified("password")) {
		bcrypt.genSalt(saltRound, function (err, salt) {
			if (err) return next(err);

			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
	// 기본 비밀번호와(유저로부터 입력받은 자료 )암호화된 비밀번호가 동일한지 체크가 필요하나, 플레인 번호를 암호화 하여 비교할수 있다. bcrypt

	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

userSchema.methods.generateToken = function (cb) {
	let user = this;
	//jsonwebtoken으로 토큰생성
	// →　user._id +  'secreatToken' = token
	let token = jwt.sign(user._id.toHexString(), "secretToken");
	user.token = token;
	user.save(function (err, user) {
		if (err) return cb(err);
		cb(null, user);
	});
};

userSchema.static.FindByToken = function (token, cb) {
	let user = this;

	//토큰의 복호화
	jwt.verify(token, "secretToken", function (err, decoded) {
		// 유저아이디를 확인하여 유저확인하여 클라이언트에서 가져온 토큰과 db토큰의 일치여부 확인
		user.findOne({
			"_id": decoded,
			"token": token,
			function(err, user) {
				if (err) return cb(err);
				cb(null, user);
			},
		});
	});
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
