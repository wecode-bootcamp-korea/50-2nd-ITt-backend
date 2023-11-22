const express = require('express');
const router = express.Router();
const dummyController = require("../controllers/dummyController")

router.post('/' , dummyController.addDummy)

module.exports.router = router;