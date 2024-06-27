import styled from "styled-components"
import Text from "../styledComponent/Text"

const StyledDoubleMenuItem = styled.div`
    display: flex;
    flex-direction: row;
    width: max-content;
    gap: 8px;
    border-radius: 12px;
    border: 2px solid #3F3F3F;
    padding: 4px 8px;
    background-color: #1C1C1E;
    
    &:first-child {
        border-right: 4px solid #3F3F3F;
        margin-left: 6px;
    }
`



const DoubleMenuItemHorizontal = (props) => {
    return <StyledDoubleMenuItem {...props}>
        <Text>{props.text1}</Text>
        <Text color='#3F3F3F'>|</Text>
        <Text>{props.text2}</Text>
    </StyledDoubleMenuItem>
}

export default  DoubleMenuItemHorizontal