import FilesConteiner from "./FilesConteiner.js";
import __dirname from "../../utils.js";

const fileCarts = __dirname + "/files/carts.txt";

export default class Carts extends FilesConteiner {
    constructor() {
        super(fileCarts);
    }
};