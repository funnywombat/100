import styled from 'styled-components'

const StyledInfoThumb = styled.div`
    display: block;
    width: ${({width}) => width || '100%'};
    height: auto;

`

const InfoThumb = (props) => {

    return <StyledInfoThumb {...props} />
}

export default InfoThumb