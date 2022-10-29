import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import Service from '../../../service/service';
import Setting from '../../User/Setting/Setting';
import './adminPanel.scss';
import ItemsForm from '../Forms/Items';
class AdminPanel extends Component {
  state = {
    currentItemsPage: 0,
    limit: 5
  }
  getItems = (path) => {
    this.props.itemsFetching();
    new Service().adminGetItems(path, {"Authorization": `Bearer ${this.props.authToken}`})
      .then(res => {
        console.log(res)
        this.props.itemsFetched(res);
      })
      .catch(res => {
        this.props.itemsFetchingErr();
      });
  }

  getUsers = (path) => {
    this.props.usersFetching();
    new Service().adminGetUsers(path, {"Authorization": `Bearer ${this.props.authToken}`})
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
    this.getItems(`/items?limit=${this.state.limit}`);
    this.getUsers('/users?limit=5');
  }

  onSetCurrentItemsPage = (index) => {
    this.setState((state) => {
      state.currentItemsPage = index;
    })
  }

  render() {
    const {users, items, admin, setPageName, currentProfilePage, currentAdminPage, itemsLoadingStatus, usersLoadingStatus, filterToogle} = this.props;
    const filterCreatedItems = filterToogle.items ? 'asc' : 'desc';
    const filterCreatedUsers = filterToogle.users ? 'asc' : 'desc';
    //prev, next
    //first, last
    //< prev 1...4 5 6...50 next >
    const pageItems = [];
    const {limit, currentItemsPage} = this.state;
    for (let i = 0; i < Math.ceil(items.length / limit); i++) {
      pageItems.push(<li key={i} className={currentItemsPage === i * limit ? 'active-page' : ''} onClick={(e) => {
        this.getItems(`/items?limit=${limit}&skip=${i * limit}:${filterCreatedItems}`);
        this.onSetCurrentItemsPage(i * limit);
        }}>{i + 1}</li>);
    }
    const Panel = () => {
      return (
            <div className="column">
              <div className="items">
                <h2>Items {items.length}</h2>
                <div className="filters">
                  Filters:
                  <span onClick={() => {
                    this.getItems(`/items?limit=${limit}&sortBy=createdAt:${filterCreatedItems}`);
                    this.props.setFilterToogle('items');
                    }} className="filter-option">
                    date created {filterToogle.items ? <>&#x2193;</> : <>&#x2191;</>}
                  </span>
                 
                </div>
                {itemsLoadingStatus === 'loading' ? <p>Items loading...</p> : null}
                {itemsLoadingStatus === 'err' ? <p>Items loading err...</p> : null}
                <ul>
                  {items.length ? items.results.map((item, i) => {
                    return (
                      <li key={i}>
                        <span>{i + 1 + currentItemsPage}</span> 
                        {item.title} <br /> 
                        created: {item.createdAt.split('.')[0]}
                        <button className="edit">edit</button>
                      </li>
                    )
                  }) : null}
                  
                </ul>
                <div className="pagenations">
                  <ul>{pageItems}</ul>
                </div>
                <button onClick={() => setPageName('ITEMS_CREATE')} className="create">Create item</button>
              </div>
              {currentAdminPage === 'items_create_form' ? <ItemsForm /> : null}
  
              <div className="users">
                <h2>Users {users.length}</h2>
                <div className="filters">
                  Filters:
                  <span onClick={() => {
                    this.getUsers(`/users?limit=5&sortBy=createdAt:${filterCreatedUsers}`);
                    this.props.setFilterToogle('users');
                    }} className="filter-option">
                    date created {filterToogle.users ? <>&#x2193;</> : <>&#x2191;</>}
                  </span>
                </div>
                {usersLoadingStatus === 'loading' ? <p>Users loading...</p> : null}
                {usersLoadingStatus === 'err' ? <p>Users loading err...</p> : null}
                <ul>
                  {users.length ? users.results.map((user, i) => {
                    return (
                      <li key={i}>
                        <span>{i + 1}</span> 
                        name: {user.name} <br /> 
                        email: {user.email} <br /> 
                        created: {user.createdAt.split('.')[0]}
                        <button className="edit">edit</button>
                      </li>
                    )
                  }): null}
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
    currentProfilePage: state.currentProfilePage,
    currentAdminPage: state.currentAdminPage,
    usersLoadingStatus: state.usersLoadingStatus,
    itemsLoadingStatus: state.itemsLoadingStatus,
    filterToogle: state.filterToogle
  }
}

export default connect(mapStateToProps, actions)(AdminPanel);