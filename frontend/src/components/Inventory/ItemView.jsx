import React from 'react';
import { Segment, Grid, Item, Confirm } from 'semantic-ui-react';
import ItemButton from './ItemButton';
import ItemDescription from './ItemDescription';

class ItemView extends React.Component {
  constructor(props){
    super(props);
    this.state = { itemDescription: null,  open: false, confirmName: 'Ok' }
    
    this.setDescription = this.setDescription.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.setConfirmName = this.setConfirmName.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleConfirm = () => { 
    if(this.props.eq === true) {
      if(this.state.item.slot === 'Usable') {
        this.props.useUsableItem(this.state.item);
        this.props.useItem(this.state.item,1);
      } else {
        this.props.equippedItem(this.state.item);
        this.props.useItem(this.state.item,1);
      }
    } else { 
      this.props.unequippedItem(this.state.item);
      this.props.useItem(this.state.item,-1);
      console.log('Unequipped item: get back to backpack');
    } 
    this.setState({ open: false }); 
  }

  handleCancel = () => { 
    this.setState({ open: false }); 
  }

  setDescription = (des) => {
    let description = <ItemDescription  key={des._id} 
                                        item={des} 
                                        equippedThisItem={this.props.equippedItem}
                                        unequippedThisItem={this.props.unequippedItem} 
                                        eq={this.props.eq}
                                        />;
   this.setConfirmName(des);
   this.setState({ itemDescription: description, item: des });
  }

  handleClose = () => this.setState({ open: false, item: null })
  handleOpen = () => this.setState({ open: true })

  setConfirmName = (item) => {
    let name;
    if(this.props.eq === true){
      if(item.slot === 'Usable'){
        name = 'Use';
      }else
        name = 'Equip';
    }else if(this.props.eq === false & item.slot !== 'Usable'){
      name = 'Unequip';
    }
    this.setState({ confirmName: name });
  }

  render() {
    return (
      <Segment inverted>
      <Grid doubling container centered columns='equal' padded>
        {this.props.backpackItem.map( (item, id = 0) => (
          <Item key={item._id}>
            <Grid.Column mobile={4} tablet={2} computer={1} stretched>
                <ItemButton item={item} 
                            setDescription={this.setDescription} 
                            bnActive={this.props.buttonActive}
                            eq={this.props.eq} 
                            handleOpen={this.handleOpen}
                            />
                              
                  <Confirm
                    content={this.state.itemDescription}
                    open={this.state.open}
                    cancelButton='Close'
                    confirmButton={this.state.confirmName}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleConfirm}
                  />

            </Grid.Column>
          </Item> 
        ))}
      </Grid>
      </Segment> 
    );
  }
}

export default ItemView;