var app = require("app");
var BrowserWindow = require("browser-window");
var stdin = require("get-stdin")();

var window = null;

app.on("window-all-closed", function() {
  app.quit();
});


app.on("ready", function() {
  window = new BrowserWindow({title: "viewdiff", width: 800, height: 600});
  window.setMenu(null);
  window.loadUrl("file://" + __dirname + "/index.html");
  window.on("closed", function() {
    window = null;
  });

  window.webContents.on("did-finish-load", function () {
    stdin.then(function (body) {
      window.webContents.send("diff", body);
    });
  });
});
