export default {
  host: 'smtp.mailtrap.io', //endereço do host 
  port: 2525, //porta
  secure: false, //se usa SSL ou não
  auth:{
    user: '7632303b7c1e68', //usuário, geralmente email
    pass: '4468a463c3fc86' //senha
  }, 
  default: { //configurações padrão para todo envio de email
    from: 'Equipe Gympoint <noreply@gympoint.com>' //remetente padrão
  }, 
};