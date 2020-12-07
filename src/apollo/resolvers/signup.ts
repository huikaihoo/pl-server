import bcrypt from 'bcrypt';

import config from '../../config';
import sequelize from '../../sequelize';

const { models } = sequelize;

const login = async (parent: any, { email, password }: any, context: any) => {
  const t = await sequelize.transaction();

  try {
    const user = await models.user.create<any>(
      {
        email,
        password: bcrypt.hashSync(password, config.saltRounds),
      },
      {
        transaction: t,
      }
    );
    await t.commit();

    const { id } = user.dataValues;

    return { id, email };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export default login;
