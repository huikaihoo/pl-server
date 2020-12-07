import jwt from 'jsonwebtoken';
import validate from 'uuid-validate';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import { Request, Response } from 'express';

import config from './config';
import sequelize from './sequelize';

const { models } = sequelize;

const JWTStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

const checkJwtPayload = (jwtPayload: any) => {
  return jwtPayload.id && validate(jwtPayload.id);
};

const initPassport = () => {
  // Auth for access token
  passport.use(
    'token',
    new JWTStrategy(
      {
        jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.accessTokenSecret,
      },
      (jwtPayload, done) => {
        if (checkJwtPayload(jwtPayload)) {
          models.user
            .findByPk(jwtPayload.id, {
              attributes: ['id', 'email'],
              raw: true,
            })
            .then(user => done(null, user))
            .catch(err => done(err));
        } else {
          done({ status: 401 });
        }
      }
    )
  );
};

// Generate access token
const generateJwt = (payload: any) => {
  const token = jwt.sign(payload, config.accessTokenSecret, {
    expiresIn: config.accessTokenExpiresIn,
  });
  return { accessToken: token };
};

const auth = (req: Request, res: Response) =>
  new Promise((resolve, reject) => {
    passport.authenticate('token', { session: false }, (err, payload) => {
      if (err) reject(err);
      resolve(payload);
    })(req, res);
  });

const authenticate = async (req: Request, res: Response) => {
  try {
    const payload = await auth(req, res);
    if (payload) {
      return payload;
    }
  } catch (err) {
    console.log(err);
  }

  return null;
};

export { initPassport, authenticate, generateJwt };
