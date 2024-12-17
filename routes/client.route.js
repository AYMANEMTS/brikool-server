const express = require('express');
const {updateClient, destroyClient, getUserJobs} = require("../controller/client.controller");
const router = express.Router();
const upload = require('../config/multerConfig');
const verifyToken = require("../middlewares/verifyToken");

// router.post('/', storeClient)


// router.get("/:id",showClient)

router.put("/",upload.single('image') ,verifyToken,updateClient)

router.delete("/:id",upload.single('image') ,verifyToken, destroyClient)
router.get('/jobs',verifyToken,getUserJobs)

module.exports = router;
