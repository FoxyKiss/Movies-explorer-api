require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');
const corsRequest = require('./middlewares/corsRequest');
const limiter = require('./utils/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./errors/NotFoundError');

// ? Создать Порт и Express сервер
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/moviesdb' } = process.env;
const app = express();
// ? Подключение к DB
mongoose.connect(MONGO_URL);

// ? Работа с роутами
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsRequest);
app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.use(require('./routes/auth'));

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundError('Адреса по вашему запросу не существует'));
});

// ? Обработка ошибок
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

// ? Запуск сервера
app.listen(PORT, () => {
});
