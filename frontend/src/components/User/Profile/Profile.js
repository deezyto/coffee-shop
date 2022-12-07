import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import UserSetting from '../Setting/Setting';
import UserOrders from '../Orders/Orders';
import UserHistory from '../History/History';
import UserWatch from '../Watch/Watch';
import Login from '../../Auth/Login/Login';
import LogOut from '../../Auth/LogOut/LogOut';
import './profile.scss';

class UserProfile extends Component {
  render() {
    const { currentProfilePage, login, authToken, setPageName, panelOpen } = this.props;
    if (!panelOpen) setPageName('PAGE HIDE');
    return (
      <>
        {currentProfilePage === 'setting' ? <UserSetting /> : null}
        {currentProfilePage === 'orders' ? <UserOrders /> : null}
        {currentProfilePage === 'history' ? <UserHistory /> : null}
        {currentProfilePage === 'watch' ? <UserWatch /> : null}
        {currentProfilePage === 'login' ? <Login /> : null}

        <div className={panelOpen ? 'user-profile active' : 'user-profile'}>
          <div className="hello"></div>
          <div className="options">
            {login && authToken
              ?
              <>
                <button onClick={() => setPageName('SETTING')}>Setting</button>
                <button onClick={() => setPageName('HISTORY')}>Order history</button>
                <button onClick={() => setPageName('ORDERS')}>Orders</button>
                <LogOut />
              </>
              :
              <button onClick={() => setPageName('LOGIN')}>Login</button>
            }
            <button onClick={() => setPageName('WATCH')}>Watch List</button>

          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentProfilePage: state.currentProfilePage,
    panelOpen: state.panelOpen,
    login: state.login,
    authToken: state.authToken
  }
}

export default connect(mapStateToProps, actions)(UserProfile);