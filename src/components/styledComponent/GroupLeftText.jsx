import styled from "styled-components"
import { useSelector } from "react-redux"

const StyledGroupLeftText = styled.div`
    font-family: "Montserrat", sans-serif;
    color: #E4E4F0;
    font-size: 1.3em;
    font-weight: 400;
`

const GroupLeftText = (props) => {

    const theme = useSelector(state => state.order.theme)

    return <StyledGroupLeftText {...props} theme={theme}/>
}

export default GroupLeftText