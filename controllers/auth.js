const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Auth = require('../routes/auth');
const User = require('../models/user');
const { BadRequestError } = require('../errors/BadRequestError');
const { ConflictError } = require('../errors/ConflictError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

function register(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) throw new BadRequestError('Email или пароль не могут быть пустыми');

  bcrypt.hash(password, 10)
    .then((hash) => {
      Auth.create({
        email, password: hash,
      })
        .then(() => res.status(200).send({ email }))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с таким email уже существует'));
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Введены некорретные данные'));
          }
          next(err);
        });
    }).catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'super-strong-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
}

module.exports = { register, login };
