const fs = require('fs');
const crypto = require('crypto');
const productManager = require("./ProductManager")

class Cart {
    constructor(id) {
        this.id = id;
        this.products = [];
    }

    async validateProduct(productID) {
        // Checks if the product ID exists on the product JSON of the product manager
        const itemExistsOnDatabase = await productManager.instance.getProductByID(productID);

        // Make sure to check if the item exists before trying to access its properties
        if (itemExistsOnDatabase && itemExistsOnDatabase.id === productID) {
            return true;
        }
        return false;
    }
    async addProduct(productID) {

        const status = await this.validateProduct(productID);
        console.log(status);

        if (status) {
            const existingProduct = this.products.find(entry => entry.id === productID);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                this.products.push({ product: productID, quantity: 1 });
            }
        }
    }
}

class CartManager {
    constructor(path) {
        console.log("Cart manager initialized");

        this.path = path;
        this.cartArray = [];

        // Read initial carts from file or create an empty array
        this.initialize();
    }

    async initialize() {
        // Read initial carts from file or create an empty array
        const data = await this.readCartsFromFile();
        this.cartArray = data || [];
    }

    //Hashing function for generating a cart id
    generateID() {
        const idData = `${Math.random()}`;
        const hash = crypto.createHash('md5').update(idData).digest('hex');
        return hash.toUpperCase();
    }

    //Validates if a cart can be created or not
    async validateCart(id) {
        const isIDDuplicate = this.cartArray.some(cart => cart.id === id);

        if (isIDDuplicate) {
            return false;
        }

        return true;
    }

     //Read asynchronously from a json file
    async readCartsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Handle file read error or empty file
            console.error('Error reading cart file:', error.message);
            return null;
        }
    }

    //Write asynchronously to a json file
    async writeCartsToFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.cartArray, null, 2), { encoding: 'utf-8' });
        } catch (error) {
            console.error('Error writing cart file:', error.message);
        }
    }

    //Return a cart by it's id
    async getCart(id) {
        const cart = this.cartArray.find(cart => cart.id === id);
        return cart || null;
    }

    //Add or update an element on the cart
    async addToCart(cartID, productID) {
        const cart = await this.getCart(cartID);

        if (cart) {
            const existingProduct = cart.products.find(entry => entry.product === productID);
            //Checks if products.json contains the desired product by looking for it's id.
            const itemExistsOnDatabase = await productManager.instance.getProductByID(productID);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                if (itemExistsOnDatabase) {
                    cart.products.push({ product: productID, quantity: 1 });
                }
            }

            await this.writeCartsToFile();
            return cart || null;
        }
    }

    //Creates a cart and pushes some products to it
    async createCart(products) {
        const cartID = this.generateID();

        // If the cart ID is valid, then create the cart with the specified products
        if (await this.validateCart(cartID)) {
            const newCart = new Cart(cartID);
            await Promise.all(products.map(productID => newCart.addProduct(productID)));
            this.cartArray.push(newCart);
            await this.writeCartsToFile();
            console.log(`Cart created succesfully with id ${cartID}`)
            return newCart;
        }

        return null;
    }
}

const instance = new CartManager('./cart.json');

module.exports = { instance, CartManager };