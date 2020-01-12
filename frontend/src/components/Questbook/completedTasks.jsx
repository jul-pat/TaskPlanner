import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';

class CompletedTasks extends React.Component {
  render() {
    return (
      <Segment inverted textAlign='center' color="green">
      You did it! Congratulations!
      <Icon name="bolt"/></Segment> 
    );
  }
}

export default CompletedTasks;    
