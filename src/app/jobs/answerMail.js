import Mail from '../../lib/mail';
import {format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';

class AnswerMail{
  get key(){
    return 'AnswerMail'; //chave única pra cada job
  }

  async handle({data}){

    console.log('Fila executou');
    
    const {question} = data;
    //enviando email para o prestado de serviço informando do cancelamento do agendamento
    //Mailtrap: email send fake, usado apenas no desenvolvimento
    await Mail.sendMail({
      to: `${question.student.name} <${question.student.email}>`, //para quem enviar o email
      subject: 'Resposta de Pergunta ou pedido de Auxílio', //assunto do email
      template: 'answer', //importando template de email de 'views/cancellation
      //enviando para o express habdlebars as variáveis q prometi no arquivo .hbs
      context: {
        student: question.student.name, 
        question: question.question,
        answer: question.answer,
        answer_date: format(
          parseISO(question.answer_date), 
          " dd 'de' MMMM' de' yyyy ",
          { locale:  pt }
        ),
      },

    });
  }
} 

export default new AnswerMail();