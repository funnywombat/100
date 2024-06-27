import styled from "styled-components";


const StyleDownTitle = styled.span`
    /* position: absolute; */
    display: flex;
    color: #8e8e8e;
    font-size: ${({fs}) => fs || '12px'};
    top: ${({pt}) => pt || '0px'};
    right: ${({pr}) => pr || '0px'};
    left: ${({pl}) => pl || '0px'};
    align-self: center;

`


const DownTitle = (props) => {

    return <StyleDownTitle {...props} />
}

export default DownTitle