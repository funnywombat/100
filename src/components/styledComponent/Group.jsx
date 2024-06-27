import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux"

const StyledGroup = styled.div`
    position: relative;
    display: flex;
    flex-direction: ${props => props.direction || "row"};
    width: 100%;
    border-radius: 10px;
    align-items: ${props => props.align || "center"};
    justify-content: ${props => props.justify || "space-between"};
    padding: ${({padding}) => padding || "10px"};
    margin-bottom: ${({mb}) => mb || "10px"};
    margin-top: ${({mt}) => mt || "10px"};
    background: ${props => props.theme === true ? '#ffffff' : '#1c1c1e'};
`

const Group = (props) => {
    const theme = useSelector(state => state.order.theme)
    
    return <StyledGroup {...props} theme={theme}/>
}

export default Group;