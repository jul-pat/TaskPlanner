import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import Register from './register';
import ConfirmRegister from './confirmRegister';
import Confirmation from './confirmation';

const RegisterContent = () => {
  return (
    <BrowserRouter>
      <Container text>
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route path='/register/verify/:token' component={Confirmation} />
          <Route exact path="/register/confirm" component={ConfirmRegister} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default RegisterContent;
