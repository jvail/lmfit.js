const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
	console.log(req.url);
	const ext = path.extname(req.url);
	let content;
	try {
		content = fs.readFileSync(`${__dirname}/../${req.url}`);
	} catch (ex) {
		if (ex.code === "ENOENT") {
			res.statusCode = 404;
			res.end("Not found.");
			return;
		}
		throw ex;
	}
	res.setHeader("Content-Type",
		ext === ".html" ? "text/html" :
		ext === ".js" ? "text/javascript;charset=UTF-8" : "");
	res.end(content);
});

server.listen(50000, () => {
	console.log(`Listening on http://localhost:${server.address().port}`);
});
