const express = require('express');
const router = express.Router();
const {getAllCategory,storeCategory,destroyCategory,updateCategory,showCategory} = require('../controller/category.controller')
const checkValidation = require("../middlewares/checkValidation");
const { createCategoryValidation } = require('../validators/catrgoryValidation')
const upload = require('../config/multerConfig');
const checkAuthorization = require("../middlewares/checkAuthorization");
const verifyToken = require("../middlewares/verifyToken");

router.get('/',getAllCategory)
router.get('/:id',showCategory)

router.post('/',
    verifyToken, checkAuthorization('create_category'), upload.single('image'),
    createCategoryValidation, checkValidation, storeCategory)

router.put('/:id',
    verifyToken,checkAuthorization('edit_category'),upload.single('image')
    ,createCategoryValidation,checkValidation,updateCategory)

router.delete('/:id',
    verifyToken,checkAuthorization('delete_category'),destroyCategory)

module.exports = router