import styled from "styled-components"
import {translate} from "../../translater/translater";
import React from "react";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";

const StyledOrangeButton = styled.span`
    font-weight: 600;
    font-size: 18px;
    background: linear-gradient(90deg, #D2AC36, #B87333);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: table;
    cursor: pointer;
`

const NSHelpButton = (props) => {

    const lang = useSelector(state => state.order.lang)

    return  <NavLink to={"https://t.me/PROS100K_support"}>
        <StyledOrangeButton {...props}>
            {translate('0005', lang)}
        </StyledOrangeButton>
    </NavLink>
}

export default  NSHelpButton