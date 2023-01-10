const http = require("http");
const fs = require("fs");
const path = require("path");

const html = scriptSource => `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>lmfit</title>
</head>
<body>
    <script type="module" src="${scriptSource}.js"></script>
</body>
`;

const server = http.createServer((req, res) => {
    console.log(req.url);
    const ext = path.extname(req.url);
    const base = path.basename(req.url, ext);
    let content;
    try {
        content = ext === ".html" ?
            html(base) : fs.readFileSync(`${__dirname}/../${req.url}`);
    } catch (ex) {
        if (ex.code === "ENOENT") {
            res.statusCode = 404;
            res.end("Not found.");
            return;
        }
        throw ex;
    }
    // 'wasm-unsafe-eval' is safer, but only supported by Chrome 97, Safari 16
    // and Firefox 102, so 'unsafe-eval' is used instead.
    res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-eval'");
    res.setHeader("Content-Type",
        ext === ".html" ? "text/html" :
        ext === ".js" ? "text/javascript;charset=UTF-8" :
        ext === ".wasm" ? "application/wasm" : "");
    res.end(content);
});

server.listen(50000, () => {
    console.log(`Listening on http://localhost:${server.address().port}`);
});
