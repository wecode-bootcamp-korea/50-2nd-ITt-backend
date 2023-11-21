require("dotenv")

const {createApp} = require("./app")
const {appDataSoure} = require("./src/utils/database")


const start = async () => {
    try {
     const app = createApp();
     appDataSoure.initialize()
.then(() => {
    console.log("Data Source has been initialize");
}).catch((err) => {
    console.err("Error occurred during Data Source initialization", err)
})
      app.listen(process.env.TYPEORM_SERVER_PORT, () => console.log(
        `Server is listening on ${process.env.TYPEORM_SERVER_PORT}`))
    } catch (err) { 
      console.error(err)
    }
  }

start();

