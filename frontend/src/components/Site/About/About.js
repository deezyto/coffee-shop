import React, {Component} from 'react';
import './about.scss';

class About extends Component {
  render() {
    const {style} = this.props;
    return (
      <section className="about" style={style}>
          <div className="container">
            {this.props.children}
          </div>
        </section>
    )
  }
}

export default About;