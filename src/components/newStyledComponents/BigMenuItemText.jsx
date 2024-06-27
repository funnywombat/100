import styled from "styled-components"

const StyledMenuItemText = styled.span`
    display: flex;
    font-family: inherit;
    font-size: 22px;
    color: #E4E4F0;
    max-width: 50px;    
    text-align: center;
`

export default function BigMenuItemText(props) {
    return <StyledMenuItemText {...props}/>
}