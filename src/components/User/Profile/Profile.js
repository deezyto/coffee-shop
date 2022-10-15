import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import UserSetting from '../Setting/Setting';
import UserOrders from '../Orders/Orders';
import UserHistory from '../History/History';
import UserWatch from '../Watch/Watch';
import './profile.scss';

class UserProfile extends Component {
  render() {
    console.log(this.props)
    const {currentProfilePage, setPageName, panelOpen} = this.props;
    return (
      <>
        {currentProfilePage === 'setting' ? <UserSetting onProfile={this.props.onProfile} /> : null}
        {currentProfilePage === 'orders' ? <UserOrders onProfile={this.props.onProfile} /> : null}
        {currentProfilePage === 'history' ? <UserHistory onProfile={this.props.onProfile} /> : null}
        {currentProfilePage === 'watch' ? <UserWatch onProfile={this.props.onProfile} /> : null}
        <div className={panelOpen ? 'user-profile active': 'user-profile'}>
          <div className="hello"></div>
          <div className="options">
            <button onClick={() => setPageName('SETTING')}>Setting</button>
            <button onClick={() => setPageName('HISTORY')}>Order history</button>
            <button onClick={() => setPageName('ORDERS')}>Orders</button>
            <button onClick={() => setPageName('WATCH')}>Watch List</button>
            <button>Login/SignUp</button>
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