import styled from "styled-components";

const StyledButton = styled.button`
    font-family: inherit;
    font-size: 20px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    background: ${({background}) => background || '#41A8DC'};
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    color: ${({color}) => color || '#fff'};
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    width: ${({width}) => width || '100%'};
    height: 40px;
    text-align: center;
    align-self: end;
    &:focus,
    &:hover {
        background: ${props => props.disabled ? 'grey' : 'rgba(0,0,0,0)'};
        color: ${props => props.disabled ? '#fff' : '#3390EC'}; 
        box-shadow: ${props => props.disabled ? 'none' : 'inset 0 0 0 1px #3390EC'};
    }
`

const DefaultButton = (props) => {

    return <StyledButton {...props}/>
}

export default DefaultButton