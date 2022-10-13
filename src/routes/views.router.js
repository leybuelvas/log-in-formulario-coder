import Router from 'express';
import __dirname from "../utils.js";
import services from "../dao/config.js";

const router = Router();

router.get("/", async(req, res) => {
    // if(req.session.user) {
    //     let nameUser = req.session.user.name;
    //     try {
    //         let productosAll = await services.productsService.getAll();
    //         res.render('indexForm', {nameUser});
    //     } catch (error) {
    //         console.error("/",error)
    //     }
    // }
    // else{
        try {
            res.render('registerForm');
        } catch (error) {
            console.error("/",error)
        }
   // }
});

router.get("/login", async(req, res) => {
    try {
        res.render('loginForm');
    } catch (error) {
        console.error("/",error);
    }
});

router.post("/login", async(req, res) => {
    const {email,password} = req.body;

    if (!email || !password) return res.status(500).send({status:"error",error:"Valores Incompletos"});

    const exists = await services.usersService.isExistUser(email);
    if(!exists){
        return res.status(500).send({status:"error", error:"Usuario no existente"});
    }

    let user = await services.usersService.getPassByEmail(email);
    if (user.password != password) return res.status(400).send({status: 'error', message: 'Contraseña incorrecta'});
    req.session.user = {
        username: user.name,
        role:"user"
    }

    return  res.send({status: 'OK', mensaje: "Logueo correcto"});
});

router.get("/current", async(req, res) => {
    if(req.session.user) {
        res.send(req.session.user);
    }
    else {
        res.send('Por Favor loguearse primero');
    }
});

router.get("/logout", async(req, res) => {
    let nameUser = {username: req.session.user.username};
    console.log("ACA",nameUser,"--",req.session.user)
    req.session.destroy( err => {
        if(err) {
            return res.send({mensaje: "Intente de nuevo"});
        }
        else {
            res.render("logout", nameUser);
        }
    })
});

export default router;