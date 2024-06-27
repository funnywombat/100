import styled from "styled-components"

const StyledOrangeButton = styled.button`
    height: 42px;
    width: calc(100%/2 - 5px);
    background: linear-gradient(135deg, #DCBA41, #766423);
    color: #E4E4F0;
    border-radius: 12px;
    font-size: 1.25em;
    font-weight: 600;
    border: none;
`

const OrangeButton = (props) => {
    return <StyledOrangeButton {...props}/>
}

export default  OrangeButton