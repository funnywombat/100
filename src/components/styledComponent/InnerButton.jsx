import styled from "styled-components";

const StyledInnerButton = styled.button`
    font-family: inherit;
    font-size: 18px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    background: ${({background}) => background || '#41A8DC'};
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    color: ${({color}) => color || '#fff'};
    border-radius: 10px;
    width: ${({width}) => width || '100%'};
    height: 40px;
    text-align: center;
    align-self: center;
    
    &:focus,
    &:hover {
        background: rgba(0,0,0,0);
        color: #3390EC;
        box-shadow: inset 0 0 0 1px #3390EC;
    }
`

const InnerButton = (props) => {

    return <StyledInnerButton {...props}/>
}

export default InnerButton