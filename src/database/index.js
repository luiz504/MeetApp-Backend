import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';
import Subscrition from '../app/models/Subscription';

import databaseConfig from '../config/database';

const models = [User, File, Meetup, Subscrition];

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);

    this.init();
    // this.associate();
  }

  init() {
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
  // associate() {
  //   models.forEach(model => {
  //     if (model.associate) {
  //       model.associate(this.connection.models);
  //     }
  //   });
  // }
}

export default new Database();
