export default {
  host: 'smtp.mailtrap.io', //endereço do host 
  port: 2525, //porta
  secure: false, //se usa SSL ou não
  auth:{
    user: '***********', //usuário, geralmente email
    pass: '************' //senha
  }, 
  default: { //configurações padrão para todo envio de email
    from: 'Equipe Gympoint <noreply@gympoint.com>' //remetente padrão
  }, 
};
