import React from "react";
import styled from "styled-components";

const StyledGreyTitle = styled.span`
    display: flex;
    color: #8e8e8e;
    width: max-content;
    font-size: 18px;
    margin-left: 20px;

`

const GreyTitle = (props) => {

    return <StyledGreyTitle {...props}/>
}

export default GreyTitle;