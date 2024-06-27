import styled from 'styled-components'

const StyledLineLong = styled.div`
    display: block;
    width: 100%;
    border-bottom: 2px solid #E1E0E6;
    opacity: 0.3;
`



const LineLong = (props) => {
    return <StyledLineLong {...props}/>
}

export default LineLong