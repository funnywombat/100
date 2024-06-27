import styled from "styled-components"

const StyledTextGold = styled.h1`
    font-size: ${props => props.size || '50px'};
    font-weight: 600;
    line-height: 1;
    background: linear-gradient(45deg, #DCBA41, #766423);
    align-self: center;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: ${props => props.ml || "0px"};
`

export default function GoldText(rest) {
    return <StyledTextGold {...rest}/>
}