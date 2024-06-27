import styled from "styled-components"

const StyledMainGreyButton = styled.button`
    position: fixed;
    bottom: 0;
    left: 0;
    width: ${props => props.width || '100%'};
    text-align: center;
    color: #E4E4F0;
    font-size: 20px;
    border: none;
    height: 60px;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    background: #1C1C1E;
`

const MainGreyButton = (props) => {
    return  <StyledMainGreyButton {...props}/>
}

export default  MainGreyButton