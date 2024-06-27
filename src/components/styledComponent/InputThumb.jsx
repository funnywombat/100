import React from "react";
import styled from "styled-components";

const StyledInputThumb = styled.span`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
`

const InputThumb = (props) => {

    return <StyledInputThumb {...props}/>
}

export default InputThumb;