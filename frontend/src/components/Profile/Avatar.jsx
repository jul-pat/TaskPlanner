import React from 'react';
import { Image, Modal } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import AvatarModal from './AvatarModal';
import setHeaders from '../../utils/setHeaders';

class Avatar extends React.Component {
    constructor(props) {
        super(props);

    this.avatarHoverRef = React.createRef();
    this.state = {
        avatar: this.props.avatar,
        id: this.props.id
    }
    }

    componentDidMount() {
        this.avatarHoverRef.current.style.opacity="0%"
        this.avatarHoverRef.current.addEventListener("mouseover", this.onMouseOverAvatar);
        this.avatarHoverRef.current.addEventListener("mouseleave", this.onMouseLeaveAvatar);
    }

    componentDidUpdate(prevProps) {
        if(this.props.avatar !== prevProps.avatar)
        {
          this.setState({
              avatar: this.props.avatar,
              id: this.props.id
          })
        }
      } 

    onMouseOverAvatar = () => {
        this.avatarHoverRef.current.style.opacity="70%";
    }

    onMouseLeaveAvatar = () => {
        this.avatarHoverRef.current.style.opacity="0%";
    }

    handleClose = (img) => {
        this.img = img;
    }

    onModalClose = () => {
        this.setState({avatar: this.img});
        this.putAvatar(this.img);
    }

    putAvatar = async (img) => {
        const data = {
            avatar: img
        };
        let params = {...setHeaders(), body: JSON.stringify(data), method: "PUT"};
        const response = await fetch(`/api/characters/${this.props.id}/avatar`, params);
    }

    render() {
        return (
            <div className="avatarWrap">
                <Modal 
                size="small"
                trigger={
                    <div id='avatarHover' ref={this.avatarHoverRef}>
                        <h1>Change avatar</h1>
                    </div>
                }
                onClose={this.onModalClose}
                >
                <AvatarModal img={this.state.avatar} handleClose={this.handleClose}/>
                </Modal>
                <div className='avatarDiv'>
                    <Image id='avatar' src={this.state.avatar} size='medium' rounded />
                </div>
            </div>
        );
    }
}

export default Avatar