import Help_Order from '../models/help_order';
import Student from '../models/student';
import HelpOrder from '../models/help_order';

import Queue from '../../lib/queue';
import AnswerMail from '../jobs/answerMail';

class HelpOrderController{
  async store(req, res){
    const {id} = req.params;
    const {question, answer} = req.body;

    const student = await Student.findByPk(id);

    if(!student){
      return res.status(400).json({error: 'Aluno não encontrado!'});
    }

    const help_order = await Help_Order.create({
      student_id: id,
      question
    });

    return res.json(help_order);
  }

  async showWithoutAnswer(req, res){
    const questions = await Help_Order.findAll({
      where: {
        answer: null
      }
    });

    if(questions.length === 0){
      return res.json({message: 'Nenhuma pergunta ou pedido de auxílio sem resposta.'});
    }

    return res.json(questions);
  }

  async showById(req, res){
    const {id} = req.params;

    const student = await Student.findByPk(id);

    if(!student){
      return res.status(400).json({error: 'Aluno não encontrado!'});
    }

    const questions = await HelpOrder.findAll({
      where: {
        student_id: id
      }
    });

    if(questions.length === 0){
      return res.status(400).json({error: 'O aluno não tem nenhuma pergunta ou pedido de auxílio.'});
    }

    return res.json(questions);
  }

  async answer(req, res){
    const {id} = req.params;
    const {answer} = req.body;

    const question = await HelpOrder.findByPk(id, {
      include: [
        {
          model: Student, 
          as: 'student', 
          attributes: ['name', 'email']
        }
      ]
    });

    if(!question){
      return res.status(400).json({message: 'Pergunta ou pedido de auxílio não encontrado.'});
    }

    await question.update({
      answer, 
      answer_date: new Date()
    });

    Queue.addQueue(AnswerMail.key, {
      question
    });

    return res.json(question);
  }
}

export default new HelpOrderController();