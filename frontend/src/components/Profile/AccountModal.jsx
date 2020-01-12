import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import "./style-accountModal.css";
import setHeaders from '../../utils/setHeaders';
import TopPortal from '../Utils/TopPortal';

class AccountModal extends React.Component {
    constructor(props){
        super(props);

        this.portalRefDiff = React.createRef();
        this.portalRefWrong = React.createRef();
        this.portalRefSucc = React.createRef();

        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            id: this.props.id,
            email: this.props.email,
            userName: this.props.userName
        };
    }

    componentDidMount() {
          this.setState({
              id: this.props.id,
              email: this.props.email,
              userName: this.props.userName
          })
      } 

    handleNewPassChange = (event) => {
        this.setState({newPassword: event.target.value});
    }

    handleConfirmPassChange = (event) => {
        this.setState({confirmPassword: event.target.value});
    }

    onPassButtonSubmit = async () => {
            console.log(this.state.confirmPassword);
            console.log(this.state.newPassword);
            console.log(this.state.id)
            if(this.state.confirmPassword===this.state.newPassword) {
                const data = {
                    email: this.state.email,
                    password: this.state.newPassword
                };
                let params = {...setHeaders(), body: JSON.stringify(data), method: "PUT"};
                fetch(`/api/users/${this.state.id}/password`, params)
                    .then((res) => {
                        if(res.status !== 200) {
                            this.portalRefWrong.current.handleOpen();
                        } else {
                            this.portalRefSucc.current.handleOpen();
                        }
                        
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                this.portalRefDiff.current.handleOpen();
            }
    }

    render() {
        return (
            <div className="modalAccount">
                <div className="modalAccountHeader">
                        <h3>Change account data</h3>
                </div>
                <div id="modalAccountPassInput">
                    <h4>Change password</h4>
                    <Input onChange={this.handleNewPassChange} type="password" label="New password" placeholder='Enter new password' />
                    <Input onChange={this.handleConfirmPassChange} type="password" label="Confirm password" placeholder='Enter confirm password' />
                    <Button basic color='yellow' onClick={this.onPassButtonSubmit} value="">
                        Change password
                    </Button>

                    <TopPortal
                        ref={this.portalRefDiff}
                        header={'Failed!'}
                        description='Passwords are not the same'
                    />
                    <TopPortal
                        ref={this.portalRefWrong}
                        header={'Failed!'}
                        description='Password is not correct'
                    />
                    <TopPortal
                        ref={this.portalRefSucc}
                        header={'Success!'}
                        description='Password has been changed'
                    />
                </div>
            </div>
        );
    }
}

export default AccountModal;
