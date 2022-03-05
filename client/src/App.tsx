import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import userService from './user/user.service';
import { getUser } from './actions';
import { BrowserRouter } from 'react-router-dom';
import RouterComponent from './routing.component';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    userService.getLogin().then((user) => {
      console.log(user.name);
      dispatch(getUser(user));
    });
  }, [dispatch]);

  return (
    <div className="container">
      <BrowserRouter>
        <RouterComponent></RouterComponent>
      </BrowserRouter>
    </div>
  );
}

export default App;
