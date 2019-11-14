import Sequelize, {Model, NUMBER} from 'sequelize';

class Registration extends Model{
  static init(sequelize){
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price_total: Sequelize.FLOAT
      }, 
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models){
    this.belongsTo(models.Student, {foreignKey: 'student_id', as: 'informations'});
    this.belongsTo(models.Plan, {foreignKey: 'plan_id', as: 'infoPlans'});
  }
}

export default Registration;