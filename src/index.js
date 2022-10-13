import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import services from "../src/dao/config.js";
import session from 'express-session';
//import storage from 'session-file-store';
import MongoStore from 'connect-mongo';
import registerRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';

const app = express();
const PORT = 8080;
//const FileStorage = storage(session);

const server = app.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`);
});
server.on("Error", error => console.log(`Error en servidor ${error}`));

const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static(__dirname+'/public'));

app.use(session({
    // store: new FileStorage({
    //     path: './sessions',
    //     ttl: 3600,
    //     retries: 0
    // }),
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://leycibuelvas:adminleyci@cluster0.ozqtay2.mongodb.net/?retryWrites=true&w=majority',
        ttl: 3600
    }),
    secret: 'CoderSession',
    resave: false,
    saveUninitialized: false,
    cookie: {

    } 
}));

app.engine(
    "handlebars",
    handlebars.engine()
);

app.set('views', './views');
app.set('view engine', 'handlebars');
app.use('/', registerRouter);
app.use('/api/sessions', sessionsRouter);

io.on('connection', async(socket) => {
    console.log('Un cliente se ha conectado');
    socket.emit('messages', await services.messagesService.muestroChats());
    socket.emit('products', {products : await services.productsService.getAll()});

    socket.on('new-message', async(data) => {
        try {
            let author = await services.authorsService.getIdAuthor(data.author);
            let message = {
                author: author,
                text: data.text
            }
            await services.messagesService.save(message);
            io.sockets.emit('messages', [data]);
        } catch (error) {
            console.error("new-product",error);
        }
    });

    socket.on('new-product', async(data) => {
        try {
            await services.productsService.save(data);

            try {
                let productosAll = await services.productsService.getAll();
                io.sockets.emit('products', {products : productosAll});
            } catch (error) {
                console.error("products-socket-emit",error);
            }
        } catch (error) {
            console.error("new-product",error);
        }
    });
})

app.get("/api", async(req, res) => {
    if(req.session.user) {
        try {
            let nameUser = {username: req.session.user.username};
            let productosAll = await services.productsService.getAll();
            
            res.render('indexForm', nameUser);
        } catch (error) {
            console.error("/",error)
        }
    }
});

app.get("/api/products-test", async(req, res) => {
    let testProducts = await services.productsService.populate(5);
    res.send(testProducts);
});

app.get("/api/chat-normalizado", async(req, res) => {
    let chat = await services.messagesService.chatsNormalized();
    res.send(chat);
});

app.get("/api/chat-denormalizado", async(req, res) => {
    let chat = await services.messagesService.chatsDenormalized();
    res.send(chat);
});

app.get('/api/chats',async(req,res) => {
    let result = await services.messagesService.muestroChats()
    let mensajes = {
      id: 'mensajes',
      mensajes: result
    }
    res.send(mensajes);
});
