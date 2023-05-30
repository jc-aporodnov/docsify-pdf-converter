#!/usr/bin/env node

const rcfile = require("rcfile");
console.log(process.cwd());

const config = rcfile("docsifytopdf");

require("../src/index.js")(config);
