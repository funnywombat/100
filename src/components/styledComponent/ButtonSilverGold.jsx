import styled from "styled-components"

const StyledButtonSilverGold = styled.button`
    font-family: inherit;
    font-size: 18px;
    font-weight: 500;
    border: 2px solid #fff;
    border-image: linear-gradient(45deg, #9C9C9C, #818181, #E1E1E1, #A5A5A5, #808080) 1;
    cursor: pointer;
    background: linear-gradient(45deg, #CFA247, #EDC962);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    color: ${({color}) => color || '#fff'};
    width: ${({width}) => width || '100%'};
    height: 40px;
    text-align: center;
    &:focus,
    &:hover {
        color: #3390EC;
        box-shadow: inset 0 0 0 1px #3390EC;
    }
`

export default function ButtonSilverGold(props) {
    return <StyledButtonSilverGold {...props}/>
}