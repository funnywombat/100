import styled from "styled-components";

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    /* align-items: center;
    justify-content: space-between; */

`

const Container = (props) => {
    return <StyledContainer {...props} />
}

export default Container