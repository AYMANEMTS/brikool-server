const express = require('express');
const router = express.Router();
const upload = require("../config/multerConfig");
const {storeClient} = require("../controller/client.controller");
const {updateUserPermissions,getUsers, changeJobStatus, deleteJob, changeUserRole} = require("../controller/admin.controller");
const checkAuthorization = require("../middlewares/checkAuthorization");
const verifyToken = require("../middlewares/verifyToken");
const User = require("../models/User");
const Job = require("../models/Job");

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

router.get('/dashboard-cards',
    verifyToken, checkAuthorization(), upload.none(), async (req, res) => {
        try {
            const totalUser = await User.countDocuments();
            const totalJobs = await Job.countDocuments();

            const jobsSuspended = await Job.countDocuments({ status: 'suspended' });
            const jobsActivated = await Job.countDocuments({ status: 'active' });

            const data = {
                totalUser, totalJobs,jobsSuspended, jobsActivated
            }
            res.status(200).json(data);
        } catch (e) {
            console.error(e)
            res.status(500).json({ error: e.message });
        }
    })

module.exports = router
