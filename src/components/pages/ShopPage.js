import React, {Component} from 'react';
import Header from '../Header/Header';
import Beans from '../Beans/Beans';
import Footer from '../Footer/Footer';
import About from '../About/About';
import CoffeeList from '../CoffeeList/CoffeeList';
import './content.scss';
import './shop.scss';
import './filters.scss';
import bg from './coffee-list-bg.jpg';
import picture from './content-picture.jpg';

class MainPage extends Component {
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
            <div className="wrapper" style={{padding: '70px 200px 0 241px'}}>
              <div className="wrapper-flex">
                <div className="content-picture">
                  <img src={picture} alt="girl drink a coffee" />
                </div>
                <div className="desc" style={{marginTop: 10}}>
                  <h2>About our beans</h2>
                  <Beans color={'black'} style={{marginBottom: 25}} />
                  <p>Extremity sweetness difficult behaviour he of. On disposal of as landlord horrible.</p>
                  <p>Afraid at highly months do things on at. Situation recommend objection do intention so questions. </p> 
                  <p>As greatly removed calling pleased improve an. Last ask him cold feel met spot shy want. Children me laughing we prospect answered followed. At it went is song that held help face.</p>
                </div>
              </div>
              <hr />
            </div>
          </div>
        </section>
        <section className="filters">
          <div className="container">
            <div className="wrapper">
              <div className="filter-character">
                <span>Looking for</span>
                <input type="text" name="search" placeholder="start typing here." />
              </div>
              <div className="filters-tab">
                <span>Or filter</span>
                <div className="filters-tab-button">
                  <button>Brazil</button>
                  <button>Kenya</button>
                  <button>Columbia</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="shop" style={{padding: '25px 0 30px 0'}}>
          <div className="container">
            <div className="wrapper">
              <CoffeeList cssClass={'item-filter'} />
            </div>
          </div>
        </section>
        <Footer />
        </>
    )
  }
}

export default MainPage;