"use strict";

const router = require("express").Router(),
    algoController=require("../controllers/algoController"),
    apiController = require("../controllers/apiController");

router.get("/:ticker", apiController.stockAPI);
router.get("/algo1/:ticker",algoController.algo1);
module.exports = router;
