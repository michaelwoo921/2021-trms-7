import docClient from '../dynamo/dynamo';
import { User } from './user';
import logger from '../log';

class UserService {
  private doc;
  constructor() {
    this.doc = docClient;
  }

  async addUser(user: User): Promise<boolean> {
    const params = {
      TableName: 'p1-users',
      Item: user,
      ConditionExpression: '#name <> :name',
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': user.name,
      },
    };

    return this.doc
      .put(params)
      .promise()
      .then((result) => {
        logger.info('successfully created user item');
        return true;
      })
      .catch((err) => {
        logger.error(err);
        return false;
      });
  }

  async getUsers(): Promise<User[]> {
    const params = { TableName: 'p1-users' };
    return await this.doc
      .scan(params)
      .promise()
      .then((data) => {
        return data.Items as User[];
      });
  }

  async getUserByName(name: string): Promise<User | null> {
    const params = { TableName: 'p1-users', Key: { name: name } };

    return await this.doc
      .get(params)
      .promise()
      .then((data) => {
        if (data && data.Item) {
          return data.Item as User;
        } else {
          return null;
        }
      });
  }

  async updateUser(user: User): Promise<boolean> {
    const params = {
      TableName: 'p1-users',
      Key: {
        name: user.name,
      },
      UpdateExpression: 'set #password = :p, #fund = :f ',
      ExpressionAttributeNames: {
        '#password': 'password',
        '#fund': 'fund',
      },
      ExpressionAttributeValues: {
        ':f': user.fund,
        ':p': user.password,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    return await this.doc
      .update(params)
      .promise()
      .then((data) => {
        logger.debug(data);
        return true;
      })
      .catch((err) => {
        logger.error(err);
        return false;
      });
  }
}

const userService = new UserService();

export default userService;
