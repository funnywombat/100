import styled from "styled-components"
import {ReactComponent as Filter} from '../../images/newStyle/NSFilter.svg'


const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 17px;
`


const StyledOrangeButton = styled.span`
    font-size: 1.125em;
    font-weight: 600;
    background: linear-gradient(90deg, #D2AC36, #B87333);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: table;
    cursor: pointer;
`

const NSFilterButton = (props) => {
    return <ButtonContainer>
        <StyledOrangeButton {...props}/>
        <Filter />
    </ButtonContainer>
}

export default  NSFilterButton