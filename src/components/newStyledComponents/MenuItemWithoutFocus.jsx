import styled from "styled-components"

const StyledMenuItem = styled.div`
    display: flex;
    flex-direction: ${props => props.direction || 'row'};
    align-items: center;
    justify-content: ${props => props.justify || 'space-between'};
    border-radius: 12px;
    border: 2px solid #3F3F3F;
    padding: 14px 17px;
    background-color: #1C1C1E;
    height: ${props => props.height || 'auto'};
    width: 100%;
    margin-bottom: ${props => props.mb || '10px'};
    margin-top: ${props => props.mt || '0px'};

    & svg {
        fill: #7A7A7A;
    }
`

const MenuItemWithoutFocus = (props) => {
    return <StyledMenuItem {...props}/>
}

export default  MenuItemWithoutFocus