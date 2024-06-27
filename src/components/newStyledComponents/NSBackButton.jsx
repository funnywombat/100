import styled from "styled-components"
import {ReactComponent as Arrow} from '../../images/newStyle/leftArrow.svg'


const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 17px;
    align-items: center;
`


const StyledOrangeButton = styled.span`
    font-size: 18px;
    font-weight: 600;
    background: linear-gradient(90deg, #D2AC36, #B87333);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: table;
    cursor: pointer;
`

const NSBackButton = (props) => {
    return <ButtonContainer>
        <Arrow />
        <StyledOrangeButton {...props}/>
    </ButtonContainer>
}

export default  NSBackButton