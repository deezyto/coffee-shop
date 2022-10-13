import React, {Component} from 'react';
import ProfileOptionPage from '../ProfileOptionPage/ProfileOptionPage';

class UserSetting extends Component {
  render() {
    return (
      <ProfileOptionPage onClosePage={this.props.onClosePage} onProfile={this.props.onProfile}>
        <h3>Setting</h3>
      </ProfileOptionPage>
    )
  }
}

export default UserSetting;