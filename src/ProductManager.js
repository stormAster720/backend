const initialProducts = [
    { title: "first item", description: "Product 1", price: 200, thumbail: "null", code: "ABC", id: "", stock: "" },
    { title: "second item", description: "Product 2", price: 400, thumbail: "null", code: "DEF", id: "", stock: "" },
    { title: "third item", description: "Product 3", price: 600, thumbail: "null", code: "HIJ", id: "", stock: "" },
    { title: "forth item", description: "Product 4", price: 800, thumbail: "null", code: "KLM", id: "", stock: "" },
];


const fs = require('fs');
const crypto = require('crypto');

class ProductManager {
    constructor(path) {
        console.log("Product manager initialized");

        this.path = path;

        // Read initial products from file or create an empty array
        this.productArray = this.readProductsFromFile() || [];

        // Add all initial products to the products array
      //  this.addProducts(initialProducts);
    }

    // Hashing function for generating the product id
    generateID(product) {
        const idData = `${product.title}${product.price}${product.code}${product.description}${Math.random()}`;
        const hash = crypto.createHash('md5').update(idData).digest('hex');
        product.id = hash.toUpperCase();
    }

    validateProduct(product) {
        // Check if the product with the same code or ID already exists
        this.generateID(product);

        const isCodeDuplicate = this.productArray.some(prod => prod.code === product.code);
        const isIDDuplicate = this.productArray.some(prod => prod.id === product.id);

        return !isCodeDuplicate && !isIDDuplicate;
    }

    async addProducts(data) {
        for (const product of data) {
            await this.addProduct(product);
        }
    }


    async addProduct(product) {
        // Validate and add product
        if (this.validateProduct(product)) {
            this.productArray.push(product);
            await this.writeProductsToFile();
        } else {
            console.log(`The product "${product.title}" (with code ${product.code}) and ID ${product.id} already exists`);
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
            await fs.writeFile(this.path, JSON.stringify(this.productArray, null, 2), 'utf-8');
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
        } else {
            console.log("Product not found");
        }
    }

    async deleteProductByID(id) {
        const productIndex = this.productArray.findIndex(prod => prod.id === id);

        if (productIndex !== -1) {
            // Remove the product from the array
            this.productArray.splice(productIndex, 1);
            await this.writeProductsToFile(); // Update the file after modifying the array
            console.log(`Product with ID ${id} deleted successfully.`);
        } else {
            console.log("Product not found.");
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
