import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';

class FailedTasks extends React.Component {

  render() {
    return (
      <Segment inverted textAlign='center' color="red">
      You failed this task. Next time you will make it!
      <Icon name="thumbs up"/></Segment>
    )
  }
}

export default FailedTasks;    
