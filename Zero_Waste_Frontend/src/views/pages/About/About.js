import './About.css'
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import aboutimg from '../../../assets/images/HouseOwner/corporation.jpg'

function About() {
  return (
    <section>
      <Container fluid className="about-section">
        <Row>
          <Col>
            <img className="homeimage" src={aboutimg} alt="home pic" />
          </Col>
          <Col>
            <h1 className="about-heading">
              <b>About Us</b>
            </h1>

            <p className="about">
              {
                "Waste management is one of the world's most challenging issues, irrespective of\
              whether a country is developed or developing. The lack of garbage bins in needed\
              areas, as well as the overflow of already existing bins at public locations prior to\
              the start of the next cleaning process, is a major problem in waste management. This,\
              in turn, causes different threats to that location, such as bad odor and ugliness,\
              which may be the root cause of the spread of various diseases. This project is based\
              on a smart waste management system to avoid any potentially dangerous scenarios and to\
              maintain public cleanliness and health. Through this application the house owners can\
              book their slots for waste collection through our application and do the payment\
              through the online gateway. The waste collectors will come and collect the waste as\
              per the slot booking."
              }
            </p>
          </Col>
        </Row>
        <Row className="rrrdata">
          <Col className="data">
            <p className="rrrs">
              <b>01 R</b>EDUCE
            </p>
            <p>
              {
                'The crucial thing in the waste management procedure is to maintain a perfect balance\
              in consumption and recycle & reuse. If the consumption is less, the rate of recycling\
              or reuse will also be less.'
              }
            </p>
          </Col>
          <Col className="data">
            <p className="rrrs">
              <b>02 R</b>EUSE
            </p>
            <p>
              {
                'The reuse of old stuff can reduce waste and does not affect the waste hierarchy. If\
              you do not have any use of any of these thrown away items, then you can also donate it\
              to someone who needs it.'
              }
            </p>
          </Col>
          <Col className="data">
            <p className="rrrs">
              <b>03 R</b>ECYCLE
            </p>
            <p>
              {
                'Recycling is a process in which the dumping items are transformed into a new item. It\
              is vital that you are well aware of the things that can be recycled.'
              }
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default About
