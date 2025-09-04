const express = require('express');
const router = express.Router();
const locationController = require('../Controller/Master/locationcontroller');

router.get('/location/list', locationController.list);
router.post('/location/add', locationController.store);
router.post('/location/uniqueCheck', locationController.uniqueCheck);
router.post('/location/statusChange', locationController.statusChange);
router.post('/location/delete', locationController.deleteLocation);
router.get('/location/view/:id', locationController.selectOne);
router.post('/location/edit/submit', locationController.updates);

module.exports = router;