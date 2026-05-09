import categoryModel from "../models/category.js";


export const createCategory = async (req, res) => {
    try {
        const { cate_name, icon_key, quantity } = req.body;
        if(!cate_name || !icon_key ) {
            return res.status(400).send({
                message: "Missing required fields"
            });
        }

        const newCategory = await categoryModel.create({
            cate_name,
            icon_key,
            quantity: quantity || 0
        });
        return res.status(201).send({
            message: "Tạo danh mục thành công!",
            category: newCategory
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}


export const getAllCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        return res.status(200).send({
            message: "Lấy danh sách danh mục thành công!",
            categories
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}