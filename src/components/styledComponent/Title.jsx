import React from "react"
import styled from "styled-components"
import { useSelector } from "react-redux"

const StyledTitle = styled.span`
    font-family: "Montserrat", sans-serif;
    color: #E4E4F0;
    font-size: 1.25em;
    font-weight: 500;
    margin-bottom: ${({mb}) => mb || "0"};
    margin-top: ${({mt}) => mt || "0"};
    margin-right: ${({mr}) => mr || "0"};
    
    align-self: ${props => props.alignself || "start"};

`

const Title = (props) => {

    const theme = useSelector(state => state.order.theme)
    return <StyledTitle {...props} theme={theme}/>
}

export default Title;