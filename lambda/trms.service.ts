import * as AWS from 'aws-sdk';

let docClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-west-2',
  endpoint: 'http://dynamodb.us-west-2.amazonaws.com',
});

export class Trms {
  name: string = '';
  sup_name: string = '';
  role = '';
  date_created: string = '';
  event_name = '';
  event_type: string = '';
  event_start_date: string = '';
  event_end_date: string = '';
  event_location: string = '';
  event_description: string = '';
  event_cost: number = 0;
  pro_reimbursement?: string | number;
  event_grading_format?: string = '';
  grade = '';
  justification? = '';

  attachments: string = '';
  approval = {
    sup: { status: '', date: '', reason: '', additional_info: '' },
    head: { status: '', date: '', reason: '', additional_info: '' },
    benco: { status: '', date: '', reason: '', additional_info: '' },
  };
  comments: string = '';

  constructor(nam: string, dt: string) {
    this.name = nam;
    this.date_created = dt;
  }
}

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
        return null;
      });
  }

  async updateTrms(trms: Trms): Promise<boolean> {
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
        return true;
      })
      .catch((error) => {
        return false;
      });
  }

  async addTrms(t: Trms): Promise<boolean> {
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
        return true;
      })
      .catch((err) => {
        return false;
      });

    return true;
  }

  async deleteTrms(name: string, date: string): Promise<boolean> {
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
        return false;
      });
  }
}

export default new TrmsService();
