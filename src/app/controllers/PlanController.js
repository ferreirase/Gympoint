import Plan from '../models/plan';
import * as Yup from 'yup';
import {Op} from 'sequelize';

class PlanController{

  async store(req, res){
    
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails!'})
    }

    const {title, duration, price} = req.body;

    const find = await Plan.findOne({
      where: {
        title
      }
    });

    if(find){
      return res.status(401).json({error: `Plano ${title} já está cadastrado!`});
    }

    const plan = await Plan.create({
      title, duration, price
    });

    return res.json(plan);
  }

  async show(req, res){
    const plans = await Plan.findAll({
      //ordenando por títulos
      order: ['title']
    });

    return res.json(plans);
  }

  async update(req, res){

    const {title, duration, price} = req.body;
    const {id} = req.params;

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required()
    });

    if((title === "" || title === " ") || (duration === "" || duration === " ") || (price === "" || price === " ")){
      return res.status(400).json({error: 'Preencha o título'});
    }

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails!'})
    }

    const plan = await Plan.findByPk(id);

    if(!plan){
      return res.status(400).json({error: 'Plano não encontrado!'});
    }

    if(title !== plan.title){
      const findTitle = await Plan.findOne({
        where: {
          title
        }
      });

      if(findTitle){
        return res.status(400).json({error: `Plano ${title} já está cadastrado!`});
      }
    }

    await plan.update({
      title, duration, price
    });

    return res.json({message: 'Plano atualizado com sucesso!'});
  }

  async delete(req, res){
    const {id} = req.params;

    const plan = await Plan.findByPk(id);

    if(!plan){
      return res.status(400).json({error: 'Plano não encontrado!'});
    }


    await plan.destroy();

    return res.json({message: 'Plano deletado com sucesso!'});
  }
}

export default new PlanController();