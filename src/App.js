import './App.css';
import React from "react";
import * as ReactDOM from 'react-dom';

//React-Bootstrap Imports
import {
  Button, ButtonGroup, Container, Card, Row, Col
} from 'react-bootstrap';

/*const Button = ReactBootstrap.Button;
const Container = ReactBootstrap.Container;
const Card = ReactBootstrap.Card;
const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;
const ButtonGroup = ReactBootstrap.ButtonGroup;
*/

// React App
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      secondsRemaining: '00',
      active: false,
      phase: 'session',
    };
    
    // Internal this binds
    this.breakAlter.bind(this);
    this.sessionAlter.bind(this);
    this.updateActive.bind(this);
    this.restart.bind(this);
  }
  
  // A callback for updating the break state
  breakAlter(op){
    let {breakLength} = this.state;
    switch(op){
      case '+':
        // Don't go above 60
        if(breakLength < 60){
          breakLength++;
        }
      break;
      
      case '-':
        // Don't go below 1
        if(breakLength > 1){
          breakLength--;
        }
      break;
    }
    
    this.setState({breakLength: breakLength});
  }
  
   // A callback for updating the session state
  sessionAlter(op){
    let {sessionLength} = this.state;
    switch(op){
      case '+':
        if(sessionLength < 60){
          sessionLength++;
        }
      break;
      
      case '-':
        // Don't go below 1
        if(sessionLength > 1){
          sessionLength--;
        }
      break;
    }
    
    this.setState({sessionLength: sessionLength});
  }
  
  // Change whether or not the timer is currently running
  updateActive(){
    let {active, breakLength, sessionLength, secondsRemaining, phase} = this.state;
    console.log(secondsRemaining);
    const newActive = !active;
    
    // A timer function, can be passed as a top level function to window.setTimeout and window.clearTimeout
    const timer = (secondsRemaining, breakLength) => {
      secondsRemaining = parseInt(secondsRemaining);
      console.log(secondsRemaining);

      secondsRemaining--;

      // Guard rails for the seconds values
      if(breakLength < 0){
        sessionLength --;
        breakLength = 59;
      }
    this.setState({breakLength: breakLength, secondsRemaining: secondsRemaining});
  }
    
    if(newActive){
      window.setTimeout(timer, 1000);
    } else {
      window.clearTimeout(timer);     
    }
    
    this.setState({active: newActive});
  }
 
  
  // Restart the state to its defaults
  restart(){
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      minutesRemaining: 25,
      secondsRemaining: "00",
      active: false,
    })
  }
  
  
  // Render
  render() {
    const {breakLength, sessionLength, minutesRemaining, secondsRemaining, active} = this.state;
    return (
      <Row>
        <Col>
          <Container>
            <Card>
              <Card.Header>
                <h1 className="text-center">25 + 5 Clock</h1>
              </Card.Header>
              <Card.Body>
                <Container className="text-center d-flex flex-column w-50">

                <Row id="session-break-controls">
                  <Col id="break-info" className="my-5 d-flex flex-column">
                    <p>
                      <span id="break-label">Break Length</span>&nbsp;:&nbsp;  
                      <span id="break-length">{ breakLength }</span>
                    </p>
                    <Col>
                      <ButtonGroup id="break-controls" className="col-12 col-md-6">
                        <Button onClick={ e => this.breakAlter('-')} id="break-decrement"><i className="fas fa-minus"></i></Button>
                        <Button onClick={e => this.breakAlter('+')} id="break-increment"><i className="fas fa-plus"></i></Button>
                      </ButtonGroup>
                    </Col>
                  </Col>

                  <Col id="session-info" className="my-5 d-flex flex-column">
                    <p>
                      <span id="session-label">Session Length</span>&nbsp;:&nbsp;  
                      <span id="session-length">{ sessionLength }</span>
                    </p>
                    <Col>
                    <ButtonGroup id="session-controls" className="col-12 col-md-6">
                        <Button onClick={e => this.sessionAlter('-')} id="session-decrement"><i className='fas fa-minus'></i></Button>
                        <Button onClick={e => this.sessionAlter('+')} id="session-increment"><i className="fas fa-plus"></i></Button>
                    </ButtonGroup>
                    </Col>
                  </Col>
                  
                </Row>
                  
                <Row id="timer-wrapper" className='d-flex flex-column'>
                  <Col className='text-center'>
                    <p id="timer-label" className="h2">Session</p>
                    <p id="time-left" className="h1">{ sessionLength }:{ secondsRemaining }</p>
                  </Col>
                </Row>
                  
                <Row id="timer-controls" className="d-flex flex-column">
                  <Col>
                  <ButtonGroup>
                    <Button onClick={e => this.updateActive()}>
                      <i id="start_stop" className={"fas fa-2x fa-" + (active ? 'pause' : 'play')}></i>
                    </Button>
                    <Button onClick={e => this.restart()} id="reset"><i className="fas fa-2x fa-rotate-right"></i></Button>
                  </ButtonGroup>
                  </Col>
                </Row>

                  
                </Container>
              </Card.Body>
            </Card>
          </Container>
        </Col>
      </Row>
    );
  }
}

//Standard App Export
export default App