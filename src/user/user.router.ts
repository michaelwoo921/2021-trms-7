import express from 'express';
import * as user from './user';
import logger from '../log';
import publicDir from '../constant';

const router = express.Router();

/* GET users listing. */
router.get('/', function (req: any, res, next) {
  let u = { ...req.session.user };
  logger.debug(u);
  if (u.name && u.password) {
    user.login(u.name, u.password).then((user) => {
      if (!user) {
        res.sendStatus(401);
      }
      req.session.user = user;
      res.send(JSON.stringify(user));
    });
  } else {
    res.sendStatus(401);
  }
});

router.post('/', function (req: any, res, next) {
  logger.debug(req.body, 'req.body');
  user.login(req.body.name, req.body.password).then((user) => {
    if (user === null) {
      return res.sendStatus(401);
    }
    req.session.user = user;
    res.redirect('/api/users');
  });
});

router.delete('/', function (req, res, next) {
  req.session.destroy((err) => logger.error(err));
  res.sendStatus(204);
});

router.put('/', async function (req: any, res, next) {
  let u = { ...req.session.user };
  logger.debug(u);
  if (u.name !== '' && u.password !== '' && req.body && req.body.fund) {
    u.fund = Number(req.body.fund);
    await user.updateUser(u);

    res.redirect('/api/users');
  } else {
    res.sendStatus(401);
  }
});

router.get('/login', function (req, res, next) {
  res.sendFile('index.html', { root: publicDir });
});

export default router;
