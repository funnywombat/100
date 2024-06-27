import Text from "./styledComponent/Text"
import styled from "styled-components"
import InnerButton from "./styledComponent/InnerButton"
import { useNavigate } from "react-router"



const StyledBeSoon = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 25px;
    height: 100vh;

    & img {
        height: 330px;
    }
`

const BeSoon = (props) => {

    const navigate = useNavigate()

    return <StyledBeSoon {...props}>

        <Text style={{alignSelf: 'center'}} size='19px'>Cтраница находится в разработке...</Text>
        <InnerButton  type='button' onClick={() => navigate('/')} width='40%'>На главную</InnerButton>
    </StyledBeSoon>
}

export default BeSoon