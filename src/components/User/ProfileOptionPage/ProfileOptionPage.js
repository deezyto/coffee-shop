import React, {Component} from 'react';
import './profileOptionPage.scss';

class ProfileOptionPage extends Component {
  render() {
    return (
      <div className="profile-page">
        <div className="wrapper">
          <div className="close" onClick={() => {
            this.props.onClosePage();
            this.props.onProfile();
            }}>x</div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default ProfileOptionPage;