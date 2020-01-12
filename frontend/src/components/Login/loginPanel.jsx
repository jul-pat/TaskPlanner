import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react'
import jwt from 'jwt-decode';
import Store from '../../Store';
import ErrorMessage from '../ErrorMessage';
const axios = require('axios');

class LoginPanel extends React.Component {

  state = {
    email: '',
    password: '',
  }

  static contextType = Store;

  onButtonSubmit = async e => {
    e.preventDefault();
    const data = this.state;
    delete this.state["invalidData"];
    try {
      const res = await axios({
        method: 'post',
        url: '/api/auth',
        data: data,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(res.status);

      if(res.status === 203) {
        localStorage.setItem('email', this.state.email);
        document.location.href = '/login/notVerified';
      } else if (res.status === 200) {
        const token = res.headers["x-auth-token"];
        localStorage.setItem('token', token);
        localStorage.setItem('id', jwt(token)._id);
        this.context.changeStore('isLogged', true);
        this.setState({ isLogged: true });
      } else {
        this.setState({ invalidData: true });
      }
    }
    catch (error) {
      console.error('Error Login:', error);
      this.setState({ invalidData: true });
    }
  }

  loginValidate = (e) => {
    if (this.state.invalidData) {
      return <ErrorMessage message='Invalid email or password' />
    }
    else { return null }
  }

  render() {
    if (this.context.isLogged) return <Redirect to="/" />;

    return (
      <Grid centered>
        <Segment compact textAlign='left' inverted>
          <Form error onSubmit={this.onButtonSubmit} inverted>
            <Header inverted textAlign='center'>Login</Header>
            <Form.Input
              label='Email'
              placeholder='Email'
              name='email'
              type='email'
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
            />
            <Form.Input
              label='Password'
              placeholder='Password'
              name='password'
              type='password'
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
              error={this.loginValidate()}
            />
            <Grid textAlign='center' padded>
              <Button color='purple' type='submit'>Submit</Button>
            </Grid>
          </Form>
        </Segment>
      </Grid >
    );
  }
}

export default LoginPanel;