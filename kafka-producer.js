var express = require('express');
var kafka = require('kafka-node');
var bodyParser = require('body-parser');

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
    console.log('Producer is in error state');
    console.log(err);
});


app.get('/', function (req, res) {
    res.json({greeting: 'Kafka Producer'})
});

app.listen(5001, function () {
    console.log('Kafka producer is running at 5001')
});
