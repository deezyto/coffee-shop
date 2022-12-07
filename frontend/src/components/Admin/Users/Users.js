import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Service from '../../../service/service';
import './users.scss';
import ItemsForm from '../Forms/Items';

class ControlPanelUsers extends Component {
  state = {
    currentItemsPage: 0,
    limit: 5,
    pageBlockCurrent: 0,
    pageBlockSize: 3
  }

  getUsers = (path) => {
    this.props.usersFetching();
    new Service().adminGetItems(path, { "Authorization": `Bearer ${this.props.authToken}` })
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
    this.getUsers('/users?limit=5');
  }

  onSetCurrentItemsPage = (index) => {
    this.setState((state) => {
      state.currentItemsPage = index;
    })
  }

  onSetNextPageBlock = () => {
    this.setState((state) => {
      state.pageBlockCurrent = state.pageBlockCurrent + state.pageBlockSize;
    })
  }

  onSetPrevPageBlock = () => {
    this.setState((state) => {
      state.pageBlockCurrent = state.pageBlockCurrent - state.pageBlockSize;
    })
  }

  onSetCustomPageBlock = (step) => {
    this.setState((state) => {
      state.pageBlockCurrent = step;
    })
  }

  render() {
    const { users, currentAdminPage, usersLoadingStatus, filterToogle } = this.props;
    const filterCreatedUsers = filterToogle.users ? 'asc' : 'desc';

    const { limit, currentItemsPage, pageBlockCurrent, pageBlockSize } = this.state;
    const pageCount = Math.ceil(users.length / limit) - 1;

    const pageButton = (i, typePage) => {
      return <li key={i} className={currentItemsPage === i * limit ? 'active-page' : ''} onClick={() => {
        this.getUsers(`/users?limit=${limit}&skip=${i * limit}:${filterCreatedUsers}`);
        this.onSetCurrentItemsPage(i * limit);
        const availableStep = (pageCount - pageBlockSize) - pageBlockCurrent;

        if (typePage === 'next') {
          if (pageBlockCurrent < (pageCount - pageBlockSize) && availableStep >= pageBlockSize) {
            this.onSetNextPageBlock();
          } else {
            this.onSetCustomPageBlock(pageBlockCurrent + availableStep);
          }
        }

        if (typePage === 'prev') {
          if (pageBlockCurrent - pageBlockSize > 0) {
            this.onSetPrevPageBlock();
          } else {
            this.onSetCustomPageBlock(0);
          }
        }

        if (i === 0) {
          this.onSetCustomPageBlock(0)
        } else if (i === pageCount) {
          this.onSetCustomPageBlock(pageCount - pageBlockSize)
        }

      }}>{i + 1}</li>;
    }

    const pageBlock = [];
    const availableAutoPagination = Math.ceil(users.length / limit / pageBlockSize);

    if (availableAutoPagination > 3) {
      for (let i = 0; i < pageBlockSize; i++) {
        const stepPage = i + pageBlockCurrent;
        if (i === 0 && pageBlockCurrent) {
          pageBlock.push(pageButton(stepPage, 'prev'));
        } else if (i === (pageBlockSize - 1)) {
          pageBlock.push(pageButton(stepPage, 'next'));
        } else {
          pageBlock.push(pageButton(stepPage));
        }
      }
    } else {
      for (let i = 0; i < Math.ceil(users.length / limit); i++) {
        pageBlock.push(pageButton(i));
      }
    }

    return (
      <div className="container">
        <div className="control-panel-items">
          <div className="column">
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
                }) : null}
              </ul>
              <div className="pagenations">
                <ul>
                  {availableAutoPagination > 3 && pageBlockCurrent ? pageButton(0) : null}
                  {availableAutoPagination > 3 && pageBlockCurrent ? <>...</> : null}
                  {pageBlock}
                  {availableAutoPagination > 3 && pageBlockCurrent - (pageCount - pageBlockSize) ? <>...</> : null}
                  {availableAutoPagination > 3 ? pageButton(pageCount) : null}
                </ul>
                <button className="create">Create user</button>
              </div>
              {currentAdminPage === 'items_create_form' ? <ItemsForm /> : null}
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
    users: state.users,
    currentAdminPage: state.currentAdminPage,
    usersLoadingStatus: state.usersLoadingStatus,
    filterToogle: state.filterToogle
  }
}

export default connect(mapStateToProps, actions)(ControlPanelUsers);