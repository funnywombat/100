import styled from "styled-components"

const StyledRadioButtonGroup = styled.span`
    display: flex;
    align-items: center;
    justify-content: space-around;
    min-height: 65px;
    width: 100%;
    border-radius: 12px;
    background-color: #1C1C1E;
    border: 2px solid #3F3F3F;
    
    & .active {
        background: linear-gradient(45deg, #DCBA41, #766423);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        border: none;
        font-size: 16px;
    }
    
    & .radioBtn {
        background-color: transparent;
        border: none;
        font-size: 16px;
        color: #E4E4F0;
    }
`

export default function RadioButtonGroup(props) {
    return <StyledRadioButtonGroup {...props}/>
}