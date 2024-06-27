import styled from "styled-components";
import GradientContainer from "./newStyledComponents/GradientContainer";
import Text from "./styledComponent/Text"
import Flex from "./styledComponent/Flex";
import GoldTextNS from "./newStyledComponents/GoldText";
import {ReactComponent as Star} from "../images/newStyle/star.svg"
import {ReactComponent as Channel} from "../images/newStyle/channel.svg"
import {useRef} from "react";
import {useNavigate} from "react-router-dom";

const ModalWrapper = styled.div`
    position: absolute;
    height: 70%;
    width: 100%;
    padding: 60px;
    z-index: 999;
    
    & .wrap {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }
    
    .starList {
        display: flex;
    }
    
    
    
    & .star {
        margin-right: 10px;
        
        &:hover {
            fill: #F6BB0D;
        }
    }

    & .active {
        fill: #F6BB0D;
    }



    & .star:last-child {
        margin-right: -10px;
    }
`


const SuccessModal = ({orderId}) => {

    const navigate = useNavigate()

    const toggleIsActive = (e) => {

        let curItem = e.target
        curItem.classList.add("active")

        navigate("/")

    }


    return <ModalWrapper >
        <GradientContainer className='wrap'>

            <Flex direction='column' align='center' justify='center'>
                <Text>Ваш ордер №{orderId}</Text>
                <Text>успешно выполнен!</Text>
            </Flex>

            <Flex direction='column' align='center' justify='center'>
                <Text>
                    Оцените нашу работу!
                </Text>

                <Flex mt='10px'>
                    <Star onClick={e => toggleIsActive(e)} height='44' width='44' className='star'  />
                    <Star onClick={e => toggleIsActive(e)} height='44' width='44' className='star'  />
                    <Star onClick={e => toggleIsActive(e)} height='44' width='44' className='star'  />
                    <Star onClick={e => toggleIsActive(e)} height='44' width='44' className='star'  />
                    <Star onClick={e => toggleIsActive(e)} height='44' width='44' className='star'  />
                </Flex>

            </Flex>



            <Text>
                Следите за нами в наших каналах!
            </Text>

            <Flex style={{gap: "10px"}}>
                <Channel height='44' width='44' fill='#343434' />
                <Channel height='44' width='44' fill='#343434' />
                <Channel height='44' width='44' fill='#343434' />
                <Channel height='44' width='44' fill='#343434' />

            </Flex>


            <Flex direction='column' align='center' justify='center'>
                <Text width='100%'>Нужна помощь или есть дополнительные вопросы?</Text>
                <Text onClick={() => window.open("https://t.me/PROS100K_support")} mt='20px' color='#F6BB0D' size='18px'>Свяжитесь с нами</Text>
            </Flex>



        </GradientContainer>
    </ModalWrapper>
}

export default  SuccessModal