import * as AWS from 'aws-sdk';

let docClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-west-2',
  endpoint: 'http://dynamodb.us-west-2.amazonaws.com',
});

interface Event {
  httpMethod: string;
  path: string;
  body: string;
}

export async function handler(event: Event) {
  const parts = event.path.split('/trmss')[1];
  if (parts.includes('/')) {
    const [_, name, dt] = parts.split('/');
    console.log(name, dt);
    let trms: Trms | null;
    switch (event.httpMethod) {
      case 'GET':
        trms = await getTrms(name, dt);
        if (trms) {
          return {
            body: JSON.stringify(trms),
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          };
        } else {
          return {
            body: '',
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          };
        }
        break;
      case 'DELETE':
        let b: Boolean;
        b = await deleteTrms(name, dt);
        if (b) {
          return {
            body: 'item deleted',
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          };
        } else {
          return {
            body: 'item not found',
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          };
        }
        break;
      default:
        return {
          body: 'method not supported',
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        };
    }
  } else {
    let trms: Trms[];
    let b: Boolean;
    switch (event.httpMethod) {
      case 'GET':
        trms = await getTrmss();
        if (trms) {
          return {
            body: JSON.stringify(trms),
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          };
        } else {
          return {
            body: '',
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          };
        }
        break;

      case 'POST':
        b = await addTrms(JSON.parse(event.body) as Trms);
        if (b) {
          return {
            body: 'created trms',
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          };
        } else {
          return {
            body: '',
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          };
        }
        break;

      case 'PUT':
        b = await updateTrms(JSON.parse(event.body) as Trms);
        if (b) {
          return {
            body: 'updated trms',
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          };
        } else {
          return {
            body: '',
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          };
        }
        break;

      default:
        return {
          body: '',
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        };
    }
  }
}

async function getTrmss(): Promise<Trms[]> {
  const params = {
    TableName: 'trms',
  };
  return await docClient
    .scan(params)
    .promise()
    .then((data) => {
      return data.Items as Trms[];
    })
    .catch((err) => {
      return [];
    });
}

async function getTrms(nam: string, dt: string): Promise<Trms | null> {
  const params = {
    TableName: 'trms',
    Key: {
      name: nam,
      date_created: dt,
    },
  };

  return await docClient
    .get(params)
    .promise()
    .then((data) => {
      return data.Item as Trms;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
}

async function updateTrms(trms: Trms): Promise<boolean> {
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

  return await docClient
    .update(params)
    .promise()
    .then(() => {
      console.info('Successfully updated trms');
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

async function addTrms(t: Trms): Promise<boolean> {
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
  return await docClient
    .put(params)
    .promise()
    .then((result) => {
      console.info('successfully added items');
      return true;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });

  return true;
}

async function deleteTrms(name: string, date: string): Promise<boolean> {
  const params = {
    TableName: 'trms',
    Key: {
      name: name,
      date_created: date,
    },
  };
  return await docClient
    .delete(params)
    .promise()
    .then((data) => {
      return true;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}

class Trms {
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
