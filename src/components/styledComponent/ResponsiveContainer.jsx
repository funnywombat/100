import React from "react";
import styled from "styled-components";

const StyledFlex = styled.div`
    position: relative;
    display: flex;
    flex-direction: ${props => props.direction || "row"};
    width: 100%;
    align-items: ${props => props.align || "center"};
    justify-content: ${props => props.justify || "center"};
    padding: ${({padding}) => padding || "0"};
    margin: ${({margin}) => margin || "0"};
    margin-bottom: ${({mb}) => mb || "0"};
    margin-top: ${({mt}) => mt || "0"};
    margin-right: ${({mr}) => mr || "0"};
    
    @media  screen and (min-width: 600px) {
        zoom: 0.7;
    }

    @media  screen and (min-width: 320px) {
        zoom: 0.7;
    }
`

const ResponsiveContainer = (props) => {

    return <StyledFlex {...props}/>
}

export default ResponsiveContainer;