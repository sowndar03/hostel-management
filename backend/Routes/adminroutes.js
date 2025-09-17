const express = require('express');
const router = express.Router();
const uploadController = require('../Controller/Admin/Uploadcontroller');
const hostellerController = require('../Controller/Admin/HostellerController');
const { importImageHandler } = require('../Middleware/Middleware');

router.get('/upload/list', uploadController.list);
router.get('/upload/view/:id', uploadController.view);

router.get('/master/hostellers/list', hostellerController.list);
router.get('/master/hostellers/getHosteller/:id', hostellerController.selectOne);
router.post('/master/hostellers/add', importImageHandler("hosteller"), hostellerController.store);
router.post('/master/hostellers/statusChange', hostellerController.statusChange);
router.post('/master/hostellers/statusUpdate', hostellerController.statusUpdate);
router.post('/master/hostellers/delete', hostellerController.deleteHosteller);
router.get('/master/rooms/getHostellers/:id', hostellerController.getPeoples);
router.get('/master/rooms/getHostellers/:location_id/:hostel_id/:building_id/:room_id', hostellerController.getHosteller)


module.exports = router;
