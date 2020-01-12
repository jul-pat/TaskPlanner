import React from 'react';
import { Segment, Grid } from 'semantic-ui-react';

class Quote extends React.Component {
    constructor(props) {
        super(props);
        this.state = { quote: '' };
    }

    fetchQuote = async () => {
        const quote = await fetch('https://type.fit/api/quotes')
            .then(response => response.json())
            .then(response => response[Math.floor(Math.random() * response.length)]);
        this.setState({ quote: quote });
    }

    componentDidMount() {
        this.fetchQuote();
    }

    render() {
        return (
            <Segment textAlign='center' color='green' inverted>
                <Grid columns={8} verticalAlign='middle'>
                    <Grid.Column width={14}>
                        <Segment inverted>
                            <h1>''{this.state.quote.text}''</h1>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <h3>~ {this.state.quote.author ? this.state.quote.author : 'Unknown'}</h3>
                    </Grid.Column>
                </Grid>
            </Segment>

        );
    }
}

export default Quote;