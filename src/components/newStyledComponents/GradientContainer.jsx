import styled from "styled-components";

const StyledBorder = styled.div`
    display: flex;
    flex-direction: column;
    -webkit-flex-wrap: nowrap;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    border-radius: 12px;
    background-color: #1C1C1E;
    box-shadow: 0 1px 7px 0 rgb(0 0 0 / 19%);
    transition: display 0.4s ease-in-out;
    border: none;
    margin-top: 1em;
    position: relative;
    height: ${props => props.height || 'auto'};
    width: 100%;
    padding: ${props => props.padding || '20px 20px 20px 20px'};
    margin-bottom: ${props => props.mb || '10px'};
    
    
    &:before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        z-index: -1;
        border-radius: 12px; /* Adjust border radius according to your preference */
        background: linear-gradient(90deg, #949494, #1A1A1A);
        border: none;
    }
`

const GradientContainer = (props) => {
    return <StyledBorder {...props} />
}

export default  GradientContainer