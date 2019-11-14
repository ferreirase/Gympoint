import nodemailer from 'nodemailer';
import expressHandlebars from 'express-handlebars';
import nodeMailerHandlebars from 'nodemailer-express-handlebars';
import {resolve} from 'path';
import mailConfig from '../config/mail';
import { resolveTxt } from 'dns';


class Mail {
  constructor(){
    const {host, port, secure, auth} = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure, 
      auth: auth.user ? auth : null //verificando se dentro do auth existe um usuário, senão, passa como nulo
    });

    this.configureTemplates();
  }

  configureTemplates(){
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use('compile', nodeMailerHandlebars({
      viewEngine: expressHandlebars.create({
        layoutsDir: resolve(viewPath, 'layouts'),
        partialsDir: resolve(viewPath, 'partials'),
        defaultLayout: 'default',
        extname: '.hbs'
      }),
      viewPath,
      extname: '.hbs'
    }));
  }

  sendMail(message){
    return this.transporter.sendMail({
      ...mailConfig.default, 
      ...message
    });
  }
}

export default new Mail();