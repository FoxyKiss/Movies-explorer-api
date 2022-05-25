const Movie = require('../models/movie');
const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');

function findAllMovies(req, res, next) {
  Movie.find({})
    .then((movies) => res.send({ movies }))
    .catch(next);
}

function createMovie(req, res, next) {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Введены некорретные данные'));
      }
      next(err);
    });
}

function deleteMovie(req, res, next) {
  const { _id } = req.params;

  Movie.findById(_id)
    .orFail(() => {
      throw new NotFoundError('Фильм  не найден');
    })
    .then((movie) => movie.remove()
      .then(() => {
        res.send({ message: 'Фильм удалён' });
      })).catch(next);
}

module.exports = {
  findAllMovies, createMovie, deleteMovie,
};
