import {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import Service from '../../../service/service';

import './adminPanel.scss';

class AdminPanel extends Component {
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
      })
      .catch(res => {
        this.props.usersFetchingErr();
      });
  }

  componentDidMount() {
    this.getItems('/coffee');
    this.getUsers();
  }

  render() {
    const {users, items} = this.props;
    return (
      <div className="admin-panel">
        <div className="container">
          <button className="logout">Logout</button>
          <div className="column">
            <div className="items">
              <h2>Items</h2>
              <ul>
                {items.map((item, i) => {
                  return (
                    <li key={i}>name: {item.title} <br /> description: {item.description}</li>
                  )
                })}
              </ul>
              
            </div>

            <div className="users">
              <h2>Users</h2>
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
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authToken: state.authToken,
    items: state.items,
    users: state.users
  }
}

export default connect(mapStateToProps, actions)(AdminPanel);