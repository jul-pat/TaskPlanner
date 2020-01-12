import React from 'react';
import { Grid, Message } from 'semantic-ui-react';

class Confirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { verified: '' };
    }

    async componentDidMount() {
        const response = await fetch(`/api/users/confirmation/${this.props.match.params.token}`)
            .catch( () => this.setState({ verified: false }));

        if (response.status === 200)
            this.setState({ verified: true });
        else
            this.setState({ verified: false });
    }

    statusComponent() {
        if (this.state.verified ===''){
            return (
                <Message
                    success
                    header='Please wait, verifyng account...'
                />
            );
        }
        else if (this.state.verified === true) {
            return (
                <Message
                    success
                    header='Account verified successfully'
                />
            );
        }
        else {
            return (
                <Message
                    negative
                    header='Failed to verify account'
                />
            );
        }
    }

    render() {
        return (
            <Grid centered>
                {this.statusComponent()}
            </Grid>
        );
    }
};

export default Confirmation;