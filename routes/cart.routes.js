const express = require('express');

const router = express.Router();
const cartManager = require("../src/CartManager.js");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//setup

async function createCart(req, res) {
    const data = req.body;

    //USAGE: post as a JSON array i.e ["Test", "Test2", "Test3"]
    //Existing product IDs must be used, otherwise the cart arrays will be empty.

    //Create a cart instance and add the request body items to it.
    const cart = await cartManager.instance.createCart(data)

    try {
        if (cart) {
            res.send(cart);
        } else {
            res.send("Could not create cart");
        }
    } catch (error) {
        console.error('Error creating cart:', error.message);
        res.status(500).send(`Internal Server Error ${error}`);
    }
}

async function getCartInfo(req, res) {
    const id = req.params.cid;
    const cart = await cartManager.instance.getCart(id);

    try {
        if (cart) {
            res.send(cart);
        } else {
            res.send("Cart not found");
        }
    } catch (error) {
        console.error('Error retrieving cart:', error.message);
        res.status(500).send(`Internal Server Error ${error}`);
    }
}

async function addToCart(req, res) {
    const cartID = req.params.cid;
    const data = req.params.pid;

    const cart = await cartManager.instance.addToCart(cartID, data);

    try {
        if (cart) {
            res.send(cart);
        } else {
            res.send("Could not update cart");
        }
    } catch (error) {
        console.error('Error creating cart:', error.message);
        res.status(500).send(`Internal Server Error ${error}`);
    }

}

//Endpoint for adding a new cart
router.post('/api/carts/', createCart);
// Endpoint for getting a cart with it's products
router.get('/api/carts/:cid', getCartInfo);
// Endpoint for adding a product to a specific cart
router.post('/api/carts/:cid/product/:pid', addToCart);

module.exports = router;