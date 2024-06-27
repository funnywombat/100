import styled from "styled-components"
import { useSelector } from "react-redux"

const StyledGroupRightText = styled.span`
    display: flex;
    justify-content: flex-end;
    width: max-content;
    color: #E4E4F0;
    font-size: 1.2em;
    font-weight: 400;
`

const GroupRightText = (props) => {

    const theme = useSelector(state => state.order.theme)

    return <StyledGroupRightText {...props} theme={theme}/>
}

export default GroupRightText