import axios from 'axios';
import { User } from './user';

class UserService {
  private URI: string;
  constructor() {
    this.URI = '/api/users';
  }

  getLogin() {
    return axios.get(this.URI, { withCredentials: true }).then((result) => {
      console.log(result);
      return result.data;
    });
  }

  async login(user: User) {
    const result = await axios.post(this.URI, user, { withCredentials: true });
    return result.data;
  }

  logout(): Promise<null> {
    return axios
      .delete(this.URI, { withCredentials: true })
      .then((result) => null);
  }

  update(user: User): Promise<null> {
    return axios
      .put(this.URI, user, { withCredentials: true })
      .then((result) => null);
  }
}

export default new UserService();
