import mongoose from "mongoose";
import  { normalize, schema, denormalize } from 'normalizr';

export default class MongoDBContainer {
    constructor(collection, schema){
        mongoose.connect('mongodb+srv://leycibuelvas:adminleyci@cluster0.ozqtay2.mongodb.net/?retryWrites=true&w=majority', err => {
            if(err) {
                console.log("Error al intertar de conectar a la base de datos")
            }
            else {
                console.log("Conectado a la base de datos")
            }
        });
        this.model = mongoose.model(collection, schema)
    }

    getAll = async() => {
        let results = await this.model.find();
        return results;
    }

    save = async(document) => {
        let results = await this.model.create(document);
        return results;
    }

    getById = async(numberId) => {
        let result = await this.model.find({"_id":numberId});
        return result.length != 0 ? result[0] : null;
    }

    deleteById = async(numberId) => {
        await this.model.deleteOne({"_id":numberId});
    }

    deleteAll = async() => {
        await this.model.deleteMany({});
    }

    updateById = async(numberId, object) => {
        let results = await this.model.updateOne({"_id":numberId},{$set:object});
        return object        
    }

    isExist = async(code) => {
        let results = await this.model.find({"code":code});
        return results.length != 0 ? true : false;
    }

    deleteProductById = async(numberIdCart, numberIdProduct)=> {   
        await this.model.updateOne({"_id":numberIdCart},{$pull:{"products":{"_id":numberIdProduct}}});
    }

    saveProductById = async(numberIdCart, numberIdProduct) => {
        let result = await this.getById(numberIdCart)
        if(result.products.length != 0){
            let product =  result.products.filter((object) => {
                return object._id == numberIdProduct;
            });

            if(product.length != 0){
                let quantity = product[0].quantity + 1;
                let res1 = await this.model.updateOne({"_id":numberIdCart, "products._id":numberIdProduct},{$set:{"products.$.quantity": quantity}});
            }    
            else {
                let res2 = await this.model.updateOne({"_id":numberIdCart},{$push:{"products": {"_id":numberIdProduct, "quantity": 1}}});
            }
        }
        else {
            let res2 = await this.model.updateOne({"_id":numberIdCart},{$addToSet:{"products": {"_id":numberIdProduct, "quantity": 1}}});
        }
    }

    getProductsById = async(numberId, productsList) => {
        let result = await this.model.find({"_id":numberId}, { "products": 1, "_id": 0 });
        if(result[0].products.length != 0){
            let p =  result[0].products.map((pCart) => {
                let productIndex = productsList.filter((object) => {
                    return object.id == pCart._id;
                });
                if(productIndex.length != 0){
                    productIndex[0].quantity = pCart.quantity;
                    return productIndex[0];
                }
            })

            return p;
        }

        return result[0].products;    
    }

    muestroChats = async() => {
        let chats = await this.model.find().populate("author");
        return chats;
    };

    getIdAuthor = async (data) => {
        let result = await  this.model.find({"email":data.email});
        if(result.length != 0) {
            return result[0]._id;
        }
        else {
            let newAuthor = await this.save(data);
            return newAuthor._id;
        }
    };

    reemplaceId = async(data) => {
        let aux = [];
        let chat = {};
        for (const item of data){
            chat = {
                id: item._id.toString(),
                text: item.text,
                date: item.date,
                author: {            
                    id: item.author._id.toString(),
                    email: item.author.email,
                    nombre: item.author.nombre,
                    apellido: item.author.apellido,
                    edad: item.author.edad,
                    alias: item.author.alias,
                    avatar: item.author.avatar
                }
            }

            aux.push(chat);
            chat = {};
        }

        return aux;
    }
      
    chatsNormalized = async() => {

        let chats = await this.muestroChats();
        let messagesId = await this.reemplaceId(chats)
        let messages = {
            id: "messages",
            messages: messagesId,
        };

        const author = new schema.Entity('authors', {}, {idAttribute: 'email'});
        const message = new schema.Entity('messages', {
            author:author
        });
        const chat = new schema.Entity('posts', {
            messages:[message]
        });
        const normalizedData = normalize(messages, chat);
      
        console.log("NORMALIZADO", JSON.stringify(normalizedData))
        return normalizedData;
    }   

    chatsDenormalized = async() => {

        let chats = await this.muestroChats();
        let messagesId = await this.reemplaceId(chats)
        let messages = {
            id: "messages",
            messages: messagesId,
        };

        const author = new schema.Entity('authors', {}, {idAttribute: 'email'});
        const message = new schema.Entity('messages', {
            author:author
        });
        const chat = new schema.Entity('posts', {
            messages:[message]
        });
        const normalizedData = normalize(messages, chat);

        let denormalizedData = denormalize(normalizedData.result, chat, normalizedData.entities);
        console.log("DENORMALIZADO", JSON.stringify(denormalizedData,null,'\t'));
        return denormalizedData;
        
    } 

    isExistUser = async(email) => {
        let results = await this.model.find({"email":email});
        return results.length != 0 ? true : false;
    }

    getPassByEmail = async(email) => {
        let results = await this.model.find({"email":email});
        if(results.length != 0) {
            return results[0];
        }
        return  '';
    }
}

