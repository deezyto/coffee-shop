require('./db/connect');
const express = require('express');
const userRouter = require('./routers/user');
const app = express();
const port = process.env.PORT || 5025

app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
	console.log(`Server start on ${port} port`);
});