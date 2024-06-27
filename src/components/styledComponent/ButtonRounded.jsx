import styled from "styled-components";

const StyledButton = styled.button`
    font-family: inherit;
    font-size: 18px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    background: ${({bg}) => bg || `linear-gradient(135deg, #DCBA41, #766423)`};
    color: ${({color}) => color || '#E4E4F0'};
    border-radius: 10px;
    width: ${({width}) => width || '100%'};
    height: 60px;
    margin-bottom: ${({mt}) => mt || '15px'};
    margin-top: ${({mt}) => mt || '0px'};
    text-align: center;
    //&:focus,
    //&:hover {
    //    color: #3390EC;
    //    box-shadow: inset 0 0 0 1px #3390EC;
    //}
`

const ButtonRounded = (props) => {

    return <StyledButton {...props}/>
}

export default ButtonRounded