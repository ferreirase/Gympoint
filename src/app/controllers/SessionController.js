import jwt from 'jsonwebtoken';
import User from '../models/user';
import { PassThrough } from 'stream';
import AuthConfig from '../../config/auth';


class SessionController{
  async store(req, res){
    
    const {email, password} = req.body;

    const user = await User.findOne({
      where: {
        email
      }
    });

    if(!user){
      return res.status(400).json({error: 'Usuário não encontrado!'}); 
    }

    if(!password || password === " "){
      return res.status(400).json({error: 'Informe a senha!'});
    }

    if(!(await user.checkPassword(password))){
      return res.status(401).json({error: "Senha incorreta!"});
    }

    const {id, name} = user;
    return res.json({
      user:{
        id, name, email,
      } ,
      //primeiro parametro: dado do usuário q quero manipular ou agregar no token
      token: jwt.sign({id}, AuthConfig.secret, {
        //data de expiração do token
        expiresIn: AuthConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();