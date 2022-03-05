import * as AWS from 'aws-sdk';
import docClient from '../dynamo/dynamo';
import trmsService from '../trms/trms.service';
import userService from '../user/user.service';

AWS.config.update({
  region: 'us-west-2',
});

const dynamodb = new AWS.DynamoDB();

const removeUsers = { TableName: 'p1-users' };
const removeTrms = { TableName: 'trms' };
const userSchema = {
  TableName: 'p1-users',
  KeySchema: [{ AttributeName: 'name', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'name', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 3,
    WriteCapacityUnits: 3,
  },
};

const trmsSchema = {
  TableName: 'trms',
  KeySchema: [
    { AttributeName: 'name', KeyType: 'HASH' },
    { AttributeName: 'date_created', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'name', AttributeType: 'S' },
    { AttributeName: 'date_created', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 3,
    WriteCapacityUnits: 3,
  },
};

dynamodb.deleteTable(removeUsers, function (err, data) {
  if (err) {
    console.error(
      'Unable to delete table. Error JSON:',
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      'Deleted table. Table description JSON:',
      JSON.stringify(data, null, 2)
    );
  }
  setTimeout(() => {
    dynamodb.createTable(userSchema, function (err, data) {
      if (err) {
        console.error('Error', err);
      } else {
        console.log('Table p1-users created', data);
      }
      setTimeout(() => {
        populateUserTable();
      }, 10000);
    });
  }, 10000);
});

dynamodb.deleteTable(removeTrms, function (err, data) {
  if (err) {
    console.error(
      'Unable to delete table. Error JSON:',
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      'Deleted table. Table description JSON:',
      JSON.stringify(data, null, 2)
    );
  }
  setTimeout(() => {
    dynamodb.createTable(trmsSchema, function (err, data) {
      if (err) {
        console.error('Error', err);
      } else {
        console.log('trms Table created', data);
      }
      setTimeout(() => {
        populateTrmsTable();
      }, 10000);
    });
  }, 10000);
});

function populateUserTable() {
  userService.addUser({
    name: 'Michael',
    password: 'pass',
    role: 'Employee',
    sup_name: 'Richard',
    fund: 2000,
  });
  userService.addUser({
    name: 'Elisa',
    password: 'pass',
    role: 'Employee',
    sup_name: 'David',
    fund: 2000,
  });
  userService.addUser({
    name: 'Chris',
    password: 'pass',
    role: 'Employee',
    sup_name: 'David',
    fund: 2000,
  });

  userService.addUser({
    name: 'David',
    password: 'pass',
    role: 'Sup',
    sup_name: 'Jim',
    fund: 2000,
  });
  userService.addUser({
    name: 'Richard',
    password: 'pass',
    role: 'Sup',
    sup_name: 'Jim',
    fund: 2000,
  });

  userService.addUser({
    name: 'Jim',
    password: 'pass',
    role: 'DeptHead',
    sup_name: 'Benco',
    fund: undefined,
  });
  userService.addUser({
    name: 'Benco',
    password: 'pass',
    role: 'Benco',
    sup_name: 'King',
    fund: undefined,
  });
  userService.addUser({
    name: 'King',
    password: 'pass',
    role: 'King',
    sup_name: '',
    fund: undefined,
  });
}

function populateTrmsTable() {
  trmsService.addTrms({
    name: 'Michael',
    date_created: '2020-08-25',
    role: 'Employee',
    event_start_date: '2021-01-12',
    event_end_date: '2021-02-25',
    event_location: 'online',
    sup_name: 'Richard',
    event_description: 'backend developmewnt',
    event_name: 'Nodejs with TypeScript',
    event_cost: 100,
    event_type: 'Certification Preparation Classes',
    pro_reimbursement: 80,
    justification: 'needed for job',
    attachments: '',
    grade: '',
    comments: '',
    approval: {
      sup: { date: '', reason: '', status: '', additional_info: '' },
      head: { date: '', reason: '', status: '', additional_info: '' },
      benco: { date: '', reason: '', status: '', additional_info: '' },
    },
  });

  trmsService.addTrms({
    name: 'Michael',
    date_created: '2021-01-10',
    role: 'Employee',
    event_start_date: '2021-02-20',
    event_end_date: '2021-04-15',
    event_location: 'online',
    sup_name: 'Richard',
    event_description: 'Native App for android and IOS',
    event_name: 'React Native with Redux',
    event_cost: 500,
    event_type: 'Certification Preparation Classes',
    pro_reimbursement: 375,
    justification:
      'requires a good understanding of noSql DB to serve customers with better app experience',
    attachments: '',
    grade: '',
    comments: '',
    approval: {
      sup: { date: '', reason: '', status: '', additional_info: '' },
      head: { date: '', reason: '', status: '', additional_info: '' },
      benco: { date: '', reason: '', status: '', additional_info: '' },
    },
  });

  trmsService.addTrms({
    name: 'Elisa',
    date_created: '2021-01-10',
    role: 'Employee',
    event_start_date: '2021-05-12',
    event_end_date: '2021-06-13',
    event_location: '',
    sup_name: 'David',
    event_name: 'Postgres',
    event_description: '',
    event_cost: 500,
    event_grading_format: '',
    event_type: 'University Courses',
    justification: '',
    attachments: '',
    grade: '',
    comments: '',
    pro_reimbursement: 300,
    approval: {
      sup: { date: '', reason: '', status: '', additional_info: '' },
      head: { date: '', reason: '', status: '', additional_info: '' },
      benco: { date: '', reason: '', status: '', additional_info: '' },
    },
  });

  trmsService.addTrms({
    name: 'Richard',
    date_created: '2021-01-10',
    role: 'Supervisor',
    event_start_date: '2021-05-12',
    event_end_date: '2021-05-12',
    event_location: '',
    sup_name: 'Jim',
    event_name: 'Augular',
    event_description: '',
    event_cost: 500,
    pro_reimbursement: 400,
    event_grading_format: '',
    event_type: 'Certification',
    justification: '',
    attachments: '',
    grade: '',
    comments: '',

    approval: {
      sup: { date: '', reason: '', status: '', additional_info: '' },
      head: { date: '', reason: '', status: '', additional_info: '' },
      benco: { date: '', reason: '', status: '', additional_info: '' },
    },
  });
}
