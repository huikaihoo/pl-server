import { AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../../config';
import sequelize from '../../sequelize';

const { models } = sequelize;

const checkPassword = async (user: any, password: any): Promise<any> => {
  return user?.password ? await bcrypt.compare(password, user.password) : false;
};

const generateJwt = (user: any) => {
  const token = jwt.sign(
    {
      id: user.id,
    },
    config.accessTokenSecret,
    {
      expiresIn: config.accessTokenExpiresIn,
    }
  );
  return { accessToken: token };
};

const login = async (parent: any, { email, password }: any, context: any) => {
  try {
    const user = await models.user.findOne({
      attributes: ['id', 'password'],
      where: {
        email,
      },
    });

    const isMatch = await checkPassword(user, password);

    if (isMatch) {
      return generateJwt(user);
    }
  } catch (err) {
    console.log(err);
  }

  throw new AuthenticationError('incorrect login credentials');
};

export default login;
