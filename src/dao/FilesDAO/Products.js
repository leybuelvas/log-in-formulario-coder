import FilesConteiner from "./FilesConteiner.js";
import __dirname from "../../utils.js";
import faker from 'faker';

faker.locale = 'es';
const {commerce, image} = faker;
const fileProducts = __dirname + "/files/products.txt";

export default class Products extends FilesConteiner {
    constructor() {
        super(fileProducts);
    }
    
    populate = async(quantity) => {
        await this.deleteAll();
        for (let i = 0; i < quantity; i++) {
            await this.save({
                title: commerce.productName(),
                price: commerce.price(),
                thumbnail: image.imageUrl()        
            });
        }
        let data = await this.getAll();
        return data;
    }
}