# Kafka-node as Fusion signal buffer 
This setup would allow to collect a lot of Fusion signal data in Kafka via a simple node.js server. Later, the signals are indexed in Fusion by Fusion Kafka datasource.

## Kafka
This will install java 1.8, zookeeper, and kafka
```
brew install kafka
```

This will run ZK and kafka in terminal
```
zookeeper-server-start /usr/local/etc/kafka/zookeeper.properties & kafka-server-start /usr/local/etc/kafka/server.properties
```

This will run ZK and kafka as services
```
brew services start zookeeper
brew services start kafka
```

This will stop ZK and kafka as services
```
brew services stop kafka
brew services stop zookeeper
```

### Kafka CLI
```
kafka-topics --zookeeper localhost:2181 --list
kafka-topics --zookeeper localhost:2181 --create --replication-factor 1 --partitions 1 --topic signals
kafka-topics --zookeeper localhost:2181 --delete --topic signals
kafka-console-consumer --bootstrap-server localhost:9092 --from-beginning --topic signals
kafka-run-class kafka.tools.GetOffsetShell --broker-list localhost:9092,localhost:9093,localhost:9094 --time -1 --topic signals
```
   
## Kafka Node
How-to article: https://www.linkedin.com/pulse/introduction-kafka-using-nodejs-pankaj-panigrahi

Activate anaconda's Python 2.7 environment and install `kafka-node`
```
source activate py27
npm install express kafka-node
```   
Run the node server which will forward signals received in HTTP `POST` and `GET` requests to kafka
```
cd ~/dev/node-kafka/
node kafka-producer.js
```

## Kafka Fusion Connector
https://github.com/lucidworks/professional-services/tree/master/connectors/kafka

This will build kafka connector ZIP file ready for upload to Fusion 3.1 blob store
```
../../gradlew clean createPluginZip -DfusionHome=/Users/antonxt/dev/fusion-3.1.2/3.1.2/
```

## Throughput testing
With JMeter having Fusion, Node.js and Kafka running on the same laptop.

| JMeter > Fusion Signals API | JMeter > Node.js > Kafka > Fusion via Kafka connector|
|---|---|
|80 - 90 signals / second | 800 - 900 signals / second |