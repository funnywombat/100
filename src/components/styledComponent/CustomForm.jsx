import styled from 'styled-components'


const StyledForm = styled.form`
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    scroll-behavior: smooth;
`

const CustomForm = (props) => {
    return <StyledForm {...props} />

}


export default CustomForm


