import MemoryConteiner from "./MemoryConteiner.js";
import faker from 'faker';

faker.locale = 'es';
const {commerce, image} = faker;

export default class Products extends MemoryConteiner {
    constructor() {
        super();
    }

    populate = (quantity) => {
        this.deleteAll();
        for (let i = 0; i < quantity; i++) {
            this.save({
                title: commerce.productName(),
                price: commerce.price(),
                thumbnail: image.imageUrl()        
            });
        }

        return this.getAll();
    }
}