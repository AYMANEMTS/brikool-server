const express = require('express');
const {togglePermission} = require("../controller/permission.controller");
const checkAuthorization = require("../middlewares/checkAuthorization");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();


router.post('/',verifyToken,checkAuthorization("edit_permissions"),togglePermission)

module.exports = router;
