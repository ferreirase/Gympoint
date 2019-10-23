import multer from 'multer';
import crypto from 'crypto';
import {extname, resolve} from 'path';

export default {

  //como o multer vai guardar nossos arquivos de imagem
  storage: multer.diskStorage({
    //caminho do arquivo
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      //aqui formatamos o nome da imagem
      crypto.randomBytes(16, (err, res) => {
        if(err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      })
    }
  }),

}