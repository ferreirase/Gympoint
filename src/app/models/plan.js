import Sequelize, {Model} from 'sequelize';

class Plan extends Model{
  static init(sequelize){
    super.init(
      {
        title: Sequelize.STRING,
        //duração do plano em meses
        duration: Sequelize.INTEGER,
        //preço mensal do plano
        price: Sequelize.FLOAT
      }, 
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Plan;