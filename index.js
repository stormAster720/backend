const initialProducts = [
    { title: "first item", description: "Product 1", price: 200, thumbail: "null", code: "ABC", id: "", stock: "" },
    { title: "second item", description: "Product 2", price: 400, thumbail: "null", code: "DEF", id: "", stock: "" },
    { title: "third item", description: "Product 3", price: 600, thumbail: "null", code: "HIJ", id: "", stock: "" },
    { title: "forth item", description: "Product 4", price: 800, thumbail: "null", code: "KLM", id: "", stock: "" },
];

class ProductManager {
    constructor(products) {
        console.log("Product manager initialized");
        this.products = products;
        this.productArray = [];

        /*   //Add all products to the products array on construct
           this.products.forEach(product => {
               this.addProduct(product);
           });*/
    }

    generateID(product) {
        //Generate an ID for the product by concatenatinc it's name, with it's index on the array and it's price
        product.id = (product.title.replace(" ", "") + this.productArray.indexOf(product) + product.price).toUpperCase();
    }

    validateProduct(product) {
        // Add a product to the product array
        if (!this.productArray.some(prod => prod.code === product.code)) {
            this.productArray.push(product);
            this.generateID(product)
        } else {
            console.log(`the product "${product.title}" (with code ${product.code}) already exists`)
        }
    }

    addProduct(product) {
        //Validate products before adding them to the products array.
        this.validateProduct(product);
    }

    getProducts() {
        //Returns all products,
        console.log(this.productArray);
    }

    getProductByID(id) {
        const foundProduct = this.productArray.find(prod => prod.id === id);
        if (foundProduct) {
            console.log("Product found:", foundProduct.id);
        } else {
            console.log("Product not found");
        }
    }
}

const productManager = new ProductManager(initialProducts);

//Returns an empty array
productManager.getProducts();

//Adds a product
productManager.addProduct({ title: "fifth item", description: "Product 5", price: 1000, thumbail: "null", code: "NÑO", id: "", stock: "" })

//Returns an array with the added product
productManager.getProducts();

//PD: el id que esta puesta estara en la lista de productos, para que retorne falso, cambialo por cualquier otro texto
productManager.getProductByID("THIRDITEM2600");