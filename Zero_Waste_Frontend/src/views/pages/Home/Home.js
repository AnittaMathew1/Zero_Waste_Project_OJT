import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import homeLogo from '../../../assets/img.jpg'
import Type from './Type'
import './home.css'
function Home() {
  return (
    <section>
      <Container fluid className="home-section">
        <Row>
          <Col>
            <img className="homeimage" src={homeLogo} alt="home pic" />
          </Col>
          <Col className="home-header">
            <h1 className="home-heading">
              <b>Home Trash & Recycling Pickup</b>
            </h1>
            <h1 className="heading-name">
              <b>ZERO WASTE</b>
            </h1>
            <div className="type">
              <Type />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Home
