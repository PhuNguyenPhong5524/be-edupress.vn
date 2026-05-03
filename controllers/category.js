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


