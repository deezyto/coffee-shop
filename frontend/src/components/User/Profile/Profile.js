import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import UserSetting from '../Setting/Setting';
import UserOrders from '../Orders/Orders';
import UserHistory from '../History/History';
import UserWatch from '../Watch/Watch';
import Login from '../../Auth/Login/Login';
import Service from "../../../service/service";

import './profile.scss';

class UserProfile extends Component {
  token = localStorage.getItem('token');

  onLogout = () => {
    console.log(this.props.authToken, 'onLogout')
    new Service().userLogout({'Authorization': `Bearer ${this.token}`})
      .then(res => {
        console.log(res, 'Logout');
        localStorage.removeItem('token');
        this.props.isLogin(false);
        this.props.setAuthToken(false);
        document.location.reload();
      })
      .catch(e => {
        console.log(e);
      })
  }

  render() {
    const {currentProfilePage, login, authToken, setPageName, panelOpen} = this.props;
    console.log(this.props)
    if (!panelOpen) setPageName('PAGE HIDE');
    const token = localStorage.getItem('token');
    console.log(token === true, 'token')
    return (
      <>
        {currentProfilePage === 'setting' ? <UserSetting /> : null}
        {currentProfilePage === 'orders' ? <UserOrders /> : null}
        {currentProfilePage === 'history' ? <UserHistory /> : null}
        {currentProfilePage === 'watch' ? <UserWatch /> : null}
        {currentProfilePage === 'login' ? <Login /> : null}

        <div className={panelOpen ? 'user-profile active': 'user-profile'}>
          <div className="hello"></div>
          <div className="options">
          {login || authToken || token
            ? 
              <>
                <button onClick={() => setPageName('SETTING')}>Setting</button>
                <button onClick={() => setPageName('HISTORY')}>Order history</button>
                <button onClick={() => setPageName('ORDERS')}>Orders</button>
                <button onClick={this.onLogout}>LogOut</button>
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