"use strict"
require("dotenv").config();
const ip = require('ip')
const express = require("express");
const cors = require('cors')
const {dbConnectionChecker} = require('./util/dao');
const {dbConfig, dbConfig2} = require('./util/settings');
const app = express();
const server = require('http').createServer(app);
const router = require("./routes/router");
const io = require('socket.io')(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const body_parser = require("body-parser");
const port = process.env.PORT || 3000;
const expressListRoutes = require("express-list-routes");

app.use(body_parser.json());
app.use(cors())
app.use((req, _, next)=>{
  req.io = io;
  next();
},router);

server.listen(port,async () => {
  expressListRoutes(router, { prefix: "", spacer: 15, color: true, logger: console.info});
  await dbConnectionChecker(dbConfig);
  await dbConnectionChecker(dbConfig2);
  const ipAddress = ip.address();
  console.log(`\x1b[33m Server is running on http://localhost:${port} \x1b[0m`);
  console.log(`\x1b[33m Server is running on http://${ipAddress}:${port} \x1b[0m`);
});

