import React, {Component} from 'react';
import Beans from '../Beans/Beans';
import Header from '../Header/Header';
import './footer.scss';

class Footer extends Component {
  render() {
    return (
      <>
        <footer>
          <Header color={'black'} />
          <Beans color={'black'} style={{marginTop: 28, marginBottom: 20}} />
        </footer>
      </>
    )
  }
}

export default Footer;