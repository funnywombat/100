import  {createSlice}  from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        order: null,
        isSaved: false,
        theme: false,
        isLoaderVisible: false,                               
        lang: 'ru',
        fullName: '',
    },
    reducers: {
        toggleIsSave(state, action) {
            state.isSaved = action.payload
        },
        clearOrder(state, action) {
            state.order = null
        },
        addOrder(state, action) {
            state.order = action.payload
        },
        changeTheme(state, action) {
            state.theme = action.payload
        },
        changeIsLoaderVisible(state, action) {
            state.isLoaderVisible = action.payload
        },
        changeLanguage(state, action) {
            state.lang = action.payload
        },
        setFullNameToState(state, action) {
            state.fullName = action.payload
        }

    }
})

export const {setFullNameToState, addOrder, clearOrder, toggleIsSave, changeTheme, changeIsLoaderVisible, changeLanguage} = orderSlice.actions

export default orderSlice.reducer