import styled from "styled-components";

const StyledItem = styled.div`
    display: flex;
    justify-content: center;
    border: 2px solid #F6BB0D;
    font-size: 18px;
    padding: 4px 8px;
    background-color: #1C1C1E;
    border-radius: 12px;
    align-items: center;
    color: #E4E4F0;
    width: calc(50% - 20px);
`

const GradientMenuItem = (props) => {
    return <StyledItem {...props}/>
}

export default  GradientMenuItem