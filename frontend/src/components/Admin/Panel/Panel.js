import {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import Service from '../../../service/service';
import Setting from '../../User/Setting/Setting';
import './adminPanel.scss';

class AdminPanel extends Component {
  state = {
    setting: false
  }
  getItems = (path) => {
    this.props.itemsFetching();
    new Service().adminGetItems(path)
      .then(res => {
        console.log(res)
        this.props.itemsFetched(res);
      })
      .catch(res => {
        this.props.itemsFetchingErr();
      });
  }

  getUsers = () => {
    this.props.usersFetching();
    new Service().adminGetUsers({"Authorization": `Bearer ${this.props.authToken}`})
      .then(res => {
        console.log(res)
        this.props.usersFetched(res);
        this.props.isAdmin(true);
        console.log(this.props.currentProfilePage, 'currentProfilePage');
      })
      .catch(res => {
        this.props.usersFetchingErr();
      });
  }

  componentDidMount() {
    this.getItems('/coffee');
    this.getUsers();
  }

  onSetting = () => {
    this.setState(state => ({
      setting: !state.setting
    }))
  }

  render() {
    const {users, items, admin, setPageName, currentProfilePage} = this.props;
    
    const Panel = () => {
      return (
            <div className="column">
              <div className="items">
                <h2>Items {items.length}</h2>
                <ul>
                  {items.map((item, i) => {
                    return (
                      <li key={i}>name: {item.title} <br /> description: {item.description}</li>
                    )
                  })}
                </ul>
                
              </div>
  
              <div className="users">
                <h2>Users {users.length}</h2>
                <ul>
                  {users.map((user, i) => {
                    return (
                      <li key={i}>name: {user.name} <br /> email: {user.email}</li>
                    )
                  })}
                </ul>
              </div>
              <div className="orders">
                <h2>Orders</h2>
              </div>
            </div>
      )
    }
    if (admin) {
      return (
        <div className="admin-panel profile">
          <div className="container">
            <button 
              className="setting" 
              onClick={() => this.onSetting()}
              >Setting
              </button>
              {this.state.setting ? <Setting /> : null}
            <Panel />
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
    authToken: state.authToken,
    items: state.items,
    users: state.users,
    admin: state.admin,
    currentProfilePage: state.currentProfilePage
  }
}

export default connect(mapStateToProps, actions)(AdminPanel);