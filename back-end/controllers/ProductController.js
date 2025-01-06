import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";

export const getProduct = async (req, res) => {
    try {
        const response = await Product.findAll();
        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Failed to fetch products" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const response = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!response) return res.status(404).json({ msg: "Product not found" });
        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Failed to fetch product by ID" });
    }
};

export const saveProduct = (req, res) => {
    if (!req.files || !req.files.file)
        return res.status(400).json({ msg: "No File Uploaded" });

    const name = req.body.name;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name).toLowerCase();
    const fileName = `${file.md5}${ext}`;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedTypes.includes(ext))
        return res.status(422).json({ msg: "Invalid image format" });

    if (fileSize > 5 * 1024 * 1024)
        return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });

        try {
            await Product.create({ name, image: fileName, url });
            res.status(201).json({ msg: "Product created successfully" });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: "Failed to create product" });
        }
    });
};

export const updateProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!product) return res.status(404).json({ msg: "Product not found" });

    let fileName = product.image; // awalnya jadi = "" 
    if (req.files == null) {
        fileName = Product.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name).toLowerCase();
        fileName = `${file.md5}${ext}`;
        const allowedTypes = ['.png', '.jpg', '.jpeg'];

        if (!allowedTypes.includes(ext))
            return res.status(422).json({ msg: "Invalid image format" });
        if (fileSize > 5 * 1024 * 1024)
            return res.status(422).json({ msg: "Image must be less than 5 MB" });

        const filepath = `./public/images/${product.image}`;
        try {
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath); // Delete the old image file
            }
        } catch (err) {
            console.error("Error deleting old image:", err.message);
            return res.status(500).json({ msg: "Error deleting old image" });
        }

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const name = req.body.name;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    try {
        await Product.update({name: name, img: fileName, url: url}, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product Updated Successfully"});
    } catch (error) {
        console.log(error.message);
    }

};

export const deleteProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!product) return res.status(404).json({ msg: "Product not found" });


    try {
        const filepath = `./public/images/${product.image}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath); // Delete image file
        }
        
        await Product.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Product deleted successfully" });
    } catch (error) {
        console.error(error.message);
    }
};
