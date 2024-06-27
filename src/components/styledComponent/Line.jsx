import styled from 'styled-components'

const StyledLineLong = styled.div`
    display: block;
    width: 78%;
    border-bottom: 2px solid #E1E0E6;
    opacity: 0.3;
    align-self: end; 
`



const Line = (props) => {
    return <StyledLineLong {...props}/>
}

export default Line