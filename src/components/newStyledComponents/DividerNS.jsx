import styled from "styled-components";

const StyledDivider = styled.div`
    height: 4px;
    width: ${props => props.width || '100%'};
    background: linear-gradient(to right, #343434, #252525);
`

const DividerNS = (props) => {
    return <StyledDivider {...props}/>
}

export default  DividerNS
