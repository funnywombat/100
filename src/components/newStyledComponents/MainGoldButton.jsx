import styled from "styled-components"

const StyledMainGoldButton = styled.button`

    position: fixed;
    bottom: 0;
    right: 0;
    width: ${props => props.width || '100%'};
    text-align: center;
    color: #E4E4F0;
    font-size: 18px;
    border: none;
    height: 60px;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    background: linear-gradient(135deg, #DCBA41, #766423);
`

const MainGoldButton = (props) => {
    return  <StyledMainGoldButton {...props}/>
}

export default  MainGoldButton