const http = require('http');
const fs = require('fs');
const process = require('process');

const hostname = '0.0.0.0';
const port = 3000;
const publicFolderPath = '.';

function getFile(filepath, res) {
    fs.readFile(publicFolderPath + filepath, (err, data) => {
        if (err) {
            let cwd = process.cwd();
            res.writeHead(500);
            res.end('Error loading ' + cwd + " " + filepath);
        } else {
            res.writeHead(200, { 'Content-Type': (filepath.split('.')[1]) ? `text/${filepath.split('.')[1]}` : 'text/html' });
            res.end(data);
        }
    });
}

const server = http.createServer((req, res) => {
    console.log(req.url);
    if (req.url == '/') getFile('/index.html', res);
    else {
        getFile(req.url, res);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});