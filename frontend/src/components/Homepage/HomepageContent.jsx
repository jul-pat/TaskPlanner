import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import Quote from './Quote';
import Stats from './Stats';
import Screenshots from './Screenshots';

class HomepageContent extends React.Component {

    render() {
        return (
            <Container>
                <Quote />
                <Grid columns='16'>
                    <Grid.Row stretched>
                        <Grid.Column width='4' floated='left'>
                            <Stats />
                        </Grid.Column>
                        <Grid.Column width='12' floated='right' >
                            <Screenshots />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default HomepageContent;