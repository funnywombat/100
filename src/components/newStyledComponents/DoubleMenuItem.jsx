import styled from "styled-components"
import Text from "../styledComponent/Text"
import DividerMiniNS from "./DividerMiniNS";
import Flex from "../styledComponent/Flex";

const StyledDoubleMenuItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-radius: 12px;
    border: 2px solid #3F3F3F;
    padding: 12px 9px;
    height: 140px;
    width: calc(50% - 10px);
    background-color: #1C1C1E;
`

const DoubleMenuItem = (props) => {
    return <StyledDoubleMenuItem {...props}>
        <Text width='100%' align='center'>{props.text1}</Text>
        <Flex mt='14px' mb="14px">
            <DividerMiniNS />
        </Flex>
        <div style={{display: "flex", alignItems: "center", justifyContent:"center"}}>
        <Text width='100%' justify='center' align='center'>{props.text2}</Text> 
        </div>
        
    </StyledDoubleMenuItem>
}

export default DoubleMenuItem