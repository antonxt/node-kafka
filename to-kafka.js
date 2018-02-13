var http = require('http');
var url = require('url');
var express = require('express');
var kafka = require('kafka-node');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var Producer = kafka.Producer,
    client = new kafka.Client(),
    producer = new Producer(client);

producer.on('ready', function () {
    console.log('Producer is ready');
});

producer.on('error', function (err) {
    console.log('Producer is in error state');
    console.log(err);
});

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(req.url + '</br>');
    var q = url.parse(req.url, true).query;
    var txt = 'session: ' + q.session + "<br/>item: " + q.item + '</br>q: ' + q.q;
    res.end(txt);
}).listen(8080);
