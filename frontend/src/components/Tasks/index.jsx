import React from 'react';
import { Container } from 'semantic-ui-react';
import MenuTasksFilter from './MenuTasksFilter';

const TasksContent = () => {
    return (
        <Container>
            <MenuTasksFilter />
        </Container>
    );
}

export default TasksContent;