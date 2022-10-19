import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Logo from '../Logo/Logo';
import './header.scss';

class Header extends Component {
  render() {
    const {color} = this.props;
    const currentColor = color ? color : 'white';

    return (
      <>
        <div className="container">
          <nav>
            <ul>
              <li>
                <Logo color={currentColor} />
                <Link style={{color: currentColor}}
                to="/">Coffee house</Link>
              </li>
              <li>
                <Link style={{color: currentColor}}
                to="/shop">Our coffee</Link>
              </li>
              <li>
                <Link style={{color: currentColor}}
                to="/coffee-page">For your pleasure</Link>
              </li>
            </ul>
          </nav>
        </div>
      </>
    )
  }
}

export default Header;