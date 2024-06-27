import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux"


const StyledThumb = styled.div`
    display: flex;
    flex-direction: ${({direction}) => direction || 'row'};
    width: 100%;
    align-items:  ${({align}) => align || 'center'};
    justify-content:  ${({justify}) => justify || 'start'};
    margin-top: ${props => props.mt || '0'};
    margin-bottom: ${props => props.mb || '0'};
    padding-top: ${props => props.pt || '0'};
    padding-bottom: ${props => props.pb || '0'};
    background: ${props => props.theme === true ? '#eeeeee' : '#000000'};
`


const Thumb = (props) => {
    const theme = useSelector(state => state.order.theme)
    return <StyledThumb {...props} theme={theme}/>
}

export default Thumb;