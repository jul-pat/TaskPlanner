import React from 'react';
import _ from 'lodash';
import {
  Button, Icon, Segment, Grid
  } from 'semantic-ui-react'
import setHeaders from '../../utils/setHeaders';
import axios from 'axios';

class FinishTask extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      status: ''
    } 
}
  setStatus = async () => {
    return this.props.time.timeToEnd >=0 ? this.setState({status: 'completed'}) : this.setState({status: 'failed'});
  }

  putData = async (task_id, questbook_id) =>{
    await axios({
      url: `/api/questbook/${questbook_id}/task/${task_id}`,
      method: 'put',
      headers: setHeaders(),
      data: {status: this.state.status}
    }).then((response) => {
    })
  }

  putGold = async (inventory_id, gold) =>{
    await axios({
      url: `/api/inventory/${inventory_id}/gold`,
      method: 'put',
      headers: setHeaders(),
      data: {inventory: {gold: gold}}
    }).then((response) => {
    })
  }

  putExp = async (character_id, exp_points) =>{
    await axios({
      url: `/api/characters/${character_id}/exp_points`,
      method: 'put',
      headers: setHeaders(),
      data: {exp_points: exp_points}
    }).then((response) => {
    })
  }

  putHealth = async (character_id, health) =>{
    await axios({
      url: `/api/characters/${character_id}/health`,
      method: 'put',
      headers: setHeaders(),
      data: {health: health}
    }).then((response) => {
    })
  }

  taskCompleted = async (inventory_id, character_id, character) => {
    const response = await fetch(`/api/inventory/${inventory_id}`, setHeaders());
      const inventory = await response.json();
      const gold = inventory.gold + this.props.task.gold
      const exp_points = character.exp_points + this.props.task.exp
      await this.putGold(inventory_id, gold)
      await this.putExp(character_id, exp_points)
  }

    taskFailed = async (character_id, character) => {
      const health = character.health - this.props.task.penalty
      await this.putHealth(character_id, health);
  }

  finishTask = async () => {
    const user = await fetch('/api/users/me', setHeaders());
    const body = await user.json();
    const response = await fetch(`/api/characters/${body.character_id}`, setHeaders());
    const character = await response.json();
    await this.putData(this.props.task._id, character.questbook_id);
    if(this.state.status === 'completed'){
      this.taskCompleted(character.inventory_id, body.character_id, character);
  }
     else if (this.state.status === 'failed'){
      this.taskFailed(body.character_id, character);
  }
  }
  
  onButtonSubmit = async e => {
    e.preventDefault();
    console.log(this.state.status);
    await this.setStatus();
    console.log(this.state.status);
    await this.finishTask();
    console.log('message');
    this.props.taskStateChanged(this.state.status);
  }

  onButtonSubmitCompletedTask = async e => {
    e.preventDefault();
    await this.setState({status: 'completed'});
    await this.finishTask();
    this.props.taskStateChanged(this.state.status);
  }
  onButtonSubmitFailedTask = async e => {
    e.preventDefault();
    await this.setState({status: 'failed'});
    await this.finishTask();
    this.props.taskStateChanged(this.state.status);
  }

  render() {
    return (
      this.props.time.timeToEnd >0 ? 
      <div>
        <Button fluid icon color="blue" onClick={this.onButtonSubmit}>
          Finish task
          <Icon name="check circle"/>
        </Button>
        </div> : 
        <div>
          <Segment inverted textAlign='center' color='grey'>
          Did you finished this task?
        </Segment>
        <Grid columns={2}>
          <Grid.Column>
        <Button fluid color="green" onClick={this.onButtonSubmitCompletedTask}>
          Yes!
          <Icon name="check circle"/>
        </Button>
        </Grid.Column>
        <Grid.Column>
        <Button fluid color="red" onClick={this.onButtonSubmitFailedTask}>
          No...
          <Icon name="check circle"/>
        </Button>
        </Grid.Column>
        </Grid>
        </div>
    );
  }
}

export default FinishTask;