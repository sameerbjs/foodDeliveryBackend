import Category from "../model/category.js";
import Product from "../model/products.js";
import Resturant from "../model/resturant.js";

export const addCategory = async (req, res) => {
    try {
        const { cate_id, name, rest_id } = req.body;

        const category = new Category({
            id: cate_id,
            name: name,
            resturant: rest_id,
        });
        let savedCategory = await category.save();

        const restaurant = await Resturant.findById(rest_id);
        restaurant.categories.push(category._id);
        await restaurant.save();

        res.status(200).send({ message: 'Category added successfully', data: savedCategory });
    } catch (error) {
        res.status(500).send({ error: 'Failed to add' });
    }
}

export const getCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categories = await Category.find({ resturant: id });
        res.status(200).send({ data: categories })
    } catch (error) {
        res.status(500).send({ error: 'Failed to get' });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findOne({ _id: id });

        if (category) {
            const categoryName = category.name;

            // Delete related products
            const products = await Product.find({ category: categoryName });
            if (products.length > 0) {
                await Product.deleteMany({ category: categoryName });
            }

            // Delete the category
            await Category.findByIdAndDelete(id);

            return res.status(200).send({ message: "Category and related products deleted successfully" });
        } else {
            return res.status(404).send({ message: "Category not found" });
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};
