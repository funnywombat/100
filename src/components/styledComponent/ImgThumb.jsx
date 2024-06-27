import styled from 'styled-components'

const StyledImgThumb = styled.div`
    display: block;
    width: ${({width}) => width || '100%'};
    height: auto;

`

const ImgThumb = (props) => {

    return <StyledImgThumb {...props} />
}

export default ImgThumb