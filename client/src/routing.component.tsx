import { useState } from 'react';
import { getUser } from './actions';
import { UserState } from './reducer';
import { Route, Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import userService from './user/user.service';
import { User } from './user/user';
import AddTrmsComponent from './trms/add.trms.component';
import UpdateTrmsComponent from './trms/update.trms.component';
import TableComponent from './trms/table.component';
import TrmsDetailComponent from './trms/trmsdetail.component';
import LoginComponent from './user/login.component';

export default function RouterComponent() {
  const userSelector = (state: UserState) => state.user;
  const [isNavOpen, setIsNavOpen] = useState(false);
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  function logout() {
    userService.logout().then(() => {
      dispatch(getUser(new User()));
    });
  }

  return (
    <div>
      <nav className="navbar navbar-expand-sm routing-nav navbar-light">
        <div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`${isNavOpen ? '' : 'collapse'} navbar-collapse`}
            id="navbarNav"
          >
            <ul className="navbar-nav">
              {(user.role === 'Employee' || user.role === 'Supervisor') && (
                <li className="nav-item">
                  <Link className="nav-link" to="/addTrms">
                    {' '}
                    Create Form
                  </Link>
                </li>
              )}

              {user.role && (
                <li className="nav-item">
                  <Link to="/trmss" className="nav-link">
                    {' '}
                    View All Forms{' '}
                  </Link>
                </li>
              )}

              <li className="nav-item">
                {user.name && (
                  <Link to="/" className="nav-link" onClick={logout}>
                    {`${user.name} (Role: ${user.role}) `} {' Logout'}
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <>
        <Route exact path="/" component={LoginComponent} />
        <Route exact path="/addTrms" component={() => <AddTrmsComponent />} />
        <Route exact path="/trmss/:nam/:dt" component={TrmsDetailComponent} />
        <Route exact path="/trmss" component={TableComponent} />
        <Route
          exact
          path="/trmss/:nam/:dt/update"
          component={UpdateTrmsComponent}
        />
      </>
    </div>
  );
}
