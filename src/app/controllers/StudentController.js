import Student from '../models/student';
//usa-se * para importar tudo de dentro do Yup pq ele não tem um export default;
import * as Yup from 'yup';
import { emit } from 'cluster';
import {toFixed} from 'tofixed';

class StudentController{
  async store(req, res){
    
    const {name, email, age, weight, height} = req.body;

    const schema = await Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(), 
      age: Yup.number().required(), 
      weight: Yup.number().required(), 
      height: Yup.number().required()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails!'});
    }
    
    const student = await Student.findOne({
      where: {
        email
      }
    });

    if(student){
      return res.status(400).json({error: 'Usuário já cadastrado!'});
    }
    
    const newStudent = await Student.create({
      name, email, age, weight, height
    });

    return res.status(200).json(newStudent);
  } 

  async update(req, res){
    const {id} = req.params;
    const {name, email, age, weight, height} = req.body;

    const schema = await Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(), 
      age: Yup.number().required(), 
      weight: Yup.number().required(), 
      height: Yup.number().required()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails!'});
    }

    const student = await Student.findByPk(id);

    if(!student){
      return res.status(400).json({error: 'Usuário não encontrado!'});
    }

    if(email !== student.email){
        const userExists = await Student.findOne({where: { email } });
        if(userExists){
          return res.status(400).json({error: 'Email já cadastrado por outro usuário!'});
        }
    }

    const newStudent = await student.update({
      name, email, age, weight, height,
      where: {
        id
      },
    });

    return res.json(newStudent);
  }

  async delete(req, res){
    const {id} = req.params;

    const student = await Student.findByPk(id);

    if(!student){
      return res.status(400).json({error: 'Aluno não encontrado!'});
    }

    await student.destroy();

    return res.json({status: 'Aluno deletado com sucesso!'});
  }

  async showById(req, res){
    const {id} = req.params; 
    const user = await Student.findByPk(id);

    if(!user){
      return res.status(400).json({error: 'Aluno não encontrado!'});
    }

    return res.json(user);
  }

  async showAll(req, res){
    const students = await Student.findAll();

    if(students.length === 0){
      return res.json({message: 'Nenhum estudante cadastrado'});
    }
    
    return res.json(students);
  }
} 

export default new StudentController();