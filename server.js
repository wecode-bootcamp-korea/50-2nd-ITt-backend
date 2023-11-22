const http = require("http");
const dotenv = require("dotenv");
const createApp = require("./app");
dotenv.config();

const app = createApp();

const server = http.createServer(app);
const port = process.env.TYPEORM_SERVER_PORT;
const start = async () => {
  try {
    server.listen(port, () => console.log(`Server is listening on ${port}`));
  } catch (err) {
    console.error(err);
  }
};
start();
