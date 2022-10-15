import React, {Component} from 'react';
import ProfileOptionPage from '../ProfileOptionPage/ProfileOptionPage';

class UserWatch extends Component {
  render() {
    return (
      <ProfileOptionPage onProfile={this.props.onProfile}>
        <h3>Watch list</h3>
      </ProfileOptionPage>
    )
  }
}

export default UserWatch;