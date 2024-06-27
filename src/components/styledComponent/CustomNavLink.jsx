import styled from "styled-components"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"


const StyledLink = styled(NavLink)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${props => props.theme === true ? '#000000' : '#ffffff'};
    border: none;
    height: auto;
    width: 100%;
    
    cursor: pointer;

    //&:focus,
    //&:hover {
    //    border: 2px solid #F6BB0D;
    //}

    & svg {
        fill: #7A7A7A;
    }

    //&:hover svg {
    //    fill: #F6BB0D;
    //}



    &::before {
        position: absolute;
        content: ' ';
        height: 100%;
        width: 100%;

        top: 0;
        left: -100%;
        opacity: .2;
        transition: .2s;
    }

    &:focus::before {
        left: 0;
    }
    
`

const CustomNavLink = (props) => {

    const theme = useSelector(state => state.order.theme)

    return <StyledLink {...props} theme={theme}/>
}

export default CustomNavLink