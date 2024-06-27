import styled from "styled-components";

const StyledButtonSwiper = styled.div`
    display: flex;
    flex-direction: row;
    border-radius: 12px;
    border: 2px solid #3F3F3F;
    width: 120px;
    overflow-x: auto;
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    gap: 20px;
    
    &::-webkit-scrollbar {
        background-color: transparent;
    }


    
    & .cryptoBtn {
        display: flex;
        padding-left: 10px;
        padding-right: 10px;
        background-color: #1C1C1E;
        color: #E4E4F0;
        width: 120px;
        border: none;
        font-size: 18px;
    }

    & .active {
        
        font-size: 18px;
        border: none;
        background: linear-gradient(90deg, #DCBA41, #766423);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: table;
    }
`

const ButtonSwiper = (props) => {
    return <StyledButtonSwiper {...props} />

}

export default  ButtonSwiper