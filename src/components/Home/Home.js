import React, { Component } from "react";
import {Link} from "react-router";
import "./css/Home.css";
import {
  Button,
  Col,
  Navbar,
  Nav,
  NavItem
} from "react-bootstrap";
var Scroll  = require('react-scroll');
 
var ScrollLink       = Scroll.Link;
var Element    = Scroll.Element;
var Events     = Scroll.Events;
var scroll     = Scroll.animateScroll;
var scrollSpy  = Scroll.scrollSpy;

export default class Home extends Component {

    componentDidMount() {
 
    Events.scrollEvent.register('begin', function(to, element) {
      console.log("begin", arguments);
    });
 
    Events.scrollEvent.register('end', function(to, element) {
      console.log("end", arguments);
    });
 
    scrollSpy.update();
 
  }
  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }
  scrollToTop() {
    scroll.scrollToTop();
  }
  scrollToBottom() {
    scroll.scrollToBottom();
  }
  scrollTo() {
    scroll.scrollTo(100);
  }
  scrollMore() {
    scroll.scrollMore(100);
  }
  handleSetActive(to) {
    console.log(to);
  }
  render() {
    return (
      <div className="Home">
        <img src="../img/home-bg.jpg" className="hidden" />
        <div className="top">
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">Family</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Nav>

              <NavItem ><ScrollLink activeClass="active" to="about" spy={true} smooth={true} offset={-50} duration={800}>About
        </ScrollLink></NavItem>
              <NavItem ><ScrollLink activeClass="active" to="contact" spy={true} smooth={true} offset={-50} duration={800}>Contact
        </ScrollLink></NavItem>
            </Nav>
            <Navbar.Collapse>
              <Navbar.Form pullRight>
                <Link to = "login"><Button type="submit">Log In</Button></Link>
              </Navbar.Form>
            </Navbar.Collapse>
          </Navbar>
          <br />
          <br />
          <div className="text-center">
            <Col xs={2} xsOffset={5}>
              <div className="circle-element">
                hoi
              </div>
              <br />
              <br />
              <Link to = "register"><Button bsStyle={"primary"} bsSize={"large"}>Get Started</Button></Link>
            </Col>
          </div>
        </div>
        <Element name = 'about' className = 'element'>
        <div className = 'about-section'>

        </div>
        </Element>
        <Element name = 'contact' className = 'element'>
        <div className = 'contact-section'>
        </div>
        </Element>
      </div>
    );
  }
}
