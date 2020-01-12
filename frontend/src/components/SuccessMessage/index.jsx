import React from 'react';
import { Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const SuccessMessage = (props) => {
    return (
        <Message
          content={props.message}
          success
        />
      )
};

export default SuccessMessage;
