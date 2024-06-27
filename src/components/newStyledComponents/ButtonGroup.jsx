import styled from "styled-components"

const StyledRadioButtonGroup = styled.span`
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-around;
    min-height: 30px;
    width: 100%;
    
    
    & .active {
        display: flex;
        justify-content: center;
        border: 2px solid #F6BB0D;
        font-size: 18px;
        padding: 7px 20px;
        background-color: #1C1C1E;
        border-radius: 12px;
        align-items: center;
        height: 40px;
        color: #E4E4F0;
        width: calc(50% - 3px);
    }
    
    & .radioBtn {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        font-size: 18px;
        padding: 7px 20px;
        height: 40px;
        border: 2px solid #3F3F3F;
        background-color: #1C1C1E;
        color: #E4E4F0;
        width: calc(50% - 5px);
    }
`

export default function ButtonGroup(props) {
    return <StyledRadioButtonGroup {...props}/>
}