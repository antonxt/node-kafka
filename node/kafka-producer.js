var express = require('express');
var kafka = require('kafka-node');
var bodyParser = require('body-parser');
var url = require("url");

var app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
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
    console.log('Producer is in error state:');
    console.log(err);
});

app.listen(5001, function () {
    console.log('Kafka producer is running on port 5001.')
});

app.post('/api/click', function (req, res) {
    var msg = JSON.stringify(req.body);
    var payloads = [
        {topic: 'signals', messages: msg, partition: 0}
    ];
    producer.send(payloads, function (err, data) {
        res.json(data);
    });
});

app.get('/api/click', function (req, res) {
    var q = url.parse(req.url, true).query;
    var signals = [{
        'type': 'click',
        params: {
            'docId': q.item,
            'session': q.session,
            'query': q.q
        }
    }];
    var payloads = [
        {topic: 'signals', messages: JSON.stringify(signals), partition: 0}
    ];
    producer.send(payloads, function (err, data) {
        res.json(data);
    });
});
