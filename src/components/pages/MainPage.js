import React, {Component} from 'react';
import Header from '../Header/Header';
import Beans from '../Beans/Beans';
import Footer from '../Footer/Footer';
import About from '../About/About';
import CoffeeList from '../CoffeeList/CoffeeList';
import './content.scss';
import './shop.scss';
import bg from './main-bg.jpg';
import saleBg from './top-sale-bg.jpg';
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
        <section className="shop shop-bg">
          <div className="container">
            <div className="wrapper">
              <h3>Our best</h3>
              <CoffeeList />
            </div>
          </div>
        </section>
        <Footer />
      </>
    )
  }
}

export default MainPage;