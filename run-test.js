#! /usr/bin/env node
var fs = require('fs');

var txt = JSON.stringify(process.argv.slice(2));
console.log(txt);

fs.writeFileSync('/tmp/testFiles.txt', txt);

require('child_process').execSync('npm run test-e2e', {stdio:[0,1,2]});
