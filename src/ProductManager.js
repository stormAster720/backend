const initialProducts = [
    { title: "first item", description: "Product 1", code: "ABC", price: 200, stock: 0, thumbails: [""], category: "uncategorized", id: "", },

];

const fs = require('fs');
const crypto = require('crypto');

class ProductManager {
    constructor(path) {
        console.log("Product manager initialized");

        this.path = path;
        // Read initial products from file or create an empty array
        this.initialize();
    }

    async initialize() {
        // Read initial products from file or create an empty array
        const data = await this.readProductsFromFile();
        this.productArray = data || [];

        // Add all initial products to the products array
        //  await this.addProducts(initialProducts);
    }


    // Hashing function for generating the product id
    generateID(product) {
        const idData = `${product.title}${product.price}${product.code}${product.description}${Math.random()}`;
        const hash = crypto.createHash('md5').update(idData).digest('hex');
        product.id = hash.toUpperCase();
    }

    validateProduct(product) {
        // Generate an id for this product
        this.generateID(product);

        // Check if the product has the mandatory properties
        if (!product.title || !product.description || !product.code || !product.price || !product.category ||parseInt(product.price) <= 0 || parseInt(product.stock) < 0) {
           
            return false;
        }

        const isCodeDuplicate = this.productArray.some(prod => prod.code === product.code);
        const isIDDuplicate = this.productArray.some(prod => prod.id === product.id);

        //Check if an ID or CODE is duplicated
        if (isCodeDuplicate || isIDDuplicate) {
            return false;
        }


        product.status = true;
        //Return true if all fields are valid
        return true;
    }

    async addProducts(data) {
        for (const product of data) {
            await this.addProduct(product);
        }
    }


    async addProduct(product) {
        console.log("Attempting to add...");

        // Validate and add product
        if (this.validateProduct(product)) {
            // You can directly push the product object to the array
            this.productArray.push(product);

            await this.writeProductsToFile();

            if (product) {
                console.log(`The product ${product.title} has been added successfully`);
                return { success: true };
            }

        } else {
            console.log(`The product "${product.title}" (with code ${product.code}) and ID ${product.id} already exists`);
            return { success: false };
        }
    }

    async readProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Handle file read error or empty file
            console.error('Error reading products file:', error.message);
            return null;
        }
    }

    async writeProductsToFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.productArray, null, 2), { encoding: 'utf-8' });
        } catch (error) {
            console.error('Error writing products file:', error.message);
        }
    }

    async getProducts(limit) {
        try {
            const products = await this.readProductsFromFile() || [];

            if (limit) {
                // If a limit is provided, return only the specified number of products
                return products.slice(0, limit);
            } else {
                // If no limit is provided, return all products
                return products;
            }
        } catch (error) {
            console.error("Error getting products: ", error.message);
            return null;
        }
    }

    async updateProduct(id, data) {
        let productIndex = this.productArray.findIndex(prod => prod.id === id);

        if (productIndex !== -1) {
            // Update the found product with the new data
            this.productArray[productIndex] = { ...this.productArray[productIndex], ...data, id };
            await this.writeProductsToFile(); // Update the file after modifying the array
            console.log("Product updated successfully")
            return { success: true };
        } else {
            console.error("Product not found");
            return { success: false };
        }
    }

    async deleteProductByID(id) {
        const productIndex = this.productArray.findIndex(prod => prod.id === id);

        if (productIndex !== -1) {
            // Remove the product from the array
            this.productArray.splice(productIndex, 1);
            await this.writeProductsToFile(); // Update the file after modifying the array
            console.log(`Product with ID ${id} deleted successfully.`);

            return { success: true };
        } else {
            console.log("Product not found.");
            return { success: false };
        }
    }

    async getProductByID(id) {
        try {
            const products = await this.readProductsFromFile() || [];
            const foundProduct = products.find(prod => prod.id === id);

            if (foundProduct) {
                console.log(`The product with ID ${id} is present object :(${foundProduct}), name: ${foundProduct.title}`);
                return foundProduct;
            } else {
                console.log("Product not found");
                return null;
            }
        } catch (error) {
            console.error('Error reading products file:', error.message);
            return null;
        }
    }
}

const instance = new ProductManager('./products.json');

module.exports = { instance, ProductManager };
/*
//Returns an empty array if products.json is empty
instance.getProducts();

//Adds a product
//instance.addProduct({ title: "first item", description: "Product 5", price: 1000, thumbail: "null", code: "NÑO", id: "", stock: "" })

//Returns an array with the added product
instance.getProducts();

//PD LOS IDS SERAN GENERADOS AUTOMATICAMENTE PARA CADA PRODUCTO LA PRIMERA VEZ QUE SE CORRA EL CODIGO, REVISAR EL ARCHIVO products.json Y REEMPLAZAR SEGUN CORRESPONDA


//PD: actualiza un producto que exista en el archivo products.json por ID con un nuevo objeto (conservando el ID) 
instance.updateProduct("420906297FE196CB968C67471A43023B", { title: "Updated item", description: "update", price: 10000, thumbail: "null", code: "AABB", stock: "" })
//PD: reemplazar el id con cualquier ID generado en los productos dentro del archivo products.json
instance.getProductByID("0D98CC05FDCB7252B4505B8BEB7B5AAD")

*/
