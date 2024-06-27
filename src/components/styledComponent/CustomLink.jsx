import styled from "styled-components"
import { Link } from "react-router-dom"

const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    background: #41A8DC;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    width: ${({width}) => width || '100%'};
    height: 40px;
    color: #fff;
    &:focus,
    &:hover {
        background: rgba(0,0,0,0);
        color: #3390EC;
        box-shadow: inset 0 0 0 3px #3390EC;
    }
`

const CustomLink = (props) => {
    return <StyledLink {...props} />
}


export default CustomLink