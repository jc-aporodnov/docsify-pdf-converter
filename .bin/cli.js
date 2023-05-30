#!/usr/bin/env node

const rcfile = require("rcfile");

const config = rcfile("docsifytopdf");

console.log(process.cwd());

require("../src/index.js")(config);
