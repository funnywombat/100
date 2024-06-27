import styled from 'styled-components'

const StyledQRCodeThumb = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding-top: 30px;
    padding: 30px;
    background-color: #1c1c1e;
    border-radius: 20px;
    margin-bottom: 10px;

`

const QRCodeThumb = (props) => {

    return <StyledQRCodeThumb {...props} />
}

export default QRCodeThumb