import React, {Component} from 'react';
import UserProfile from '../../User/Profile/Profile';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import './panel.scss';

class Panel extends Component {
  render() {
    const {setPanelStatus, panelOpen} = this.props;
    const activeClass = panelOpen ? ' active' : '';
    
    return (
      <aside>
        <div className="container">
          <div className="wrapper">
            <div className="wrapper-user">
              <UserProfile/>
              <div className={"user-panel" + activeClass}>
                <div className="user-picture">
                  <button onClick={setPanelStatus}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="bi bi-person-circle" viewBox="0 0 18 18">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                    </svg>
                  </button>
                </div>
                <div className="cart">
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="bi bi-cart" viewBox="0 0 18 18">
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    <span className="cart-items">10</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    panelOpen: state.panelOpen
  }
}

export default connect(mapStateToProps, actions)(Panel);