#!/usr/bin/env node
var spawn = require("child_process").spawn
var electron = require("electron-prebuilt")
var path = require("path")
var fs = require("fs")

var serverPath = path.join(__dirname, "./server.js")
var args = [serverPath];

var hasRead = false;
process.stdin.on('readable', function () {
  var partial = process.stdin.read(1);
  if (!partial) {
    console.error("Your branch has no changes to view.");
    process.exit(0);
  }
  if (partial && !hasRead) {
    partial = partial.toString().trim();
    hasRead = true;
    if (!process.stdin.isTTY && partial !== "") {
      var proc = spawn(electron, args)
      process.stdin.pipe(proc.stdin)
    } else if (partial === "") {
      console.error("Your branch has no changes to view.");
      process.exit(0);
    } else {
      console.error("No stdin provided");
      process.exit(1);
    }
  }
});
