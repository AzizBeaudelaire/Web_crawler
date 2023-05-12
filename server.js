const http = require('http');
const fs = require('fs');
const puppeteer = require('puppeteer');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile('./index.html', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log('[SERVER_READY] : on http://localhost:' + PORT + ' ✅');
  console.log('[SERVER_INFO] : To stop the program : Ctrl + c');
});

(async () => { // pour pas crash
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  console.log('[PUPPETEER] : Page title: ' + await page.title());
  await browser.close();
})();

  