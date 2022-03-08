import createError from 'http-errors';
import express from 'express';
import publicDir from './constant';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import MemoryStore from 'memorystore';
import cors from 'cors';

import indexRouter from './staticrouter/index';
import usersRouter from './user/user.router';
import trmssRouter from './trms/trms.router';

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT, credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: 'donotgiveup',
    store: new (MemoryStore(session))({ checkPeriod: 86400000 }),
    cookie: {},
  })
);

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/trmss', trmssRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(publicDir));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../', 'client', 'build', 'index.html')
    );
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: any, res: any, next: Function) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendFile('error.html', { root: publicDir });
});

module.exports = app;
