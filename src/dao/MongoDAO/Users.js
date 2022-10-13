import mongoose from "mongoose"; 
import MongoDBContainer from "./MongoDBContainer.js";

const collection = 'users';

const usersSchema = mongoose.Schema({
    name: { 
        type: String
    },
    email: { 
        type: String
    },
    password: { 
        type: String, 
    }
});

export default class Users extends MongoDBContainer {
    constructor() {
        super(collection, usersSchema);
    }
}