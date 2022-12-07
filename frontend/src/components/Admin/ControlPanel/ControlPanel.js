import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Setting from '../../User/Setting/Setting';
import LogOut from '../../Auth/LogOut/LogOut';

import './controlPanel.scss';

class ControlPanel extends Component {
  render() {
    const { admin, setPageName, currentProfilePage, location } = this.props;
    if (location) {
      console.log(location.pathname.split('/'))
    }
    if (admin) {
      return (
        <div className="control-panel">
          <div className="control-panel_menu">
            <ul>
              <li><Link to="/control-panel/items">Items</Link><span> 10</span></li>
              <li><a href="/control-panel/users">Users</a><span> 5</span></li>
              <li><a href="#">Categories</a><span> 10</span></li>
              <li><a href="#">Orders</a><span> 5</span></li>
              {location && location.pathname.split('/')[1] !== 'control-panel' ? <li><Link to="/control-panel">Back to Control Panel</Link></li> : <li><Link to="/">Back to site</Link></li>}
            </ul>
            <div className="options">
              <button
                className="setting"
                onClick={() => setPageName('SETTING')}
              >Setting
              </button>
              <LogOut />
            </div>
          </div>
          <div className="control-panel_setting">
            {currentProfilePage === 'setting' ? <Setting /> : null}
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    admin: state.admin,
    currentProfilePage: state.currentProfilePage,
  }
}

export default connect(mapStateToProps, actions)(ControlPanel);