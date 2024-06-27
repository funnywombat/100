import styled from "styled-components"
import { useSelector } from "react-redux"


const StyledCustomInput = styled.input`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: ${({width}) => width || '100%'};
    background-color: transparent;
    border: none;
    outline: none;
    color: #E4E4F0;
    text-align: ${props => props.textalign || 'center'};
    font-size: 1.25em;
    font-weight: 500;
    
    &::placeholder {
        text-align: ${props => props.textalign || 'start'};
        font-size: 1.25em;
    }
`

const CustomInput = (props) => {
    const theme = useSelector(state => state.order.theme)
    return <StyledCustomInput {...props} theme={theme} />
}

export default CustomInput