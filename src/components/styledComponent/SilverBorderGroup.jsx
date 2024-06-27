import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux"

const StyledGroup = styled.div`
    position: relative;
    display: flex;
    flex-direction: ${props => props.direction || "row"};
    width: 100%;
    border: 3px solid #fff;
    border-image: linear-gradient(45deg, #9C9C9C, #818181, #E1E1E1, #A5A5A5, #808080) 1;
    background: linear-gradient(red, blue);
    border-radius: 10px;
    align-items: ${props => props.align || "center"};
    justify-content: ${props => props.justify || "space-between"};
    padding: ${({padding}) => padding || "10px"};
    margin-bottom: ${({mb}) => mb || "0px"};
    margin-top: ${({mt}) => mt || "0px"};
    background: ${props => props.theme === true ? '#ffffff' : '#1c1c1e'};
`

const SilverBorderGroup = (props) => {
    const theme = useSelector(state => state.order.theme)
    
    return <StyledGroup {...props} theme={theme}/>
}

export default SilverBorderGroup;