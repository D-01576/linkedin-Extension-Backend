const express = require("express");
const { Stats, Tracking } = require("./Schema/Schema");
const axios = require("axios")
require("dotenv").config;
const app = express();

console.log('MongoDB URI:', process.env.MONGODB_URI);
const access_key = "c2c194ca1fb15132ae1b1375466f4bd8";

app.get('/tracking-pixel', async (req, res) => {
    console.log("jkasdf")
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
    try {
      let stats = await Stats.findOne();
      if (!stats) {
        stats = new Stats({ totalClicks: 0, uniqueIPs: 0 });
      }
  
      stats.totalClicks += 1;
  
      let existingRecord = await Tracking.findOne({ ip });
  
      if (!existingRecord) {
        stats.uniqueIPs += 1;
  
        const locationResponse = await axios.get(`http://api.ipstack.com/${ip}?access_key=${access_key}`);
        const locationData = locationResponse.data;
        console.log(locationData)
  
        const newTracking = new Tracking({
          ip: ip,
          location: {
            city: locationData.city,
            country: locationData.country_name,
          },
        });
        await newTracking.save();
      }
  
      await stats.save();
  
      res.writeHead(200, { 'Content-Type': 'image/png' });
      const pixel = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, /*...binary data*/ ]);
      res.end(pixel, 'binary');
  
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
app.listen(3000,()=>{
    console.log("listening")
})