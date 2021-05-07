const passport = require('passport');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;

const jwt = require('jsonwebtoken');

const Admin = require('../model/admin');

const authUserSecret = process.env.AUTH_USER_SECRET;

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

function signUserToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    authUserSecret
  );
}

const tokenExtractor = function(req) {
  let token = null;
  if (req.req && req.req.headers && req.req.headers.authorization) {
    const rawToken = req.req.headers.authorization.toString();
    token = rawToken.slice(rawToken.indexOf(' ') + 1, rawToken.length);
  }
  return token;
};

async function generatePasswordHash(plainPassword) {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(plainPassword, salt);
}

async function CreateUser(email, password) {
  return await Admin.create({ email, password })
    .then(data => {
      return data;
    })
    .catch(error => {
      if (error.errors.email) {
        return Object.assign(error.errors.email.properties, {
          result: 'error'
        });
      }

      throw error;
    });
}

async function GetUser(email) {
  return await Admin.findOne({ email })
    .then(data => {
      return data;
    })
    .catch(error => {
      throw error;
    });
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async function(email, password, done) {
      await GetUser(email)
        .then(user => {
          return user;
        })
        .then(async user => {
          if (!user) {
            return done(null, false, { message: 'Authentication failed' });
          }
          const validation = await comparePasswords(password, user.password);
          if (validation) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Authentication failed' });
          }
        })
        .catch(err => {
          return done(err);
        });
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: tokenExtractor,
      secretOrKey: authUserSecret
    },
    function(jwtPayload, done) {
      return GetUser(jwtPayload.email)
        .then(user => {
          if (user) {
            return done(null, {
              email: user.email
            });
          } else {
            return done(null, false, 'Failed');
          }
        })
        .catch(err => {
          return done(err);
        });
    }
  )
);

module.exports = {
  CreateUser,
  GetUser,

  generatePasswordHash,
  signUserToken
};
