import './App.css'
import {FormEvent, MutableRefObject, useCallback, useEffect, useRef, useState} from "react";
// import {changeTodoComplete, deleteTodo, fetchedTodos} from "../store/slices/todos.ts";
// import {useAppDispatch, useAppSelector} from "../store";
import {
    useAddTodoMutation,
    useChangeTodoStatusMutation,
    useDeleteTodoMutation,
    useGetTodosQuery, useLazyGetFilteredByTodosQuery
} from "../api/todosApi.ts";
import {Todo} from "../types.ts";

function App() {
    const input = useRef() as MutableRefObject<HTMLInputElement>
    const [addTodo] = useAddTodoMutation()
    const [deleteTodo] = useDeleteTodoMutation()
    const [changeCompletedStatus] = useChangeTodoStatusMutation()
    const [getFilteredTodos, {data: filteredTodos}] = useLazyGetFilteredByTodosQuery()
    const {data: todos = [], isLoading} = useGetTodosQuery()

    const [currentTodos, setCurrentTodos] = useState<Todo[]>(todos)
    useEffect(() => {
        setCurrentTodos(todos)
    }, [todos])
    useEffect(() => {
        setCurrentTodos(filteredTodos)
    }, [filteredTodos])

    const handleFilterToggle = async (isCompleted: boolean) => {
        getFilteredTodos(isCompleted)
    }


    const handleAddTodo = useCallback(async (e: FormEvent) => {
        e.preventDefault()
        if (input.current.value !== '') {
            await addTodo({title: input.current.value, isCompleted: false}).unwrap()
            input.current.value = ''
        }
    }, [input?.current?.value])

    const changeCompleteStatus = useCallback(async (todo: Todo) => {
        await changeCompletedStatus({...todo, isCompleted: !todo.isCompleted})
    }, []);

    const deleteTodoHandler = useCallback(async (id: number) => {
        await deleteTodo(id).unwrap()
    }, [])


    if (isLoading) {
        return <h1>Loading</h1>
    }

    return (
        <div>
            <select name="" id="" onChange={e => handleFilterToggle(JSON.parse(e.target.value))}>
                <option value="true">DONE</option>
                <option value="false">NOT DONE YET</option>
            </select>
            {currentTodos?.map(todo => (
                <div key={todo.id}>
                    <p style={todo.isCompleted ? {textDecoration: 'line-through'} : {textDecoration: 'none'}}>{todo.title}</p>
                    <p>{todo.isCompleted}</p>
                    <button
                        onClick={() => changeCompleteStatus(todo)}>{todo.isCompleted ? 'Done' : ' Not Done yet'}</button>
                    <button onClick={() => deleteTodoHandler(todo.id)}>Delete</button>
                </div>
            ))}
            <form onSubmit={handleAddTodo}>
                <input type="text" ref={input}/>
                <button>Add</button>
            </form>
        </div>
    )
}

export default App
