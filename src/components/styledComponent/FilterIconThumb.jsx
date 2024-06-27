import styled from "styled-components";

const StyledIconThumb = styled.div`
    display: block;
    position: absolute;
    top: 20px;
    right: 5px;
`

const FilterIconThumb = (props) => {
    return <StyledIconThumb {...props}/>
}

export default FilterIconThumb