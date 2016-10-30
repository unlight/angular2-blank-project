const bundless = require('bundless/sample-server');
const express = require('express');
const path = require('path');

const app = express();
const topology = {
    rootDir: process.cwd(),
    srcDir: 'src',             // Your local .js files, relative to rootDir
    // srcMount: '/modules',       // URL prefix of local files
    // libMount: '/lib',           // URL prefix of libraries (npm dependencies)
    // nodeMount: '/$node',        // Internal URL prefix of Node.js libraries
};
app.use(bundless.express(topology));
app.get('/', (req, res) => res.sendFile(path.resolve(process.cwd(), 'index.html')));

app.listen(8080, function (err) {
    err ? console.error(err) : console.log(`Listening at ${this.address().address}:${this.address().port}`);
});
