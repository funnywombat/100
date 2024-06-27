import styled from "styled-components"
import Text from "../styledComponent/Text"

const StyledMenuItem = styled.div`
    display: flex;
    flex-direction: ${props => props.direction || 'row'};
    align-items: center;
    justify-content: ${props => props.justify || 'space-between'};
    border-radius: 12px;
    border: 2px solid #3F3F3F;
    padding: 6px 22px;
    background-color: #1C1C1E;
    width: max-content;

    & svg {
        fill: #7A7A7A;
    }
`

const MenuItemShort = (props) => {
    return <StyledMenuItem {...props}>
        <Text>{props.text}</Text>
    </StyledMenuItem>
}

export default  MenuItemShort