const mongoose = require("mongoose");
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

const User = mongoose.model("User", userSchema);

module.exports = { User };
