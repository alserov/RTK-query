import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {Todo} from "../types.ts";

export const todosApi = createApi({
    reducerPath: 'todosApi',
    tagTypes: ['Todos'],
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000/'}),
    endpoints: (builder) => ({


        getTodos: builder.query<Todo[], void>({
            query: () => `todos`,
            providesTags: (result) =>
                result
                    ? [...result.map(({id}) => ({type: 'Todos' as const, id})), 'Todos']
                    : ['Todos']
        }),
        getFilteredByTodos: builder.query({
            query: (isFiltered : boolean | '') => `todos/${typeof isFiltered === 'boolean' && `?isCompleted=${isFiltered}`}`,
            providesTags: (result) =>
                result
                    ? [...result.map(({id} : {id: number}) => ({type: 'Todos' as const, id})), 'Todos']
                    : ['Todos']
        }),


        addTodo: builder.mutation({
            query: (body: Pick<Todo, 'title' | 'isCompleted'>) => ({
                url: 'todos',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Todos']
        }),
        deleteTodo: builder.mutation({
            query: (id: number) => ({
                url: `todos/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Todos']
        }),
        changeTodoStatus: builder.mutation({
            query: (body: Todo) => ({
                url: `todos/${body.id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['Todos']
        })
    }),
})

export const {
    useGetTodosQuery,
    useGetFilteredByTodosQuery,
    useAddTodoMutation,
    useDeleteTodoMutation,
    useChangeTodoStatusMutation,
    useLazyGetFilteredByTodosQuery
} = todosApi