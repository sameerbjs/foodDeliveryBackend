import Product from "../model/products.js";
import mongoose from 'mongoose';
import grid from "gridfs-stream";

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once("open", () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads",
    });
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
});

export const addNewProduct = async (req, res) => {
    const { title, price, category, description, rest_id, size, productPic } = req.body;

    try {
        const product = await Product.create({
            rest_id: rest_id,
            title: title,
            price: price,
            category: category,
            quantity: 1,
            size: size,
            resturant : rest_id,
            description: description,
            productPic: productPic,
        });

        if (product) {
            return res
                .status(200)
                .send({ message: "Product added successfully" });
        } else {
            return res.status(400).send({ error: "Product not added" });
        }
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
};

export const getProductDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('resturant', 'city address')
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllProduct = async (req, res) => {
    const { page, limit, category } = req.query;
    const skip = (page - 1) * limit;
    const { id } = req.params;
    let products;
    try {
        if (category) {
            products = await Product.find({ rest_id: id, category: category })
                .skip(skip)
                .limit(parseInt(limit))
                .exec();
        } else {
            products = await Product.find({ rest_id: id })
                .skip(skip)
                .limit(parseInt(limit))
                .exec();
        }
        return res.status(200).send({ products: products });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

export const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        const { title, description, price, category, size, productPic } = req.body;

        if (product.productPic !== productPic) {
            const productDel = product.productPic.split('/')[5];
            const file = await gfs.files.findOne({
                filename: productDel,
            });
            if (!file) {
                return res.status(404).send('No file found');
            }
            gridfsBucket.delete(file._id);
        }
        // Update product in the database
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                title,
                description,
                category,
                price,
                productPic,
                size
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
    const productDel = product.productPic.split('/')[5];
    const file = await gfs.files.findOne({
        filename: productDel,
    });
    if (!file) {
        return res.status(404).send('No file found');
    }
    try {
        gridfsBucket.delete(file._id);
        await Product.findByIdAndDelete(id);
        return res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};
