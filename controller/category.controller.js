const Category = require('../models/Category')

const showCategory = async (req,res) => {
    try {
        const category = await Category.findById(req.params.id)
        res.status(200).json({data:category})
    }catch (e) {
        res.status(500).json({error:e})
    }
}

const getAllCategory = async (req,res) => {
    try {
        const category = await Category.find({}).sort({createdAt: -1})
        res.status(200).json({category})
    }catch (e) {
        res.status(500).json({error:e})
    }
}

const storeCategory = async (req,res) => {
    try {
        const {name} = req.body
        const image = req.file ? req.file.path : undefined;
        const category = await Category.create({name, image})
        res.status(201).json(category)
    }catch (e) {
        res.status(500).json({error:e})
    }
}

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file ? req.file.path : undefined;
        const updatedData = { name };
        if (image) updatedData.image = image;
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(updatedCategory);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server error" });
    }
};


const destroyCategory = async (req,res) => {
    try {
        await Category.findByIdAndDelete(req.params.id)
        res.status(200).json({message: "Category deleted successfully"})
    }catch (e) {
        res.status(500).json({error:e})
    }
}

module.exports = {getAllCategory,storeCategory,updateCategory,destroyCategory,showCategory}