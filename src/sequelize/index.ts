import { Sequelize } from 'sequelize';

import config from '../config';
import setup from './setup';
import user from './models/user';

const sequelize = new Sequelize(config.dbUri);

const modelDefiners = [user];

// Define the model
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// Setup model associations
setup.applyAssociation(sequelize);

export default sequelize;
