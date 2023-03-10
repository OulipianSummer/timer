import './App.css';
import React from "react";
import * as ReactDOM from 'react-dom';

//React-Bootstrap Imports
import {
  Button, ButtonGroup, Container, Card, Row, Col
} from 'react-bootstrap';

const PHASE_BREAK = 'break';
const PHASE_SESSION = 'session';

// React App
class App extends React.Component {

  // Construct
  constructor(props){
    super(props);
    
    // State obejct
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      minutesRemaining: 25,
      secondsRemaining: 0,
      active: false,
      phase: PHASE_SESSION,
    };

   this.intervalIdRef = React.createRef();
    
    // Internal this binds
    this.breakAlter.bind(this);
    this.sessionAlter.bind(this);
    this.updateActive.bind(this);
    this.restart.bind(this);
  }
  
  // A callback for updating the break state
  breakAlter(op){
    let {breakLength, active} = this.state;

    // Ignore any input if the timer is running
    if(active){return};

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
    let {sessionLength, active} = this.state;

    // Ignore any input if the timer is running
    if(active){return;}
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
    
    // Update sessionLength and minutesRemaining with the same value
    this.setState({sessionLength: sessionLength, minutesRemaining: sessionLength});
  }
  
  // Change whether or not the timer is currently running
  updateActive(){
    let {active} = this.state;
    
    // Invert the play/pause display logic
    const newActive = !active;
    this.setState({active: newActive});
    
    // The timer function. Gets called every 1000ms by setInterval
    const timer = () => {
      let {minutesRemaining,  secondsRemaining, phase} = this.state;
      const {breakLength, sessionLength} = this.state;
      // Decrement the timer
      secondsRemaining--;

      // Guard rails for the seconds values, wraps at 60s/0s
      if(secondsRemaining < 0){
        minutesRemaining --;
        secondsRemaining = 59;
      }

      // Allow the timer to read 00:00 before switching the phase (part of a test requirement)
      if(secondsRemaining === 0 && minutesRemaining === 0){
        if(phase === PHASE_BREAK){
          phase = PHASE_SESSION;
        } else {
          phase = PHASE_BREAK;
        }

        this.setState({phase: phase});

      }

      // Restart the timer to the opposite phase once the either phase is over
      if(minutesRemaining < 0 || secondsRemaining < 0){
        if(phase === PHASE_BREAK){
          this.restart({
            breakLength: breakLength,
            sessionLength: sessionLength,
            minutesRemaining: breakLength,
            secondsRemaining: 0,
            active: true,
          }, false);
        } else {
          this.restart({
            breakLength: breakLength,
            sessionLength: sessionLength,
            minutesRemaining: sessionLength,
            secondsRemaining: 0,
            active: true,
          }, false);
        }
        this.ringBell();
        return;
      }

      // Update the timer each second
      this.setState({minutesRemaining: minutesRemaining,secondsRemaining: secondsRemaining});
    }
    
    if(newActive){
      const id = window.setInterval(timer, 1000);
      
      // Use a ref to store the id from setInterval (this API is silly, but ok)
      this.intervalIdRef.current = id;
    } else {
      
      // Clear the interval stored in a ref
      window.clearInterval(this.intervalIdRef.current);     
    }
  }

  getDefaultSettings() {
    return {     
      breakLength: 5,
      sessionLength: 25,
      minutesRemaining: 25,
      secondsRemaining: 0,
      active: false,
      phase: PHASE_SESSION,
    };
  }

  ringBell(){
    const bell = document.querySelector('#beep');
    if(bell){
      if(bell.duration > 0 && !bell.paused){
        bell.cloneNode(true).play();
        return;
      }
      
      bell.play();


    }
  }
 
  
  // Restart the state to its defaults
  restart(settings = null, clear=true){

    const bell = document.querySelector('#beep');
    if(bell){
      bell.pause();
      bell.currentTime = 0;
    }

    // Reset the timer to default
    if(!settings){
      settings = this.getDefaultSettings();
    }
    // Allow custom passthrough
    this.setState(settings);

    // Stop the timer if requested
    if(clear){
      window.clearInterval(this.intervalIdRef.current);
    }
  }


  
  render() {
    let {breakLength, sessionLength, secondsRemaining, minutesRemaining, active, phase} = this.state;

    //Format the secondsRemaining value
    if(secondsRemaining < 10){
      secondsRemaining = `0${secondsRemaining}`;
    }

    // Format the minutesRemaining value
    if(minutesRemaining < 10){
      minutesRemaining = `0${minutesRemaining}`;
    }

    return (
    <Container className="h-100">
      <Row className="justify-content-center h-100 align-items-center">
        <Col className="">
            <Card className="shadow-lg">
              <Card.Header>
                <h1 className="text-center">25 + 5 Clock</h1>
              </Card.Header>
              <Card.Body>
                <Container className="text-center d-flex flex-column">

                <Row id="session-break-controls">
                  <Col sm={12} md={6} id="break-info" className="mb-5">
                    <Row>
                      <Col>
                        <p className="h3">
                        <span id="break-label">Break Length</span>&nbsp;:&nbsp;  
                        <span id="break-length">{ breakLength }</span>
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <ButtonGroup id="break-controls">
                          <Button variant="dark" active={active} onClick={ e => this.breakAlter('-')} id="break-decrement"><i className="fas fa-minus"></i></Button>
                          <Button variant="dark" active={active} onClick={e => this.breakAlter('+')} id="break-increment"><i className="fas fa-plus"></i></Button>
                        </ButtonGroup>
                      </Col>
                    </Row>
                  </Col>

                  <Col sm={12} md={6} id="session-info" className="mb-5 d-flex flex-column">
                    <Row>
                      <Col>
                        <p className="h3">
                          <span id="session-label">Session Length</span>&nbsp;:&nbsp;  
                          <span id="session-length">{ sessionLength }</span>
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                      <ButtonGroup id="session-controls">
                          <Button variant="dark" active={active} onClick={e => this.sessionAlter('-')} id="session-decrement"><i className='fas fa-minus'></i></Button>
                          <Button variant="dark" active={active} onClick={e => this.sessionAlter('+')} id="session-increment"><i className="fas fa-plus"></i></Button>
                      </ButtonGroup>
                      </Col>
                    </Row>
                  </Col>
                  
                </Row>
                  
                <Row id="timer-wrapper" className='d-flex flex-column'>
                  <Col className='text-center'>
                    <p id="timer-label" className="h3">{ phase === PHASE_SESSION ? "Session" : "Break" }</p>
                    <p id="time-left" className="h1">{ minutesRemaining }:{ secondsRemaining }</p>
                  </Col>
                </Row>
                  
                <Row id="timer-controls" className="d-flex flex-column">
                  <Col>
                  <ButtonGroup>
                    <Button variant="dark" onClick={e => this.updateActive()}>
                      <i id="start_stop" className={"fas fa-2x fa-" + (active ? 'pause' : 'play')}></i>
                    </Button>
                    <Button variant="dark" onClick={e => this.restart()} id="reset"><i className="fas fa-2x fa-rotate-right"></i></Button>
                  </ButtonGroup>
                  </Col>
                </Row>

                <audio preload id="beep" type="audio/mpeg" src="https://www.soundjay.com/misc/bell-ringing-05.mp3" >
                  Your browser does not support audio.
                </audio>

                  
                </Container>
              </Card.Body>
            </Card>
        </Col>
      </Row>
      </Container>

    );
  }
}
//Standard App Export
export default App