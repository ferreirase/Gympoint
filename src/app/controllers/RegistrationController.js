import Registration from '../models/registration';
import Student from '../models/student'; 
import Plan from '../models/plan';
import * as Yup from 'yup';
import {parseISO, format, startOfDay, isBefore, addMonths} from 'date-fns';
import pt from 'date-fns/locale/pt';

import Queue from '../../lib/queue';
import RegistrationMail from '../jobs/registrationMail';

class RegistrationController{
  async store(req, res){
    const {id} = req.params;
    const {start_date, planID} = req.body;

    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      planID: Yup.number().required()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails!'});
    }
    
    const student = await Student.findByPk(id);
    const plan = await Plan.findByPk(planID);

    if(!student){
      return res.status(401).json({error: 'Aluno não cadastrado!'});
    }

    if(!plan){
      return res.status(401).json({error: 'Plano não cadastrado!'});
    }

    const find = await Registration.findOne({
      where: {
        student_id: id
      }
    });

    if(find){
      return res.status(401).json({error: 'Aluno já matriculado!'});
    }

    const parseStartDate = parseISO(start_date);

    if(isBefore(parseStartDate, new Date())){
      return res.status(400).json({error: 'Datas passadas não são permitidas!'});
    }

    //calculando a data de encerramento do plano, adicionando o tanto de meses do plano
    const end_date = addMonths(parseStartDate, plan.duration);

    //calculando o preço final da matrícula de acordo com o plano
    const price = plan.duration * plan.price;


    const registration = await Registration.create({
      student_id: student.id, 
      plan_id: plan.id, 
      start_date: parseStartDate, 
      end_date,
      price_total: price
    }); 

    await registration.save();

    const result = await Registration.findOne({
      where: {
        student_id: id
      }, 
      include: [
        {
          model: Student, 
          as: 'informations'
        }, 
        {
          model: Plan, 
          as: 'infoPlans'
        }
      ]
    });

    Queue.addQueue(RegistrationMail.key, {
      result
    });
    
    return res.json(registration);
  }

  async showByPlan(req, res){
    const {id} = req.body;

    const registration = await Registration.findAll({
      where: {
        plan_id: id
      }, attributes: ['start_date'], 
      include: [
        {
          model: Student, 
          as: 'informations', 
          attributes: ['name']
        }
      ]
    });

    const plan = await Plan.findByPk(id);
    
    if(!plan){
      return res.status(400).json({error: 'Plano não cadastrado!'});
    }

    if(registration.length === 0){
      return res.status(400).json({error: `Sem alunos matriculados no plano ${plan.title}.`});
    }

    return res.json(registration);
  }

  async showAll(req, res){

    const registration = await Registration.findAll({
      attributes: ['start_date'], 
      include: [
        {
          model: Student, 
          as: 'informations', 
          attributes: ['name']
        }
      ]
    });

    if(!registration){
      return res.status(400).json({error: `Sem alunos matriculados.`});
    }

    return res.json(registration);
  }

  async update(req, res){
    const {id} = req.params;

    const {start_date, planID} = req.body;

    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      planID: Yup.number().required()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails!'});
    }
    
    const student = await Student.findByPk(id);
    const plan = await Plan.findByPk(planID);

    if(!student){
      return res.status(401).json({error: 'Aluno não encontrado!'});
    }

    if(!plan){
      return res.status(401).json({error: 'Plano não encontrado!'});
      
    }

    const parseStartDate = parseISO(start_date);

    if(isBefore(parseStartDate, new Date())){
      return res.status(401).json({error: 'Datas passadas não são permitidas!'});
    }

    //calculando a data de encerramento do plano, adicionando o tanto de meses do plano
    const end_date = addMonths(parseStartDate, plan.duration);

    //calculando o preço final da matrícula de acordo com o plano
    const price = plan.duration * plan.price;

    const registration = await Registration.findOne({
      where: {
        student_id: id 
      }
    });

    await registration.update({
      start_date: parseStartDate, 
      end_date,
      price_total: price
    });

    return res.json(registration);
  }

  async delete(req, res){
    const {id} = req.params;

    const registration = await Registration.findByPk(id);

    if(!registration){
      return res.status(400).json({error: 'Matrícula não encontrada!'});
    }

    registration.destroy({
      where: {
        id
      }
    });

    registration.save();

    return res.json({message: 'Matrícula cancelada com sucesso!'});
  }
}

export default new RegistrationController();