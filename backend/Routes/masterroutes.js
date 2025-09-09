const express = require('express');
const router = express.Router();
const locationController = require('../Controller/Master/locationcontroller');
const hostelController = require('../Controller/Master/hostelcontroller');
const buildingcontroller = require('../Controller/Master/buildingcontroller');

router.get('/location/list', locationController.list);
router.post('/location/add', locationController.store);
router.post('/location/uniqueCheck', locationController.uniqueCheck);
router.post('/location/statusChange', locationController.statusChange);
router.post('/location/delete', locationController.deleteLocation);
router.get('/location/view/:id', locationController.selectOne);
router.post('/location/edit/submit', locationController.updates);

router.get('/hostel/list', hostelController.list);
router.post('/hostel/add', hostelController.store);
router.post('/hostel/uniqueCheck', hostelController.uniqueCheck);
router.post('/hostel/statusChange', hostelController.statusChange);
router.post('/hostel/delete', hostelController.deleteHostel);
router.get('/hostel/view/:id', hostelController.selectOne);
router.post('/hostel/edit/submit', hostelController.updates);
router.post('/hostel/searchValues', hostelController.searchValues);
router.get('/hostel/getHostel/:id', hostelController.getHostel);

router.get('/building/list', buildingcontroller.list);
router.post('/building/add', buildingcontroller.store);
router.post('/building/uniqueCheck', buildingcontroller.uniqueCheck);
router.post('/building/statusChange', buildingcontroller.statusChange);
router.post('/building/delete', buildingcontroller.deleteHostel);
router.get('/building/view/:id', buildingcontroller.selectOne);
router.post('/building/edit/submit', buildingcontroller.updates);
router.post('/building/searchValues', buildingcontroller.searchValues);
router.get('/building/getHostel/:id', buildingcontroller.getHostel);

module.exports = router;