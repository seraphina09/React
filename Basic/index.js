const express = require("express");
const app = express();
const port = 5000;
// respond with "hello world" when a GET request is made to the homepage
const mongoose = require("mongoose");
mongoose
	.connect(
		"mongodb+srv://jia:dolly00@reactstudy.o6e3y.mongodb.net/?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,

			// mongoose version 6이상에서는 하기 2개의 세팅은 사용하지 않는다.
			// useCreateIndex : true,
			// useFindAndModify : false
		}
	)
	.then(() => console.log("MongoDB Connected..."))
	.catch((err) => console.log(err));

app.get("/", (req, res) => {
	res.send("hello world");
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
