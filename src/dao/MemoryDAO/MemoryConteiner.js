export default class MemoryConteiner {
    constructor() {
        this.data = [];
        this.id = 0;
    }
    
    getAll = () => {
        return this.data;
    }

    save = (element) => {
        this.id++;
        element['id'] = this.id;
        element['timestamp'] = Date.now();
        this.data.push(element);

        return element.id;
    }

    getById = (numberId) => {
        let object = this.data.filter((object) => {
            return object.id == numberId;
        });
        return object.length != 0 ? object[0] : null;
    }

    deleteById = (numberId) => {
        this.data = this.data.filter((object) => {
            return object.id != numberId;
        })
    }

    deleteAll = () => {
        for (let i = this.data.length; i > 0; i--) {
            this.data.pop();
        }
    }

    updateById = (numberId, object) => {
        let position = this.data.findIndex((objectI) => {
            return objectI.id == numberId;
        });
        if(position != -1) {
            object.id = this.data[position].id;
            this.data[position] = object;
            
            return object;
        }
        return null        
    }

    isExist = (code) => {
        let element = this.data.filter((object) => {
            return object.code == code;
        });
        
        return element.length != 0 ? true : false;
    }

    deleteProductById = (numberIdCart, numberIdProduct) => {
        this.data.filter((cart) => {
            return cart.id == numberIdCart;
        })[0].products = this.data.filter((cart) => {
            return cart.id == numberIdCart;
        })[0].products.filter((product) => {
            return product.id != numberIdProduct;
        });
    }

    saveProductById = (numberIdCart, numberIdProduct) => {    
        let cartIndex = this.data.findIndex((object) => {
            return object.id == numberIdCart;
        });

        let productIndex = this.data[cartIndex].products.findIndex((object) => {
            return object.id == numberIdProduct;
        });

        if(productIndex != -1) {
            this.data[cartIndex].products[productIndex].quantity = this.data[cartIndex].products[productIndex].quantity + 1;
        }
        else {
            this.data[cartIndex].products.push({ "id": numberIdProduct, "quantity": 1 });
        }
    }

    getProductsById = (numberId, productsList) => {        
        let products = this.data.filter((object) => {
            return object.id == numberId;
        })[0].products;

        if(products.length != 0){
            let p =  products.map((pCart) => {
                let productIndex = productsList.filter((object) => {
                    return object.id == pCart.id;
                });
                if(productIndex.length != 0){
                    productIndex[0].quantity = pCart.quantity;
                    return productIndex[0];
                }
            })

            return p;
        }

        return products;    
    }
}