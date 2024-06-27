

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import "@fontsource/noto-sans-georgian/400.css";
import "@fontsource/noto-sans-georgian/700.css";

import { createGlobalStyle } from 'styled-components'

import { useSelector } from 'react-redux'


const Global = createGlobalStyle`

  body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: ${props => props.theme === true ? '#eeeeee' : '#000000'};
    color: ${props => props.theme === true ? '#000000' : '#ffffff'};
    font-family: "Montserrat", sans-serif;
    width: 100%;
  }

  * {
    font-family: inherit;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-weight: 500;  
    font-size: 14px;
  }


  img {
    display: inline-block;
    object-fit: cover;
    background: transparent;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }


  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
  -webkit-appearance: none;
    margin: 0;
  }

  input {
    /* caret-color: transparent; */
    box-shadow: 0 0 0 black;
  }

  select {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    border: none;
    outline: none;
  }


`


const GlobalStyles = (props) => {

    let theme = useSelector(state => state.order.theme)

    return <Global {...props} theme={theme}/>   
}


export default GlobalStyles
