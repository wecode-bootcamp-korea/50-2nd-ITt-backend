const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan =require('morgan')
const dotenv = require('dotenv');
dotenv.config()
const routes = require('./src/routes');


const createApp = () => {
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("combined"))
app.use(routes);

return app
};

// const app = express()
// app.use(cors())
// app.use(express.json())
// app.use(routes)

// const server = http.createServer(app)
// const start = async () => {
//     try {
//       server.listen(process.env.TYPEORM_SERVER_PORT, () => console.log(
//         `Server is listening on ${process.env.TYPEORM_SERVER_PORT}`))
//     } catch (err) { 
//       console.error(err)
//     }
//   }

// start()

module.exports = {createApp}