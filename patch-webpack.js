// const fs = require('fs');
// const f = 'node_modules/@angular-devkit/build-angular/src/webpack/configs/browser.js';
 
// fs.readFile(f, 'utf8', function (err,data) {
//   if (err) {
//     return console.log(err);
//   }
//   let result = data.replace(/node: false/g, "node: {crypto: true, buffer: true, os: true, net: true, https: true, tls: true, zlib: true, path: true, stream: true, fs: 'empty', net: 'empty'}");
 
//   fs.writeFile(f, result, 'utf8', function (err) {
//     if (err) return console.log(err);
//   });
// });