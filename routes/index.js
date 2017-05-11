'use strict';

var express = require('express');
var router = express.Router();
const inside = require('point-in-polygon');
const _ = require('underscore');

// IVAO Controller
const ivaoDataTransformer = require('../controllers/ivao/transformData');

// Area of traffic model
const areaOfTraffic = require('../models/areas/trafficArea');

/* GET home page. */
router.get('/', function(req, res) {
  // We call the ivao data transformer controller to get the data nicely formatted
  ivaoDataTransformer.result((data) => {
    // We filter out any object that is not flying near the EHAA FIR.
    const result = _.chain(data)
    .filter((item) => {
      // We return true of the item coordinates are inside the areaOfTraffic model
      // and the airplane is not on the ground
      return inside([item.latitude, item.longtitude], areaOfTraffic.area) &&
      parseInt(item.onGround) === 0;
    })
    .value();

    res.send(result);
  });
  // res.render('index', { title: 'Express' });
});

module.exports = router;
