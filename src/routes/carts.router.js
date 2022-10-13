import Router from 'express';
import __dirname from "../utils.js";
import services from "../dao/config.js";

const router = Router();
const menssageErrorCart = { error: -5, descripcion: 'Carrito no encontrado.' };
const messageProduct = { error : -3, descripcion: 'Producto no encontrado.' };

router.get('/', async(req, res) => {
    let listCarts = await services.cartsService.getAll();
    return res.json(listCarts);
});

router.post('/', async(req, res) => {
    req.body['products'] = [];
    let idCart = await services.cartsService.save(req.body);
    return res.json({ "id" : idCart});
});

router.delete('/:cid', async(req, res) => {
    let cart = await services.cartsService.getById(req.params.cid);
    if(cart != null) {
        await services.cartsService.deleteById(req.params.cid);
        return res.json({mensaje: `Se elimino el Carrito con el Id ${req.params.cid}`});
    }
    return res.json(menssageErrorCart);
});

router.get('/:cid/products', async(req, res) => {
    let cart = await services.cartsService.getById(req.params.cid);
    if(cart != null) {
        let listProducts = await services.productsService.getAll();

        let productsCarts = await services.cartsService.getProductsById(req.params.cid, listProducts);       
        if(productsCarts.length != 0) {
            return res.json(productsCarts);
        }
        else {
            return res.json({mensaje: `No hay Productos en el Carrito con el Id ${req.params.cid}`});
        }
    }
    return res.json(menssageErrorCart);
});

router.post('/:cid/products', async(req, res) => {
    let cart = await services.cartsService.getById(req.params.cid);
    if(cart != null) {
        // let listProducts = await services.productsService.getAll();
        let product = await services.productsService.getById(req.body.pid);
        if(product != null) {
            await services.cartsService.saveProductById(req.params.cid, product.id);
            return res.json({mensaje: `Se cargo correctamente el Producto con el Id ${req.body.pid} en el Carrito con el Id ${req.params.cid}`});
        }
        else {
            return res.json(messageProduct);
        }
    }
    return res.json(menssageErrorCart);
});

router.delete('/:cid/products/:pid', async(req, res) => {
    let cart = await services.cartsService.getById(req.params.cid);
            
    if(cart != null) {    
        let producto = await services.productsService.getById(req.params.pid)
        if(producto != null) {   
            await services.cartsService.deleteProductById(req.params.cid, req.params.pid);
            return res.json({mensaje: `Se elimino el Producto con el Id ${req.params.pid} en el Carrito con el Id ${req.params.cid}`});     
        }
        return res.json(messageProduct);
    }
    return res.json(menssageErrorCart);
});

export default router;