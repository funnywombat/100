import Text from "./styledComponent/Text"
import Flex from "./styledComponent/Flex"


const FaqTemplate = (props) => {
    
    return <Flex padding='10px 20px 10px 20px'>
        <Text>{props.text}</Text>
    </Flex>
}

export default FaqTemplate