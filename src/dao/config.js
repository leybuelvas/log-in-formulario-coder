const persistence = "MONGO";
let productsService, cartsService, messagesService, authorsService, usersService;

switch(persistence) {
    case "MEMORY":
        const {default:MemoryProducts} = await import('./MemoryDAO/Products.js');
        const {default:MemoryCars} = await import('./MemoryDAO/Carts.js');
        productsService = new MemoryProducts();
        cartsService = new MemoryCars();
        break;
    case "MONGO":
        const {default:MongoProducts} = await import('./MongoDAO/Products.js');
        const {default:MongoCarts} = await import('./MongoDAO/Carts.js');
        const {default:MongoMessages} = await import('./MongoDAO/Messages.js');
        const {default:MongoAuthors} = await import('./MongoDAO/Authors.js');
        const {default:MongoUsers} = await import('./MongoDAO/Users.js');
        productsService = new MongoProducts();
        cartsService = new MongoCarts();
        messagesService = new MongoMessages();
        authorsService = new MongoAuthors();
        usersService = new MongoUsers();
        break;
    case "FILES":
        const {default:FileProducts} = await import('./FilesDAO/Products.js');
        const {default:FileCarts} = await import('./FilesDAO/Carts.js');
        productsService = new FileProducts();
        cartsService = new FileCarts();
        break;
};

const services = {
    productsService,
    cartsService,
    messagesService,
    authorsService,
    usersService
};

export default services;