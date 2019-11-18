import Checkin from '../models/checkin';
import Student from '../models/student';
import {startOfWeek, endOfWeek, parseISO, isSameWeek, format} from 'date-fns';
import {pt} from 'date-fns/locale/pt';
import * as Yup from 'yup';

class CheckinController{

  async store(req, res){
    
    const {id} = req.params;

    const student = await Student.findByPk(id);

    if(!student){
      return res.status(400).json({error: 'Aluno não encontrado!'});
    }

    const today = new Date();

    const studentCheckins = await Checkin.findAll({
      where: {
        student_id: id
      },
      include: [
        {
          model: Student, 
          as: 'checkins', 
          attributes: ['name']
        },
      ]
    });

    const datesChekins = [];

    studentCheckins.forEach(element => {
      datesChekins.push(element.createdAt);
    });

    const sameWeek = []; 
    datesChekins.forEach(element => {
      if(isSameWeek(element, today)){
        sameWeek.push(element);
      }
    });

    if(sameWeek.length >= 5){
      return res.status(400).json({error: 'Quantidade de checkins excedida(5 por semana)!'});
    } 

    const checkin = await Checkin.create({
      student_id: id
    });

    const arrayName = student.name.split(' ');
    const [firstName] = arrayName; 
    
    return res.status(200).json({message: `Bem-vindo, ${firstName}`}); 

  } 
}

export default new CheckinController();