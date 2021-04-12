"use strict";

const router = require("express").Router(),
    apiController = require("../controllers/apiController");

router.get("/",apiController.stockAPI);

module.exports = router;
