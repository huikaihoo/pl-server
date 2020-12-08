import { Sequelize } from 'sequelize';

import config from '../config';
import user from './models/user';

const sequelize = new Sequelize(config.dbUri);

const modelDefiners = [user];

// Define the model
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

export default sequelize;
