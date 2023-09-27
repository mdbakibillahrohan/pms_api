require("dotenv").config();
const express = require("express");
const cors = require('cors')

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const body_parser = require("body-parser");
const port = process.env.PORT || 3000;
const router = require("./routes/router");
const expressListRoutes = require("express-list-routes");
const {executeSqlB,executeSql,executeSqlB2} = require("./util/db");


// app.use(express.json({limit: '50mb'}));
app.use(body_parser.json());
app.use(cors())
app.use((req, res, next)=>{
  req.io = io;
  next();
},router);

const executeStatement=async()=>{
  const sql=`Select * from Company`;

  const datas=await executeSqlB(sql);

  console.log(datas)
}

io.on("connection", (socket)=>{
  console.log("a new connection created")
})
server.listen(port,async () => {
  expressListRoutes(router, { prefix: "", spacer: 15, color: true, logger: console.info});

  // Test databse.
 // executeStatement();
 
  console.log(`Server running on http://192.168.61.46:${port}`);
});

