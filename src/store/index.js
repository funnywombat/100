import {configureStore}  from "@reduxjs/toolkit"
import orderSlice from "./orderSlice"


export default configureStore({
    reducer: {
        order: orderSlice
    }
})