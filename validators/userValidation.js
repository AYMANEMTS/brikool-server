const {check} = require('express-validator');
const User = require('../models/User');

const requiredFieldMessage = {
    "en": "This field is required",
    "fr": "Ce champ est obligatoire",
    "ar": "هذه الخانة مطلوبة"
};
const minimumFieldMessage = (min) => {
    return {
        "en": `Minimum character is ${min}`,
        "fr": `Le nombre minimum de caractères est ${min}`,
        "ar": `الحد الأدنى لعدد الأحرف هو ${min}`,
    };
};
const invalidEmail = {
    "en": "Invalid email",
    "fr": "Adresse e-mail invalide",
    "ar": "البريد الإلكتروني غير صالح"
};
const userAlreadyExists = {
    "en": "User already exists",
    "fr": "L'utilisateur existe déjà",
    "ar": "المستخدم موجود بالفعل"
};



exports.createClientValidation = [
    check('name')
        .notEmpty().withMessage(requiredFieldMessage)
        .isLength({min:4}).withMessage(minimumFieldMessage(4)),
    check('email')
        .notEmpty().withMessage(requiredFieldMessage)
        .isEmail().withMessage(invalidEmail)
        .custom((val) => User.findOne({ email: val })
            .then((user) => {
                if (user){
                    return Promise.reject(new Error(userAlreadyExists));
                }
            })
        ),
    check('password')
        .notEmpty().withMessage(requiredFieldMessage)
        .isLength({min:7}).withMessage(minimumFieldMessage(7)),

]

exports.loginValidation = [
    check('email')
        .notEmpty().withMessage(requiredFieldMessage)
        .isEmail().withMessage(invalidEmail),
    check('password')
        .notEmpty().withMessage(requiredFieldMessage)
]