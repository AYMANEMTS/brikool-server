const express = require('express');
const router = express.Router();
const checkValidation = require("../middlewares/checkValidation");
const {destroyJob,updateJob,storeJob,showJob,getJobs,addComment, addRating, changeStatus} = require('../controller/job.controller')
const {jobForm,addCommentValidation, ratingValidation} = require('../validators/jobValidation')
const upload = require('../config/multerConfig');
const verifyToken = require("../middlewares/verifyToken");


router.get('/',getJobs)
router.get('/:id',showJob)
router.post('/',upload.none(),verifyToken,jobForm,checkValidation,storeJob)
router.put('/:id',upload.none(),verifyToken,jobForm,checkValidation,updateJob)
router.delete('/:id',verifyToken,destroyJob)
router.post('/:id/add-comment',upload.none(),verifyToken,addCommentValidation,checkValidation,addComment)
router.post('/:id/add-rating',upload.none(),verifyToken,ratingValidation,checkValidation,addRating)
router.post('/:id/change-status',upload.none(),verifyToken,changeStatus)


module.exports = router
