import {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import Service from '../../../service/service';
import Setting from '../../User/Setting/Setting';
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
                      <li key={i}>
                        <span>{i + 1}</span> 
                        {item.title} <br /> 
                        created: {item.createdAt.split('.')[0]}
                        <button className="edit">edit</button>
                      </li>
                    )
                  })}
                  
                </ul>
                <button className="create">Create item</button>
              </div>
  
              <div className="users">
                <h2>Users {users.length}</h2>
                <ul>
                  {users.map((user, i) => {
                    return (
                      <li key={i}>
                        <span>{i + 1}</span> 
                        name: {user.name} <br /> 
                        email: {user.email} <br /> 
                        created: {user.createdAt.split('.')[0]}
                        <button className="edit">edit</button>
                      </li>
                    )
                  })}
                </ul>
                <button className="create">Create user</button>
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
              onClick={() => setPageName('SETTING')}
              >Setting
              </button>
              {currentProfilePage === 'setting' ? <Setting /> : null}
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