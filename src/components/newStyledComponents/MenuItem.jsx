import styled from "styled-components"

const StyledMenuItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 12px;
    border: 2px solid #3F3F3F;
    padding: 28px 35px;
    background-color: #1C1C1E;
    height: ${props => props.height || '60px'};
    width: ${props => props.width || '100%'};
    margin-bottom: ${props => props.mb || '14px'};
    margin-top: ${({mt}) => mt || '0px'};

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

const NewMenuItem = (props) => {
    return <StyledMenuItem {...props}/>
}

export default  NewMenuItem