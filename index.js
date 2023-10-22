"use strict"
require("dotenv").config();
const ip = require('ip');
const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const {dbConnectionChecker} = require('./util/dao');
const {dbConfig, dbConfig2} = require('./util/settings');
const app = express();
const server = require('http').createServer(app);
const router = require("./routes/router");
const chalk = require("chalk");
const io = require('socket.io')(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(morgan('dev'));
const body_parser = require("body-parser");
const { getEndpoints, getSpaceForPrintingPath } = require("./util/helper");
const port = process.env.PORT || 3000;
app.use(express.static("public"))
app.use(body_parser.json());
app.use(cors());
app.use((req, _, next)=>{
  req.io = io;
  next();
},router);

app.use((err, req, res, next)=>{
  if(err){
    res.status(500).send(err.message);
  }
})
server.listen(port,async () => {
  const endpoints = getEndpoints(router);
  console.log("Method" + '            ' + "Path");
  console.log("------" + '            ' + "-----");
  endpoints.forEach((endpoint) => {
    const cleanedPath = endpoint.path.slice(12);
    const spaces = getSpaceForPrintingPath(endpoint.method, 15);
    console.log(chalk.green(endpoint.method.toUpperCase()) + spaces + chalk.yellowBright(cleanedPath));
  });
  await dbConnectionChecker(dbConfig);
  await dbConnectionChecker(dbConfig2);
  const ipAddress = ip.address();
  console.log(`\x1b[33m Server is running on http://localhost:${port} \x1b[0m`);
  console.log(`\x1b[33m Server is running on http://${ipAddress}:${port} \x1b[0m`);
});

