import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";


const StyledLink = styled(NavLink)`
    
    color: #fff;
    align-self: end;
    padding: 2px 4px 2px 4px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    font-size: 14px;
    font-weight: 400;
    border-radius: 5px;
    background: ${props => props.bgColor || '#41A8DC'}

`


const TextButtonLink = (props) => {
    const theme = useSelector(state => state.order.theme)

    return <StyledLink {...props} theme={theme} />
}

export default TextButtonLink