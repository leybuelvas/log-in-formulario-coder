import fs from 'fs';

export default class FilesConteiner {
    constructor(name) {
        this.name = name;
        this.list = [];
        this.id = 0;

        this.main();
    }

    save = async (object) => {
        this.id++;
        object['id'] = this.id;
        object['timestamp'] = Date.now();

        let list = await this.getAll();

        list.push(object);

        await this.writeFile(list);

        return this.id;
    }

    getById = async(numberId) => {
        let list = await this.getAll();
        let object = list.filter((object) => {
            return object.id == numberId;
        });
        return object.length != 0 ? object[0] : null;
    }

    getAll = async() => {
        this.main();

        return this.list;
    }

    deleteById = async(numberId) => {
        let list = await this.getAll();

        list = list.filter((object) => {
            return object.id != numberId;
        })

        await this.writeFile(list);
    }

    deleteAll = async() => {
        let list = await this.getAll();

        for (let i = list.length; i > 0; i--) {
            list.pop();
        }

        await this.writeFile(list);

    }

    main = async() => {
        try {
            const elements = await fs.promises.readFile(this.name);
            this.list = JSON.parse(elements);
            for(let element of this.list) {
                if (element.id > this.id) {
                    this.id = element.id;
                }
            }
        } catch (error) {
            console.log(`Actualmente no existe un archivo de productos con el nombre: ${this.name}`);
        }
    }

    updateById = async(numberId, object) => {
        let list = await this.getAll();

        let position = list.findIndex((objectI) => {
            return objectI.id == numberId;
        });
        if(position != -1) {
            object.id = list[position].id;
            list[position] = object;
            
            await this.writeFile(list);

            return object;
        }
        return null        
    }

    isExist = async(code) => {
        let list = await this.getAll();

        let product = list.filter((object) => {
            return object.code == code;
        });
        
        return product.length != 0 ? true : false;
    }
    
    writeFile = async(list) => {
        await fs.promises.writeFile(
            this.name,
            JSON.stringify(list, null, 2)
        );
    }

    deleteProductById = async(numberIdCart, numberIdProduct)=> {
        let list = await this.getAll();

        list.filter((cart) => {
            return cart.id == numberIdCart;
        })[0].products = list.filter((cart) => {
            return cart.id == numberIdCart;
        })[0].products.filter((product) => {
            return product.id != numberIdProduct;
        });

        await this.writeFile(list);
    }

    saveProductById = async(numberIdCart, numberIdProduct) => {
        let list = await this.getAll();
        
        let cartIndex = list.findIndex((object) => {
            return object.id == numberIdCart;
        });

        let productIndex = list[cartIndex].products.findIndex((object) => {
            return object.id == numberIdProduct;
        });

        if(productIndex != -1) {
            list[cartIndex].products[productIndex].quantity = list[cartIndex].products[productIndex].quantity + 1;
        }
        else {
            list[cartIndex].products.push({ "id": numberIdProduct, "quantity": 1 });
        }

        await this.writeFile(list);
    }

    getProductsById = async(numberId, productsList) => {
        let list = await this.getAll();
        
        let products = list.filter((object) => {
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
