import logger from "../log";
import userService from "./user.service";

export class User {
  constructor(public name:string, public password:string, public role:string, public sup_name: string, public fund: number| undefined){

  }
}


export async function login(name: string, password: string){
  if (name==='' || password===''){
    return null;
  }
  return await userService.getUserByName(name).then(user => {
    if(user && user.password === password){
      return user
    } else {
      return null;
    }
  })
};

export function register(name: string, password: string, role: string, callback: Function, sup_name: string, fund?: number){
  userService.addUser(new User(name, password, role,  sup_name, fund)).then(res => {
    logger.trace(res);
    callback();
  }).catch(err => {
    logger.error(err);
    callback();
  })
}

export function updateUser(user: User){
  userService.updateUser(user).then(success => {
    logger.info('user updated successfully');
  }).catch(err => {
    logger.warn('user not updated');
  })
}