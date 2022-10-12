import React, {Component} from 'react';
import Header from '../Header/Header';
import Beans from '../Beans/Beans';
import Footer from '../Footer/Footer';
import About from '../About/About';
import CoffeeList from '../CoffeeList/CoffeeList';
import './content.scss';
import './topSale.scss';
/* import item from '../../img/items/item.jpg';
import item2 from '../../img/items/item2.jpg';
import item3 from '../../img/items/item3.jpg'; */
import bg from './main-bg.jpg'

class MainPage extends Component {
  render() {
    return (
      <>
        <header>
          <Header color={'white'} />
        </header>
        <About>
          <img src={bg} className={'about-picture'} alt="main-bg" />
          <h1>Everything You Love About Coffee</h1>
            <Beans color={'white'} />
            <div className="subtitles">
              <p>We makes every day full of energy and taste</p>
              <p>Want to try our beans?</p>
            </div>
          <a href="#content" className="button">more</a>
        </About>
        <section className="content" id="content">
          <div className="container">
            <div className="wrapper">
              <h2>About Us</h2>
              <Beans color={'black'} />
              <div className="desc">
                <p>Extremity sweetness difficult behaviour he of. On disposal of as landlord horrible. Afraid at highly months do things on at. Situation recommend objection do intention so questions. As greatly removed calling pleased improve an. Last ask him cold feel met spot shy want. Children me laughing we prospect answered followed. At it went is song that held help face.</p>
                <p>Now residence dashwoods she excellent you. Shade being under his bed her, Much read on as draw. Blessing for ignorant exercise any yourself unpacked. Pleasant horrible but confined day end marriage. Eagerness furniture set preserved far recommend. Did even but nor are most gave hope. Secure active living depend son repair day ladies now.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="top-sale">
          <div className="container">
            <div className="wrapper">
              <h3>Our best</h3>
              <CoffeeList />
            </div>
          </div>
        </section>
        {/* <section className="top-sale">
          <div className="container">
            <div className="wrapper">
              <h3>Our best</h3>
              <div className="items">
                <div className="item">
                  <a href="/">
                    <div className="picture">
                      <img src={item} alt="Coffee" />
                    </div>
                    <div className="title">AROMISTICO Coffee 1 kg</div>
                    <div className="type"></div>
                    <div className="price">7$</div>
                  </a>
                </div>
                <div className="item">
                  <a href="/">
                    <div className="picture">
                      <img src={item2} alt="Coffee" />
                    </div>
                    <div className="title">Solimo Coffee Beans 2 kg</div>
                    <div className="type"></div>
                    <div className="price">10$</div>
                  </a>
                </div>
                <div className="item">
                  <a href="/">
                    <div className="picture">
                      <img src={item3} alt="Coffee" />
                    </div>
                    <div className="title">Presto Coffee Beans 1 kg</div>
                    <div className="type"></div>
                    <div className="price">20$</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        <Footer />
      </>
    )
  }
}

export default MainPage;