const express = require('express');
const   router = express.Router();
const uploadController = require('../Controller/Admin/Uploadcontroller');
const hostellerController = require('../Controller/Admin/HostellerController');
const rentManagementController = require('../Controller/RentMangement/Rentmanagement');

const { createImageHandler } = require('../Middleware/Middleware');

router.get('/upload/list', uploadController.list);
router.get('/upload/view/:id', uploadController.view);

router.get('/master/hostellers/list', hostellerController.list);
router.get('/master/hostellers/getHosteller/:id', hostellerController.selectOne);
router.get('/master/hostellers/userId/:id', hostellerController.selectUsingUserId);
router.post('/master/hostellers/add', createImageHandler("hosteller", false), hostellerController.store);
router.post('/master/hostellers/updates', createImageHandler("hosteller", true), hostellerController.updates);
router.post('/master/hostellers/statusChange', hostellerController.statusChange);
router.post('/master/hostellers/statusUpdate', hostellerController.statusUpdate);
router.post('/master/hostellers/delete', hostellerController.deleteHosteller);
router.get('/master/rooms/getHostellers/:id', hostellerController.getPeoples);
router.get('/master/rooms/getHostellers/:location_id/:hostel_id/:building_id/:room_id', hostellerController.getHosteller)
router.post('/master/hostellers/searchValues', hostellerController.searchValues);
router.post('/master/hostellers/uniqueCheck', hostellerController.uniqueCheck);

router.post('/rent-management/hostellers/rentPaidStatus', rentManagementController.paidStatusUpdate);


module.exports = router;
