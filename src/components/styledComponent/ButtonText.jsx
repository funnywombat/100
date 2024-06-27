import styled from "styled-components";


const StyledButton = styled.button`
    
    color: #8e8e8e;
    background: transparent;
    align-self: center;
    border: 0;
    font-size: 15px;
    font-weight: 400;
    margin-bottom: 5px;
`


const ButtonText = (props) => {
    return <StyledButton {...props} />
}

export default ButtonText