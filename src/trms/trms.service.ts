import docClient from '../dynamo/dynamo';
import { Trms } from './trms';
import logger from '../log';

class TrmsService {
  private doc;
  constructor() {
    this.doc = docClient;
  }

  async getTrmss(): Promise<Trms[]> {
    const params = {
      TableName: 'trms',
    };
    return await this.doc
      .scan(params)
      .promise()
      .then((data) => {
        return data.Items as Trms[];
      })
      .catch((err) => {
        logger.error(err);
        return [];
      });
  }

  async getTrms(nam: string, dt: string): Promise<Trms | null> {
    const params = {
      TableName: 'trms',
      Key: {
        name: nam,
        date_created: dt,
      },
    };

    return await this.doc
      .get(params)
      .promise()
      .then((data) => {
        return data.Item as Trms;
      })
      .catch((err) => {
        logger.error(err);
        return null;
      });
  }

  async updateTrms(trms: Trms): Promise<boolean> {
    console.log(trms);
    const params = {
      TableName: 'trms',
      Key: {
        name: trms.name,
        date_created: trms.date_created,
      },
      UpdateExpression:
        'set #approval=:ap, #pro_reimbursement=:p, #attachments=:at, #comments=:co, #grade=:gr',
      ExpressionAttributeValues: {
        ':ap': trms.approval,
        ':p': trms.pro_reimbursement,
        ':at': trms.attachments,
        ':co': trms.comments,
        ':gr': trms.grade,
      },
      ExpressionAttributeNames: {
        '#approval': 'approval',
        '#pro_reimbursement': 'pro_reimbursement',
        '#attachments': 'attachments',
        '#comments': 'comments',
        '#grade': 'grade',
      },
      ReturnValue: 'UPDATED_NEW',
    };

    return await this.doc
      .update(params)
      .promise()
      .then(() => {
        logger.info('Successfully updated trms');
        return true;
      })
      .catch((error) => {
        logger.error(error);
        return false;
      });
  }

  async addTrms(t: Trms) {
    const datayorb = { ...t };

    const params = {
      TableName: 'trms',
      Item: datayorb,
      ConditionExpression: '#name <> :name AND #d <> :date_created',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#d': 'date_created',
      },
      ExpressionAttributeValues: {
        ':name': datayorb.name,
        ':date_created': datayorb.date_created,
      },
    };
    return await this.doc
      .put(params)
      .promise()
      .then((result) => {
        logger.info('successfully added items');
        return true;
      })
      .catch((err) => {
        logger.error(err);
        return false;
      });

    return true;
  }

  async deleteTrms(name: string, date: string): Promise<Boolean> {
    const params = {
      TableName: 'trms',
      Key: {
        name: name,
        date_created: date,
      },
    };
    return await this.doc
      .delete(params)
      .promise()
      .then((data) => {
        return true;
      })
      .catch((err) => {
        logger.error(err);
        return false;
      });
  }
}

const trmsService = new TrmsService();
export default trmsService;
