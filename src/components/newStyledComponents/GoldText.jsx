import styled from "styled-components"
import React from "react";


const StyledOrangeButton = styled.span`
    font-weight: 600;
    font-size: 20px;
    background: linear-gradient(90deg, #F6BB0D, #B5A883);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: table;
`

const GoldTextNS = (props) => {
    return <StyledOrangeButton {...props} />
}

export default  GoldTextNS