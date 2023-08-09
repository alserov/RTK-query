import {configureStore} from "@reduxjs/toolkit";
import {todosApi} from "../api/todosApi.ts";

export const store = configureStore({
    devTools: true,
    reducer: {
        [todosApi.reducerPath] : todosApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(todosApi.middleware)
})
