import React from 'react';
import { Segment, Grid, Header } from 'semantic-ui-react';
import ViewImage from './ViewImage';

class Screenshots extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: false };
    }

    handleShow = () => this.setState({ active: true })
    handleHide = () => this.setState({ active: false })

    render() {
        return (
            <Segment color='green' inverted>
                <Segment inverted >
                    <Header as='h1' textAlign='center'>Gallery</Header>
                    <Grid columns='3' relaxed>
                        <Grid.Row>
                            <Grid.Column>
                                <ViewImage src={'https://i.imgur.com/eGToPQZ.png'} title={'Creating Character'} />
                            </Grid.Column>
                            <Grid.Column>
                                <ViewImage src={'https://i.imgur.com/sNAqzPv.png'} title={'Profile'} />
                            </Grid.Column>
                            <Grid.Column>
                                <ViewImage src={'https://i.imgur.com/CidhSBl.png'} title={'Tasks'} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <ViewImage src={'https://i.imgur.com/JcCqT9s.png'} title={'Questbook'} />
                            </Grid.Column>
                            <Grid.Column>
                                <ViewImage src={'https://i.imgur.com/vd3MQVB.png'} title={'Making your own tasks'} />
                            </Grid.Column>
                            <Grid.Column>
                                <ViewImage src={'https://i.imgur.com/nSf3xau.png'} title={'Shop'} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Segment>
        );
    }
}

export default Screenshots;