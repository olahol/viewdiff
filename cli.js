#!/usr/bin/env node
var spawn = require("child_process").spawn
var electron = require("electron-prebuilt")
var path = require("path")
var fs = require("fs")

var serverPath = path.join(__dirname, "./server.js")
var args = [serverPath];

if (!process.stdin.isTTY) {
  var proc = spawn(electron, args)
  process.stdin.pipe(proc.stdin)
} else {
  console.error("No stdin provided");
  process.exit(1);
}
