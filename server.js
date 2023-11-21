require('dotenv').config();

const { createApp } = require('./app');
const { appDataSource } = require('./src/utils/database');

const start = async () => {
    const app = createApp();
    const PORT = process.env.TYPEORM_SERVER_PORT;

    await appDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialize");
    }).catch((err) => {
        console.err("Error occurred during Data Source initialization", err)
    })

    app.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}`)
    });
};

start()