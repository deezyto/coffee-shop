import React, {Component} from 'react';
import Logo from '../Logo/Logo';
import './header.scss';

class Header extends Component {
  state = {

  }

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
                <a style={{color: currentColor}}
                href="/">Coffee house</a>
              </li>
              <li style={{color: currentColor}}>
                <a style={{color: currentColor}}
                href="/">Our coffee</a>
              </li>
              <li style={{color: currentColor}}>
                <a style={{color: currentColor}}
                href="/">For your pleasure</a>
              </li>
            </ul>
          </nav>
        </div>
      </>
    )
  }
}

export default Header;