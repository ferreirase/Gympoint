import Mail from '../../lib/mail';
import {format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';

class RegistrationMail{
  get key(){
    return 'RegistrationMail'; //chave única pra cada job
  }

  async handle({data}){

    console.log('Fila executou');
    
    const {result} = data;
    //enviando email para o prestado de serviço informando do cancelamento do agendamento
    //Mailtrap: email send fake, usado apenas no desenvolvimento
    await Mail.sendMail({
      to: `${result.informations.name} <${result.informations.email}>`, //para quem enviar o email
      subject: 'Matrícula Efetuada', //assunto do email
      template: 'registration', //importando template de email de 'views/cancellation
      //enviando para o express habdlebars as variáveis q prometi no arquivo .hbs
      context: {
        student: result.informations.name, 
        plan: result.infoPlans.title,
        end_date: format(
          parseISO(result.end_date), 
          " dd 'de' MMMM,' de' yyyy ",
          { locale:  pt }
        ),
        value: result.price_total,
      },

    });
  }
} 

export default new RegistrationMail();