import mongoose from "mongoose"; 
import MongoDBContainer from "./MongoDBContainer.js";

const collection = 'messages';

const messagesSchema = mongoose.Schema({
    author: { 
        type:  mongoose.SchemaTypes.ObjectId, 
        ref: 'authors' 
    },
    text: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now     
    }
});

export default class Messages extends MongoDBContainer {
    constructor() {
        super(collection, messagesSchema);
    }
}