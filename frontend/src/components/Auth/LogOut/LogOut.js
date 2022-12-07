import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Service from "../../../service/service";

class LogOut extends Component {
  onLogout = () => {
    new Service().userLogout({ 'Authorization': `Bearer ${this.props.authToken}` })
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userProfileFields');
        this.props.isLogin(false);
        this.props.setAuthToken(false);
        this.props.setPageName('PAGE HIDE');
      })
      .catch(e => {
        console.log(e);
      })
  }

  render() {
    return <button onClick={this.onLogout}>LogOut</button>
  }
}

const mapStateToProps = (state) => {
  return {
    authToken: state.authToken
  }
}

export default connect(mapStateToProps, actions)(LogOut);