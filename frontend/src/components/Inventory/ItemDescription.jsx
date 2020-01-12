import React from 'react';

import { Segment, Image, Table } from 'semantic-ui-react';

class ItemDescription extends React.Component {
  state = { item: null }

  componentDidMount() {
    if (this.props.item)
      this.setState({ item: this.props.item });
  }

  render() {
    return (
      <Segment padded inverted color='black'>
        <h2>
          {this.state.item !== null ? 
            <div> 
              <Image src={this.state.item.picture} avatar />
              {this.state.item.name}
            </div>:
            ' '
          }
        </h2>
        <p>{this.state.item !== null ? this.state.item.description :' '}</p>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={2}><i>{this.state.item !== null ? 'Effect' : ' '}</i></Table.Cell>
              <Table.Cell>{this.state.item !== null ? this.state.item.effect : ' '}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{this.state.item !== null ? 'Value' : ' '}</Table.Cell>
              <Table.Cell>{this.state.item !== null ? this.state.item.effect_value : ' '}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{this.state.item !== null ? 'Slot' : ' '}</Table.Cell>
              <Table.Cell>{this.state.item !== null ? this.state.item.slot : ' '}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{this.state.item !== null ? 'Price' : ' '}</Table.Cell>
              <Table.Cell>{this.state.item !== null ? this.state.item.price : ' '}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <br></br><br></br>
      </Segment>
    );
  }
}

export default ItemDescription;