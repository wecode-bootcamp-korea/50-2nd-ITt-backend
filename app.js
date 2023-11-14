const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()
const routes = require('./src/routes');
const { JsonWebTokenError } = require('jsonwebtoken');

const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)

app.get('/ping',(req, res)=>{res.json({message:'pong'})})

const server = http.createServer(app)
const start = async () => {
    try {
      server.listen(process.env.TYPEORM_SERVER_PORT, () => console.log(
        `Server is listening on ${process.env.TYPEORM_SERVER_PORT}`))
    } catch (err) { 
      console.error(err)
    }
  }
start()