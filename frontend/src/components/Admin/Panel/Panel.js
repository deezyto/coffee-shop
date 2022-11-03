import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import Setting from '../../User/Setting/Setting';
import './adminPanel.scss';
import AdminItems from '../Items/admin.items';
import AdminUsers from '../Users/admin.users';

class AdminPanel extends Component {
  render() {
    const {admin, setPageName, currentProfilePage} = this.props;

    if (admin) {
      return (
        <div className="admin-panel profile">
          <div className="container">
            <button 
              className="setting" 
              onClick={() => setPageName('SETTING')}
              >Setting
              </button>
              {currentProfilePage === 'setting' ? <Setting /> : null}
              <div className="column">
                <AdminItems />
                <AdminUsers />
              </div>
          </div>
        </div>
      )
    } else {
      return <h2>Page not Found</h2>
    }
    
  }
}

const mapStateToProps = (state) => {
  return {
    admin: state.admin,
    currentProfilePage: state.currentProfilePage,
  }
}

export default connect(mapStateToProps, actions)(AdminPanel);