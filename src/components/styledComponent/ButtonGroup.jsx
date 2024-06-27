import styled from "styled-components"
import { useSelector } from "react-redux"

const StyledButtonGroup = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 40px;
    width: 100%;
    border: none;
    border-radius: 15px;
    background: ${props => props.theme === true ? '#ffffff' : '#1c1c1e'};
    margin-bottom: ${props => props.mb || '0px'};
    max-height: ${props => props.iscollapse ? 'auto' : '310px'};
    overflow: hidden;
`

const ButtonGroup = (props) => {

    const theme = useSelector(state => state.order.theme)

    return <StyledButtonGroup {...props} theme={theme}/>
}

export default ButtonGroup