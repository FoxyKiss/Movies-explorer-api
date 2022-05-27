const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateUrl } = require('../utils/validateUrl');
const { findAllMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', findAllMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateUrl),
    trailerLink: Joi.string().required().custom(validateUrl),
    thumbnail: Joi.string().required().custom(validateUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
