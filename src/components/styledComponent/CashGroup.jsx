import styled from 'styled-components'
import { useSelector } from "react-redux"

const StyledGroup = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: ${props => (props.theme === true) ? '#ffffff' : '#1c1c1e'};
    width: 100%;   
    border-radius: 5px;
    margin-bottom: ${({mb}) => mb || '30px'};

`

const CashGroup = (props) => {
    
    const theme = useSelector(state => state.order.theme)

    return <StyledGroup {...props} theme={theme}/>
            
}

export default CashGroup

