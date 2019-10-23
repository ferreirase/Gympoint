import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Student from '../app/models/student';
import User from '../app/models/user';

const models = [Student, User];

class Database{
  constructor(){
    this.init();
  }

  init(){
    this.connection = new Sequelize(databaseConfig);

    models
    .map(model => model.init(this.connection));
  }
}

export default new Database();