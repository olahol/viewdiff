"use strict";

var ipc = require("ipc");
var React = require("react");
var ReactDOM = require("react-dom");

var _require = require("path");

var extname = _require.extname;

var _require2 = require("lang-map");

var languages = _require2.languages;

var _require3 = require("highlight.js");

var highlight = _require3.highlight;

function Change(props) {
  var ln1 = props.normal ? props.ln1 : props.ln;
  var ln2 = props.normal ? props.ln2 : props.ln;

  var html = props.content;

  try {
    html = highlight(props.lang, props.content).value;
  } catch (e) {}

  return React.createElement(
    "tr",
    { className: props.type },
    React.createElement(
      "td",
      { className: "nostretch" },
      !props.add && ln1
    ),
    React.createElement(
      "td",
      { className: "nostretch" },
      !props.del && ln2
    ),
    React.createElement(
      "td",
      null,
      React.createElement("pre", { dangerouslySetInnerHTML: { __html: html } })
    )
  );
}

function Chunk(props, index) {
  props.changes.forEach(function (change) {
    change.lang = props.lang;
  });

  return React.createElement(
    "tbody",
    null,
    React.createElement(
      "tr",
      { className: "chunk" },
      React.createElement(
        "td",
        { className: "nostretch" },
        "---"
      ),
      React.createElement(
        "td",
        { className: "nostretch" },
        "+++"
      ),
      React.createElement(
        "td",
        null,
        props.content
      )
    ),
    props.changes.map(Change)
  );
}

function Part(props, index) {
  var from = props.from;
  var to = props.to;
  var additions = props.additions;
  var deletions = props.deletions;
  var chunks = props.chunks;

  var fileName = to === "/dev/null" ? from : to;

  var ext = extname(fileName);
  var langs = languages(ext);

  chunks.forEach(function (chunk) {
    chunk.lang = langs[0];
  });

  return React.createElement(
    "article",
    null,
    React.createElement(
      "header",
      null,
      React.createElement(
        "span",
        { className: "adds" },
        "+++ ",
        additions
      ),
      React.createElement(
        "span",
        { className: "dels" },
        "--- ",
        deletions
      ),
      React.createElement(
        "strong",
        { className: "file-name" },
        fileName
      )
    ),
    React.createElement(
      "main",
      null,
      React.createElement(
        "table",
        null,
        chunks.map(Chunk)
      )
    )
  );
}

function Main(props) {
  return React.createElement(
    "div",
    null,
    props.diff.map(Part)
  );
}

ipc.on("diff", function (raw) {
  var diff = JSON.parse(raw);

  ReactDOM.render(React.createElement(Main, { diff: diff }), document.getElementById("content"));
});

