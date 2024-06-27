import { TailSpin } from "react-loader-spinner"
import { useSelector } from "react-redux"
import styled from "styled-components"


const StyledLoaderWrapper = styled.div`
    height: 100%;
    margin-top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    z-index: 4;

    width: 100%;
`

const Loader = (props) => {

    let isLoaderVisible = useSelector(state => state.order.isLoaderVisible)

    return <StyledLoaderWrapper> 
        <TailSpin
            visible={isLoaderVisible}
            height="80"
            width="80"
            color="#F6BB0D"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
        />
    </StyledLoaderWrapper>
}


export default Loader