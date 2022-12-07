import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Service from '../../../service/service';
import './items.scss';
import ItemsForm from '../Forms/Items';

class ControlPanelItems extends Component {
  state = {
    currentItemsPage: 0,
    limit: 5,
    pageBlockCurrent: 0,
    pageBlockSize: 3
  }

  getItems = (path) => {
    this.props.itemsFetching();
    new Service().adminGetItems(path, { "Authorization": `Bearer ${this.props.authToken}` })
      .then(res => {
        console.log(res)
        this.props.itemsFetched(res);
      })
      .catch(res => {
        this.props.itemsFetchingErr();
      });
  }

  componentDidMount() {
    this.getItems(`/items?limit=${this.state.limit}`);
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
    const { items, setPageName, currentAdminPage, itemsLoadingStatus, filterToogle } = this.props;
    const filterCreatedItems = filterToogle.items ? 'asc' : 'desc';

    const { limit, currentItemsPage, pageBlockCurrent, pageBlockSize } = this.state;
    const pageCount = Math.ceil(items.length / limit) - 1;

    const pageButton = (i, typePage) => {
      return <li key={i} className={currentItemsPage === i * limit ? 'active-page' : ''} onClick={() => {
        this.getItems(`/items?limit=${limit}&skip=${i * limit}:${filterCreatedItems}`);
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
    const availableAutoPagination = Math.ceil(items.length / limit / pageBlockSize);

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
      for (let i = 0; i < Math.ceil(items.length / limit); i++) {
        pageBlock.push(pageButton(i));
      }
    }
    return (
      <div className="container">
        <div className="control-panel-items">
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
                <ul>
                  {availableAutoPagination > 3 && pageBlockCurrent ? pageButton(0) : null}
                  {availableAutoPagination > 3 && pageBlockCurrent ? <>...</> : null}
                  {pageBlock}
                  {availableAutoPagination > 3 && pageBlockCurrent - (pageCount - pageBlockSize) ? <>...</> : null}
                  {availableAutoPagination > 3 ? pageButton(pageCount) : null}
                </ul>
              </div>
              <button onClick={() => setPageName('ITEMS_CREATE')} className="create">Create item</button>
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
    items: state.items,
    currentAdminPage: state.currentAdminPage,
    itemsLoadingStatus: state.itemsLoadingStatus,
    filterToogle: state.filterToogle
  }
}

export default connect(mapStateToProps, actions)(ControlPanelItems);