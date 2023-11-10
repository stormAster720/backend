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
        this.addProducts(initialProducts);
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

    addProducts(data) {
        data.forEach(product => {
            this.addProduct(product);
        });
    }

    addProduct(product) {
        // Validate and add product
        if (this.validateProduct(product)) {
            this.generateID(product);
            this.productArray.push(product);
            this.writeProductsToFile();
        } else {
            console.log(`The product "${product.title}" (with code ${product.code}) and ID ${product.id} already exists`);
        }
    }

    readProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Handle file read error or empty file
            console.error('Error reading products file:', error.message);
            return null;
        }
    }

    writeProductsToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.productArray, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error writing products file:', error.message);
        }
    }

    getProducts() {
        const products = this.readProductsFromFile() || [];
        console.log(products);
    }

    updateProduct(id, data) {
        let productIndex = this.productArray.findIndex(prod => prod.id === id);

        if (productIndex !== -1) {
            // Update the found product with the new data
            this.productArray[productIndex] = { ...this.productArray[productIndex], ...data, id };
            this.writeProductsToFile(); // Update the file after modifying the array
        } else {
            console.log("Product not found");
        }
    }

    deleteProductByID(id) {
        const productIndex = this.productArray.findIndex(prod => prod.id === id);

        if (productIndex !== -1) {
            // Remove the product from the array
            this.productArray.splice(productIndex, 1);
            this.writeProductsToFile(); // Update the file after modifying the array
            console.log(`Product with ID ${id} deleted successfully.`);
        } else {
            console.log("Product not found.");
        }
    }

    getProductByID(id) {
        try {
            const products = this.readProductsFromFile() || [];
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

const productManager = new ProductManager('./products.json');

//Returns an empty array if products.json is empty
productManager.getProducts();

//Adds a product
//productManager.addProduct({ title: "first item", description: "Product 5", price: 1000, thumbail: "null", code: "NÑO", id: "", stock: "" })

//Returns an array with the added product
productManager.getProducts();

//PD LOS IDS SERAN GENERADOS AUTOMATICAMENTE PARA CADA PRODUCTO LA PRIMERA VEZ QUE SE CORRA EL CODIGO, REVISAR EL ARCHIVO products.json Y REEMPLAZAR SEGUN CORRESPONDA


//PD: actualiza un producto que exista en el archivo products.json por ID con un nuevo objeto (conservando el ID) 
productManager.updateProduct("420906297FE196CB968C67471A43023B", { title: "Updated item", description: "update", price: 10000, thumbail: "null", code: "AABB", stock: "" })
//PD: reemplazar el id con cualquier ID generado en los productos dentro del archivo products.json
productManager.getProductByID("0D98CC05FDCB7252B4505B8BEB7B5AAD")


