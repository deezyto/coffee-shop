import React, {Component} from 'react';
import './coffeeItem.scss';

class CoffeeItem extends Component {
  render() {
    const {img, title, country, price, link, cssClass} = this.props;

    return (
      <div className={cssClass ? cssClass + " item" : "item"}>
        <a href={link}>
          <div className="picture">
            <img src={img} alt="Coffee" />
          </div>
          <div className="title">{title}</div>
          <div className="type">{country}</div>
          <div className="price">{price + '$'}</div>
        </a>
      </div>
    )
  }
}

export default CoffeeItem;