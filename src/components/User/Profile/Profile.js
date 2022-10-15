import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import UserSetting from '../Setting/Setting';
import UserOrders from '../Orders/Orders';
import UserHistory from '../History/History';
import UserWatch from '../Watch/Watch';
import Login from '../../Auth/Login/Login';
import './profile.scss';

class UserProfile extends Component {
  render() {
    console.log(this.props)
    const {currentProfilePage, setPageName, panelOpen, loginModal, viewLoginModal} = this.props;
    if (!panelOpen) setPageName('PAGE HIDE');
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
            <button onClick={() => setPageName('SETTING')}>Setting</button>
            <button onClick={() => setPageName('HISTORY')}>Order history</button>
            <button onClick={() => setPageName('ORDERS')}>Orders</button>
            <button onClick={() => setPageName('WATCH')}>Watch List</button>
            <button onClick={() => setPageName('LOGIN')}>Login/SignUp</button>
            <button>LogOut</button>
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentProfilePage: state.currentProfilePage,
    panelOpen: state.panelOpen
  }
}

export default connect(mapStateToProps, actions)(UserProfile);