import React, {Component} from 'react';
import UserSetting from '../Setting/Setting';
import './profile.scss';

class UserProfile extends Component {
  start = {
    setting: false,
    history: false,
    orders: false,
    watch: false
  }

  state = {
    pages: this.start
  }

  onPageActive = (page) => {
    let newState = {};

    for (let item in this.state.pages) {
      if (item === page) {
        newState[item] = true;
      } else {
        newState[item] = false;
      }
    }
    this.setState(({pages}) => ({
      pages: newState
    }))
  }

  onClosePage = () => {
    this.setState(({pages}) => ({
      pages: this.start
    }))
  }

  render() {
    return (
      <>
        {this.state.pages.setting ? <UserSetting onClosePage={this.onClosePage} onProfile={this.props.onProfile} /> : null}
        <div className={"user-profile" + this.props.className}>
          <div className="hello"></div>
          <div className="options">
            <button onClick={() => this.onPageActive('setting')}>Setting</button>
            <button onClick={() => this.onPageActive('history')}>Order history</button>
            <button onClick={() => this.onPageActive('orders')}>Orders</button>
            <button onClick={() => this.onPageActive('watch')}>Watch List</button>
            <button>Login/SignUp</button>
            <button>LogOut</button>
          </div>
        </div>
      </>
    )
  }
}

export default UserProfile;