require('./db/db.connect');
const express = require('express');
const cors = require("cors");
const routersGet = require('./routers/routers.get');
const routersPost = require('./routers/routers.post');
const routersPut = require('./routers/routers.put');
const routersDelete = require('./routers/routers.delete');

const app = express();
const port = process.env.PORT || 5025
const corsOptions ={
	origin: 'http://127.0.0.1:3020', 
	credentials: true,
	optionSuccessStatus: 200,
}
 
app.use(cors(corsOptions))

app.use(express.json());

app.use(routersPost);
app.use(routersPut);
app.use(routersDelete);
app.use(routersGet);

app.listen(port, () => {
	console.log(`Server start on ${port} port`);
});