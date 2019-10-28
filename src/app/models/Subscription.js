import { Model } from 'sequelize';

class Subscrition extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default Subscrition;
