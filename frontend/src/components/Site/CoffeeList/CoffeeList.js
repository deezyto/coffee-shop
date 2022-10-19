import React, {Component} from 'react';
import CoffeeItem from '../CoffeeItem/CoffeeItem';
import './coffeeList.scss';

class CoffeeList extends Component {
  data = {
    items: [
      {
          "id": 1,
          "img": "../img/items/item.jpg",
          "title": "Solimo Coffee Beans 2 kg",
          "country": "Brazil",
          "price": 10,
          "best": true,
          "link": '/',
          "desc": ''
      },
      {
          "id": 2,
          "img": "../img/items/item2.jpg",
          "title": "Presto Coffee Beans 1 kg",
          "country": "Kenya",
          "price": 15,
          "best": false,
          "link": '/',
          "desc": ''
      },
      {
          "id": 3,
          "img": "../img/items/item3.jpg",
          "title": "AROMISTICO Coffee 1 kg",
          "country": "Columbia",
          "price": 5,
          "best": true,
          "link": '/',
          "desc": ''
      }
  ]}

  state = {
    filter: true,
    items: this.data
  }

  render() {
    const {filter} = this.state;
    const {cssClass} = this.props;

    const items = this.data.items.map(item => {
      if (filter) {
        return (
          <CoffeeItem key={item.id} cssClass={cssClass} {...item} />
        )
      } else {
        return (
          <CoffeeItem key={item.id} cssClass={cssClass} {...item} />
        )
      }
    })
    return (
      <div className="items">
        {items}
      </div>
    )
  }
}

export default CoffeeList;