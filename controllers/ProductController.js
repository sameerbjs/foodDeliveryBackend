import Product from "../model/products.js";
import fs from "fs";
import path from "path";

export const addNewProduct = async (req, res) => {
    const { title, price, category, description, rest_id } = req.body;

    try {
        const product = await Product.create({
            rest_id: rest_id,
            title: title,
            price: price,
            category: category,
            description: description,
            productPic: req.file.filename,
            productPath: req.file.path,
        });

        if (product) {
            return res
                .status(200)
                .send({ message: "Product added successfully" });
        } else {
            return res.status(400).send({ error: "Product not added" });
        }
    } catch (error) {
        return res.status(400).send({ error: error });
    }
};

export const getProductDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllProduct = async (req, res) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const { id } = req.params;

    try {
        const products = await Product.find({ rest_id: id })
            .skip(skip)
            .limit(parseInt(limit))
            .exec();

        return res.status(200).send({ products: products });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};


export const getTotalProductLength = async (req, res) => {
    try {
      // Count the total number of items in the collection
      const totalItems = await Product.countDocuments();
  
      res.status(200).send({ message : totalItems });
    } catch (error) {
      res.status(500).send({ error: 'Failed to get total items' });
    }
};

export const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        const { title, description, price, category } = req.body;
        const productPath = req.file ? req.file.path : product?.productPath;
        const productPic = req.file ? req.file.filename : product?.productPic;

        if (req.file) {
            const filePath = path.join(product?.productPath);
            fs.unlink(filePath, (err) => {
                if (err)
                    return res.status(400).send({
                        error: "File cannot be deleted edit product",
                    });
            });
        }

        // Update product in the database
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                title,
                description,
                category,
                price,
                productPath,
                productPic,
            },
            { new: true }
        );

        res.status(200).send({ message: updatedProduct });
    } catch (error) {
        res.status(500).send({ error: "Failed to update product" });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).send({ error: "Product not found" });
    }

    const filePath = path.join(product?.productPath);
    fs.unlink(filePath, (err) => {
        if (err)
            return res.status(400).send({
                error: "File cannot be deleted in delete product",
            });
    });

    try {
        await Product.findByIdAndDelete(id);
        return res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};
