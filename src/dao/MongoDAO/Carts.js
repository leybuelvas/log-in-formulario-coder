import mongoose from "mongoose"; 
import MongoDBContainer from "./MongoDBContainer.js";

const collection = 'carts';

const productsSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Products'
            },
            quantity: Number
        }
    ]
}, {timestamps: true});

export default class Carts extends MongoDBContainer {
    constructor() {
        super(collection, productsSchema);
    }
}