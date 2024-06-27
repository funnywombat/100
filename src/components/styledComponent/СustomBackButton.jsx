import styled from "styled-components";
import { useSelector } from "react-redux"


const StyledBackButton = styled.button`
    
    position: absolute;
    top: ${props => props.top || '9px'};
    left: ${props => props.left || '20px'};

    font-size: 14px;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    outline: none;
    padding: 2px 4px 2px 4px;
    border-radius: 5px;

    background: #41A8DC;
    color: #ffffff;
    cursor: pointer;

`


const CustomBackButton = (props) => {
    const theme = useSelector(state => state.order.theme)
    return <StyledBackButton {...props} theme={theme}/>
}


export default CustomBackButton