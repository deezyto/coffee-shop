import React, {Component} from 'react';
import Header from '../Header/Header';
import Beans from '../Beans/Beans';
import Footer from '../Footer/Footer';
import About from '../About/About';
import './content.scss';
import './shop.scss';
import './filters.scss';
import bg from './coffee-list-bg.jpg';
import picture from './coffee-picture.jpg';

class CoffeePage extends Component {
  render() {
    return (
      <>
        <header>
          <Header color={'white'} />
        </header>
        <About style={{paddingBottom: 82, paddingTop: 132}}>
          <img src={bg} alt="coffee list bg" style={{height: 260}} className="about-picture"/>
          <h1>Our Coffee</h1>
        </About>
        <section className="content" id="content">
          <div className="container">
            <div className="wrapper" style={{padding: '70px 134px 30px 134px'}}>
              <div className="wrapper-flex" style={{columnGap: 55}}>
                <div className="content-picture">
                  <img src={picture} style={{maxWidth: 392}} alt="girl drink a coffee" />
                </div>
                <div className="desc" style={{marginTop: 10, textAlign: 'left'}}>
                  <h2 style={{textAlign: 'center'}}>About it</h2>
                  <Beans color={'black'} style={{marginBottom: 25}} />
                  <p><span className="span-self">Coutry:</span> Columbia</p>
                  <p><span>Description: </span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <span>Price: <span className="price">10$</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
        </>
    )
  }
}

export default CoffeePage;