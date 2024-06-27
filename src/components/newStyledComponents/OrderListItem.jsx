import styled from "styled-components";
import GradientContainer from "./GradientContainer";
import Text from "../styledComponent/Text"
import Flex from "../styledComponent/Flex";
import {ReactComponent as Cash} from '../../images/newStyle/cash.svg'
import {ReactComponent as Bank} from '../../images/newStyle/bank.svg'
import {ReactComponent as Transfer} from '../../images/newStyle/transfer.svg'
import {NavLink} from "react-router-dom";
import StatusText from "../styledComponent/StatusText";

const StyledItem = styled.div`
    display: flex;  
    align-items: center;
    justify-content: space-between;
    position: relative;
    border: none;


    & svg {
        fill: #7A7A7A;
    }
`

const OrderListItem = (props) => {
    return <GradientContainer padding='10px 24px'>
        <NavLink to={`/order/${props.orderId}`}>
            <StyledItem>

                <Flex direction='column' align='flex-start'>
                    <Text aligntext='start'>{props.orderType}</Text>
                    <Text aligntext='start' size='15px'>{props.date}</Text>
                </Flex>

                <Flex direction='column' align='center'>
                    <Text aligntext='center'>{props.amount + " " + props.currency}</Text>
                    <StatusText size='14px' status={props.status}>{props.status}</StatusText>
                </Flex>

                <Flex justify='flex-end'>
                    {
                        props.exchangeType === "CASH" && <Cash/>
                    }

                    {
                        props.exchangeType === "BANKING" && <Bank/>
                    }

                    {
                        props.exchangeType === "TRANSFER" && <Transfer/>
                    }
                </Flex>


            </StyledItem>
        </NavLink>
    </GradientContainer>
}

export default OrderListItem