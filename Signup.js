import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Alert } from 'reactstrap';
import signup_img from './img/signup-image.jpg';
import LoaderButton from "./LoaderButton";
import Modal from 'react-modal';
import logo from './img/Peach-Logo.png';

const SUCCESSMESSAGE = "Success";

Modal.setAppElement('#root')

class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    reppassword:'',
    isValid: false,
    isSuccess: false,
    isLoading: false,
    modalIsOpen: false
  };

  constructor(props) {
    super(props);
    this.repPass = React.createRef();
    this.clearState = this.clearState.bind(this);
    this.onDismissSuccess = this.onDismissSuccess.bind(this);
    this.onDismissValid = this.onDismissValid.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.routeChange = this.routeChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  onDismissSuccess() {
    this.setState({ isSuccess: false });
  }

  onDismissValid() {
    this.setState({ isValid: false });
  }

  validatePassword(e){
    this.setState({ reppassword: e.target.value },() => {
      const { password, reppassword } = this.state;
      if (password !== reppassword) {
        this.repPass.current.setCustomValidity("Passwords don't match!!");
      }
      else {
        this.repPass.current.setCustomValidity("");
      }
    });
  }

  clearState(){
    this.setState({
      name: '',
      email: '',
      password: '',
      reppassword:'',
      isValid: false });
    }

    routeChange() {
      let path = `Login`;
      this.props.history.push(path);
    }

    handleSubmit = async e => {
      e.preventDefault();
      this.setState({isLoading: true});
      var today = new Date();
      const response = await fetch('/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.name, // name
          password:this.state.password, // password
          email: this.state.email,
          date: today,
          Reserve: [],
          Reviews: []}),
        });
        const body = await response.text();
        if (body === SUCCESSMESSAGE){
          this.clearState();
          this.setState({ isSuccess: true });
        }
        this.setState({isLoading: false});
      };

      openModal() {
        this.setState({modalIsOpen: true});
      }

      afterOpenModal() {
        // references are now sync'd and can be accessed.
      }

      closeModal() {
        this.setState({modalIsOpen: false});
      }
      render() {
        var TermsCond = <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={modalStyles}
          contentLabel="Terms & Conditions"
          id = "TermsModal"
          >
          <h3>Terms and Conditions</h3>
          <div id="box">
          <div id="model-left">
          Our terms and conditions are pretty simple!
          <br/>
          We have two simple rules:
          <br/>
          1. Have FUN!
          <br/>
          2. Don't SUE us!
          <br/>
          <br/>
          <Link onClick={this.closeModal}>Close</Link>
          </div>
          <div id="model-right">
          <img src={logo} id="peaches_logo" alt="Peaches Logo" />
          </div>
          </div>
          </Modal>;
        return (
          <div className="App">
          <section className="sign-in">
          <div className="container">
          <Alert color="success" isOpen={this.state.isSuccess} toggle={this.onDismissSuccess}>
          User created successfully! <a href ="Login"> Login here </a>
          </Alert>
          <div className="signup-content">
          <div className="signup-form">
          <h3 className="form-title">Sign up</h3>
          <form onSubmit={this.handleSubmit} className="register-form" id="register-form">
          <div className="form-group">
          <label for="name"><i className="fas fa-user-alt"></i></label>
          <input name="name" id="name" type="text" placeholder="Name" value={this.state.name} autoComplete="name"
          onChange={e => this.setState({ name: e.target.value })} required/>
          </div>
          <div className="form-group">
          <label for="email"><i className="fas fa-envelope"></i></label>
          <input name="email" id="email_add" type="email" placeholder="Email" value={this.state.email} autoComplete="email"
          onChange={e => this.setState({ email: e.target.value })} required/>
          </div>
          <div className="form-group">
          <label for="pass"><i className="fas fa-lock"></i></label>
          <input name="pass" id="pass" type="password" placeholder="Password" value={this.state.password} autoComplete="new-password"
          onChange={e => this.setState({ password: e.target.value })} suggested="new-password" required/>
          </div>
          <div className="form-group">
          <label for="re-pass"><i className="fas fa-key"></i></label>
          <input name="re_pass" id="re_pass" type="password" placeholder="Repeat password" value={this.state.reppassword} ref={this.repPass}
          onChange={this.validatePassword} required/>
          </div>
          <div className="form-group">
          <p>By creating an account you agree to our <Link onClick={this.openModal}>Terms & Privacy</Link>.</p>
          {TermsCond}
          </div>
          <div className="form-group form-button">
          <LoaderButton
          block
          bsSize="large"
          type="submit"
          isLoading={this.state.isLoading}
          text="Sign up"
          loadingText=" Registering"
          />
          </div>
          </form>
          </div>
          <div className="signup-image">
          <figure><img src={signup_img} alt="sign up"/></figure>
          <a href="/Login" className="signup-image-link">I am a already a member</a>
          </div>
          </div>
          </div>
          </section>
          </div>
        );
      }
    }

    export default Signup;

    const modalStyles = {
      content : {
        height                : 'auto',
        width                 : 'auto',
        top                   : '30%',
        left                  : '20%',
        right                 : 'auto',
        bottom                : 'auto',
        transform             : 'translate(-5vh, -5vh)'
      }
    };
