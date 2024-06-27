import React from "react"
import styled from "styled-components"
import { useSelector } from "react-redux"

const StyledText = styled.span`
    font-family: "Montserrat", sans-serif;;
    color: ${props => props.color || '#646464'};
    font-size: 1.125em;
    font-weight: 400;
    margin-left:  ${({ml}) => ml || "0"};
    margin-right:  ${({mr}) => mr || "0"};
    margin-bottom: ${({mb}) => mb || "0"};
    margin-top: ${({mt}) => mt || "0"};
    align-self: ${props => props.aligntext || "center"};
    width: ${props => props.width || 'max-content'};
    flex-wrap: normal;
`

const TextGray = (props) => {
    const theme = useSelector(state => state.order.theme)
    return <StyledText {...props} theme={theme}/>
}

export default TextGray;