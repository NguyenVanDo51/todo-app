import React, { Suspense } from 'react';

const ListTodo = React.lazy(() => import('../../container/components/todos/left/ListTodo'));
const TodoLayout = React.lazy(() => import('../../container/components/todos/right/TodoLayout'));

const TodoCategory = (props) => {
    const { match } = props;
    
    return (
        <>
            <Suspense fallback={null}>
                <ListTodo menuActiveTodo={match.params.id} />
            </Suspense>
            <Suspense fallback={null}>
                <TodoLayout category={match.params.id} />
            </Suspense>
        </>
    );
};

export default TodoCategory;
