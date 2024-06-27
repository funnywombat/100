import styled from "styled-components"
import { useSelector } from "react-redux"

const StyledTextArea = styled.textarea`
    background: transparent;
    text-align: ${({align}) => align || 'center'};
    border: none;
    border-radius: 4px;
    margin-top: ${props => props.mt || '20px'};
    margin-bottom: ${props => props.mb || '10px'};
    margin-left: ${props => props.ml || '0px'};
    resize: none;
    height: max-content;
    color: ${props => props.color || "#E4E4F0"};
    overflow-y: hidden;
    width: 100%;
    font-size: 1.25em;
`


const CustomTextArea = (props) => {
    const theme = useSelector(state => state.order.theme)

    return <StyledTextArea {...props} theme={theme} readOnly/>
}


export default CustomTextArea