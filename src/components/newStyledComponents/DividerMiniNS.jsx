import styled from "styled-components";

const StyledDivider = styled.div`
    height: 3px;
    width: 100%;
    background: linear-gradient(to right, #343434, #252525);
`

const DividerMiniNS = (props) => {
    return <StyledDivider {...props}/>
}

export default  DividerMiniNS