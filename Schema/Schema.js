const mongoose = require('mongoose');
require("dotenv").config;

const mongoDBURI = 'mongodb://sarfaraz01576:3KQPtlC1WKVqm8aX@ac-si9dluk-shard-00-00.e0cgrm7.mongodb.net:27017,ac-si9dluk-shard-00-01.e0cgrm7.mongodb.net:27017,ac-si9dluk-shard-00-02.e0cgrm7.mongodb.net:27017/?replicaSet=atlas-12tgl7-shard-0&ssl=true&authSource=admin';

mongoose.connect(mongoDBURI);

const trackingSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  location: {
    city: String,
    country: String,
  },
  lastAccessed: { type: Date, default: Date.now },
});

const statsSchema = new mongoose.Schema({
  totalClicks: { type: Number, default: 0 },
  uniqueIPs: { type: Number, default: 0 },
});

const Tracking = mongoose.model('Tracking', trackingSchema);
const Stats = mongoose.model('Stats', statsSchema);

module.exports = {
    Tracking,
    Stats
}
