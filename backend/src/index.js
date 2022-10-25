require('./db/db.connect');
const express = require('express');
const cors = require("cors");
const userRouter = require('./routers/routers.user');
const itemRouter = require('./routers/routers.item');
const categoryRouter = require('./routers/routers.category');

const app = express();
const port = process.env.PORT || 5025
const corsOptions ={
	origin: 'http://127.0.0.1:3020', 
	credentials: true,
	optionSuccessStatus: 200,
}
 
app.use(cors(corsOptions))

app.use(express.json());

app.use(userRouter);
app.use(itemRouter);
app.use(categoryRouter);

app.listen(port, () => {
	console.log(`Server start on ${port} port`);
});