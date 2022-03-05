import express from 'express';
import logger from '../log';
import trmsService from './trms.service';

const router = express.Router();

router.get('/', function (req, res, next) {
  trmsService.getTrmss().then((data) => {
    res.send(JSON.stringify(data));
  });
});

router.post('/', function (req, res, next) {
  logger.debug(req.body);
  trmsService
    .addTrms(req.body)
    .then((data) => {
      logger.debug(data);
      if (data) {
        res.sendStatus(201);
      } else {
        res.status(400).send('item already exsits');
      }
    })
    .catch((err) => {
      logger.error(err);
      res.sendStatus(500);
    });
});

router.put('/', function (req, res, next) {
  trmsService.updateTrms(req.body).then((data) => {
    res.send(JSON.stringify(data));
  });
});

router.get('/:nam/:dt', function (req, res, next) {
  trmsService.getTrms(req.params.nam, req.params.dt).then((data) => {
    res.send(JSON.stringify(data));
  });
});

router.delete('/:nam/:dt', function (req, res, next) {
  logger.debug(req.body);
  trmsService
    .deleteTrms(req.params.nam, req.params.dt)
    .then((data) => {
      logger.debug(data);
      res.sendStatus(200);
    })
    .catch((err) => {
      logger.error(err);
      res.sendStatus(500);
    });
});

export default router;
