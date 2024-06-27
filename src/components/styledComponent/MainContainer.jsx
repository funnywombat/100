import styled from 'styled-components'

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 15px;
    padding-right: 15px;
`



const MainContainer = (props) => {
    return <StyledContainer {...props}/>
}

export default MainContainer