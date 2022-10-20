import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import './profileOptionPage.scss';

class ProfileOptionPage extends Component {
  render() {
    const {setPageName, setPanelStatus} = this.props;
    return (
      <div className="profile-page">
        <div className="wrapper">
          <div className="close" onClick={() => {
            setPageName('PAGE HIDE');
            setPanelStatus();
            console.log('close profile')
            }}>x</div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentProfilePage: state.currentProfilePage,
    panelOpen: state.panelOpen
  }
}

export default connect(mapStateToProps, actions)(ProfileOptionPage);