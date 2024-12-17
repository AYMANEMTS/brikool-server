const express = require('express');
const router = express.Router();
const upload = require("../config/multerConfig");
const {storeClient} = require("../controller/client.controller");
const {updateUserPermissions,getUsers, changeJobStatus, deleteJob, changeUserRole} = require("../controller/admin.controller");
const checkAuthorization = require("../middlewares/checkAuthorization");
const verifyToken = require("../middlewares/verifyToken");

router.get("/users",
    verifyToken, checkAuthorization('view_users'), getUsers)

router.post('/users/create',
    verifyToken, checkAuthorization('create_users') ,upload.single('image'), storeClient)

router.put('/users/:id/permissions',
    verifyToken, checkAuthorization('edit_users'), upload.none(), updateUserPermissions)

router.post('/users/:id/change-role',
    verifyToken, checkAuthorization('edit_users'), upload.none(), changeUserRole)

router.put('/jobs/:id/change-status',
    verifyToken, checkAuthorization('edit_jobs'), upload.none(), changeJobStatus)

router.delete('/jobs/:id/delete',
    verifyToken, checkAuthorization('delete_jobs'), upload.none(), deleteJob)

module.exports = router