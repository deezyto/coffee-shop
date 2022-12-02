const app = require('./app');
app.listen(process.env.PORT, () => {
	console.log(`Server start on ${process.env.PORT} port`);
});