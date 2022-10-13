import Router from 'express';
import __dirname from "../utils.js";
//import createHash from "../utils.js";
import services from "../dao/config.js";

const router = Router();

router.post('/register', async(req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) return res.status(500).send({status:"error",error:"Valores Incompletos"});
    const exists = await services.usersService.isExistUser(email);
    if(exists){
        return res.status(500).send({status:"error", error:"Usuario existente "});
    }
    const newUser = {
        name,
        email,
        password //: createHash(password)
    }
    let user = await services.usersService.save(newUser);

    return res.send(user)
});
  
export default router;