import styled from "styled-components"

const StyledMenuItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 12px;
    border: 2px solid #3F3F3F;
    padding: 25px 20px;
    background-color: #1C1C1E;
    height: 72px;
    width: 400px;
    margin-bottom: 10px;

    &:focus,
    &:hover {
        border: 2px solid #F6BB0D;
    }

    & svg {
        fill: #7A7A7A;
    }

    &:hover svg {
        fill: #F6BB0D;
    }
`

const BigMenuItem = (props) => {
    return <StyledMenuItem {...props}/>
}

export default  BigMenuItem