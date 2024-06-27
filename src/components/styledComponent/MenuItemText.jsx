import styled from "styled-components"

const StyledMenuItemText = styled.span`
    position: absolute;
    font-family: inherit;
    font-size: 1.25em;
    color: #E4E4F0;;
`

export default function MenuItemText(props) {
    return <StyledMenuItemText {...props}/>
}