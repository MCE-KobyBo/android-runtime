require("globals");

var http = require("http");

onmessage = function(msg) {
     http.request({ url: "http://httpbin.org/post", method: "POST", content: JSON.stringify(msg.data)}).then(function (r) {
     }, function (e) {
         //// Argument (e) is Error!
         console.log(e);
     });
}