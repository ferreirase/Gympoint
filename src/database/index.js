import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Student from '../app/models/student';
import User from '../app/models/user';
import Plan from '../app/models/plan';
import Registration from '../app/models/registration';
import Checkin from '../app/models/checkin';

const models = [Student, User, Plan, Registration, Checkin];

class Database{
  constructor(){
    this.init();
  }

  init(){
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();