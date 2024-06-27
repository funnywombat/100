import React from "react";
import styled from "styled-components";

const StyledFilterGroup = styled.div`

    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 20px;
    right: 55px;
`

const FilterGroup = ({children}, props) => {

    return <StyledFilterGroup {...props}>
        {children}
    </StyledFilterGroup>
}

export default FilterGroup;