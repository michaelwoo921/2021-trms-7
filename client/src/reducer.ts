import * as Actions from './actions';
import {User } from './user/user';
import {Trms} from './trms/trms';

export interface TrmsState {
  trmss: Trms[];
  trms: Trms;
}


export interface UserState {
  user: User;
  loginUser: User;
}

export interface AppState extends UserState, TrmsState {}

export const initialState: AppState = {
  user: new User(), trmss: [], trms: new Trms(), loginUser: new User(),
}


const reducer =(state: AppState = initialState, action: Actions.AppAction): AppState => {
  console.log(action);

  const newState = {...state};

  switch(action.type){
    case Actions.TrmsActions.GetTrmss:
      newState.trmss = action.payload as Trms[];
      return newState;
    case Actions.TrmsActions.ChangeTrms:
      newState.trms= action.payload as Trms;
      return newState;
    case Actions.UserActions.GetUser:
      newState.user = action.payload as User;
      newState.loginUser = new User();
      return newState;
    case Actions.UserActions.LoginChange:
      newState.loginUser = action.payload as User;
      return newState;
    default:
      return state;


  }

}

export default reducer;