#!/usr/bin/env node
var spawn = require("child_process").spawn;
var electron = require("electron-prebuilt");
var path = require("path");
var parse = require("parse-diff");
var stdin = require("get-stdin")();
var Readable = require("stream").Readable;

var serverPath = path.join(__dirname, "./server.js")
var args = [serverPath];

if (process.stdin.isTTY) {
  console.error("No stdin provided.");
  process.exit(1);
}

stdin.then(function (raw) {
  var diff = parse(raw);

  if (!(diff instanceof Array) || diff.length === 0) {
    console.error("Could not parse diff.");
    process.exit(1);
  }

  var proc = spawn(electron, args)

  var stream = new Readable();

  stream.push(JSON.stringify(diff));
  stream.push(null);

  stream.pipe(proc.stdin);
});
