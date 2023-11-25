const express = require('express');

const router = express.Router();
const productManager = require("../src/ProductManager.js");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//setup

// Function to handle individual product by ID
async function getProductByID(req, res) {
    const productID = req.params.pid;

    try {
        const product = await productManager.instance.getProductByID(productID);
        if (product) {
            res.send(product);
        } else {
            res.send(`<h1>Product not found</h1>`);
        }
    } catch (error) {
        console.error('Error getting product by ID:', error.message);
        res.status(500).send(`Internal Server Error ${error}`);
    }
}

// Function to handle list of products with a limit
async function getProductsByLimit(req, res) {
    const limit = req.query.limit;

    try {
        const products = await productManager.instance.getProducts(limit);
        res.send(products);
    } catch (error) {
        console.error('Error getting products by limit:', error.message);
        res.status(500).send(`Internal Server Error ${error}`);
    }
}

async function addProduct(req, res) {
    const data = req.body; // Use req.body to get data from the request body
    console.log(data);
    try {
        const product = await productManager.instance.addProduct(data);

        if(product.success) {
            res.send("Product added successfully");
        } else {
            res.send("The product could not be added");
        }

    } catch (error) {
        console.error('Error adding product:', error.message);
        res.status(500).send(`Internal Server Error ${error}`);
    }
}

async function updateProductByID(req, res) {
    const data = req.body;
    const id = req.params.pid;

    try {
        const updateResult = await productManager.instance.updateProduct(id, data);
        if (updateResult.success) {
            res.send(`Item with ID ${id} updated successfully, ${data}`);
        } else {
            res.status(404).send(`Product with ID ${id} not found.`);
        }
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).send(`Internal Server Error ${error}`);
    }
}

async function deleteProductByID(req, res) {
    const id = req.params.pid;

    try {
        const deletionResult = await productManager.instance.deleteProductByID(id);

        if (deletionResult.success) {
            res.send(`Item with ID ${id} removed successfully.`);
        } else {
            res.status(404).send(`Product with ID ${id} not found.`);
        }
    } catch (error) {
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
}

// Endpoint for getting a list of products based on a limit provided
router.get('/api/products/', getProductsByLimit);
// Endpoint for getting a product by its ID
router.get('/api/products/:pid', getProductByID);
//Endpoint for adding a new product
router.post('/api/products/', addProduct);
//Endpoint for updating an existing product
router.put('/api/products/:pid', updateProductByID);
//Endpoint for removing a product from the database
router.delete('/api/products/:pid', deleteProductByID)

module.exports = router;