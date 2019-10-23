import Sequelize, {Model} from 'sequelize';
import { defaultFormat, relativeTimeRounding } from 'moment';
import bcrypt from 'bcryptjs';

class User extends Model{
  static init(sequelize){
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        //um tipo VIRTUAL não vai para o banco de dados, é só pra receber e tratar um dado
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING
      }, 
      {
        sequelize,
      }
    );
  }

  checkPassword(password){
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;