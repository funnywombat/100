import styled from "styled-components";


const StyledButtonToMain = styled.button`
    
    color: #ffffff;
    background: #41A8DC;
    border: none;
    padding: 2px 4px 2px 4px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    align-self: start;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 10px;

    margin-top: 10px;
    margin-left: 20px;
`


const ButtonToMain = (props) => {
    return <StyledButtonToMain {...props} />
}

export default ButtonToMain