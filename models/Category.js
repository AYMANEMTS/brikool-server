const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    name: {
        type: {
            en: { type: String, required: true, minlength: 1, maxlength: 30 },
            fr: { type: String, required: true, minlength: 1, maxlength: 30 },
            ar: { type: String, required: true, minlength: 1, maxlength: 30 },
        },
        required: true,
    },
    image: {type: String, required: false}
},{timestamps: true})

const Category = mongoose.models.Category || mongoose.model("Category",CategorySchema)
module.exports = Category


