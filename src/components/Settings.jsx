import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {addOrder, clearOrder, toggleIsSave} from '../store/orderSlice'
import {useNavigate} from 'react-router-dom'
import {useTelegram} from '../hooks/useTelegram'
import {getAllPairs, calculatePrice} from '../api/api'
import {changeIsLoaderVisible} from "../store/orderSlice"
import {translate} from "../translater/translater"
import {exchangeTypeNames, orderTypeNames, priceTypeNames} from "../common/enums"
import {sellBuyBtns} from "../common/buttonList"

import _map from 'lodash/map'
import _uniq from 'lodash/uniq'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _round from 'lodash/round'
import _isEmpty from 'lodash/isEmpty'

import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import GradientContainer from "./newStyledComponents/GradientContainer";
import ButtonGroup from "./newStyledComponents/ButtonGroup";
import DoubleMenuItem from "./newStyledComponents/DoubleMenuItem";
import MenuItemWithoutFocus from "./newStyledComponents/MenuItemWithoutFocus";
import MainGoldButton from "./newStyledComponents/MainGoldButton";
import DividerMiniNS from "./newStyledComponents/DividerMiniNS";
import Text from "./styledComponent/Text"
import CustomInput from './styledComponent/CustomInput'
import Flex from "./styledComponent/Flex"
import CustomForm from './styledComponent/CustomForm'
import CustomDropdown from './styledComponent/Dropdown'
import GroupLeftText from './styledComponent/GroupLeftText'
import Title from './styledComponent/Title'

import InputMask from 'react-input-mask';
import Notiflix from 'notiflix'
import styles from './styles.module.css'
import styled from "styled-components";
import Loader from "./Loader";
import ResponsiveContainer from "./styledComponent/ResponsiveContainer"

const Innercontainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #343434;
    // padding: 20px 0px 20px 20px;
    position: relative;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border: 2px solid #3F3F3F;
    box-shadow: 0 1px 7px 0 rgb(0 0 0 / 19%);
    margin-top: 12px;
    margin-right: -20px;
    overflow: hidden;
    border-right: none;
    margin-bottom: 12px;
    padding-bottom: 12px;
    &:before {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        z-index: -1;
        border-radius: 12px; /* Adjust border radius according to your preference */
        background: linear-gradient(90deg, #949494, #1A1A1A);
        border: none;
    }  
`
const DividerNS = styled.div`
    height: 4px;
    width: ${props => props.width || '100%'};
    background: linear-gradient(to right, #949494, #1A1A1A);
    margin-top: 12px;
    width: 87%;
    `

const Settings  = (props) => {

    let {tg} = useTelegram()
    let navigate = useNavigate()
    const dispatch = useDispatch()

    const isSaved = useSelector(state => state.order.isSaved)
    const savedOrder = useSelector(state => state.order.order)
    const theme = useSelector(state => state.order.theme)
    const lang = useSelector(state => state.order.lang)
    const {backButton} = useTelegram()

    const buyTitle = translate('0014', lang)
    const sellTitle = translate('0015', lang)
    const comissionTitle = translate('0021', lang)
    const giveTitle = translate('0023', lang)
    const getTitle = translate('0024', lang)

    const [operationType, setOperationType] = useState(orderTypeNames.buy)
    const [currency, setCurrency] = useState('USDT')
    const [fiatCurrency, setFiatCurrency] = useState('USD')
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [amount, setAmount] = useState(1000)
    const [calcAmount, setCalcAmount] = useState(977)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [transferNetwork, setTransferNetwork] = useState('TRC')
    const [wallet, setWallet] = useState('')
    const [allPairs, setAllPairs] = useState([])
    const [needCalculate, setNeedCalculate] = useState(false)

    const [course, setCourse] = useState(1)
    const [percentBuy, setPercentBuy] = useState(1)
    const [percentSell, setPercentSell] = useState(1)
    const [calcPrice, setCalcPrice] = useState(1)

    const [currentPair, setCurrentPair] = useState({})
    const [cryptoCurrencies, setCryptoCurrencies] = useState([])
    const [fiatCurrencies, setFiatCurrencies] = useState([])
    const [countries, setCountries] = useState([])
    const [cities, setCities] = useState([])
    const [networks, setNetworks] = useState([])
    const [placeholder, setPlaceholder] = useState('')
    const [clickeStatusdId, setClickedStatusId] = useState(0);
    const [clickedCrypto, setClickedCrypto] = useState(0)
    const isLoading = useSelector(state => state.order.isLoaderVisible)

    /*
    * Обработчик кнопки Назад
    **/
    useEffect(() => {
        backButton.show()
        backButton.onClick(() => {
            navigate('/')
        })
        return () => {
            backButton.offClick(() => {
                navigate('/')
            })
        }
    }, [backButton])




    if (isLoading) {
        return <Loader />
    }



    return <ResponsiveContainer direction="column" padding="50px 20px 20px 20px">


            <Flex align='center' justify='space-between'>
                <NSBackButton onClick={()=>navigate('/')}>{translate('0010', lang)}</NSBackButton>
                <NSHelpButton/>
            </Flex>

            <Title mt="20px" alignself="center">Взаимодействие</Title>

            <GradientContainer>
                <Title alignself="center">Актуальная информация:</Title>
            <Innercontainer>
                <Flex mt="12px" direction="column" align="flex-end">
                    <Text aligntext="start" style={{cursor:"pointer"}} ml="60px" onClick={() => window.open("https://t.me/pros100k/398")}>Актуальные курсы</Text>

                <DividerNS/>

                </Flex>

                <Flex mt="24px" direction="column" align="flex-end">
                    <Text ml="60px" aligntext="start" style={{cursor:"pointer"}} width="100%" onClick={() => window.open("https://t.me/pros100k/399")}>Список касс</Text>
                    <DividerNS/>
                </Flex>

                <Flex mt="24px" direction="column" align="flex-end">
                    <Text ml="60px" aligntext="start" style={{cursor:"pointer"}} width="100%" onClick={() => window.open("https://t.me/pros100k/382")}>В следующем обновлении</Text>
                </Flex>
            </Innercontainer>

            </GradientContainer>

            <GradientContainer>
                <Title alignself="center">Узнать больше:</Title>
            <Innercontainer>
                <Flex mt="12px" direction="column" align="flex-end">
                    <Text ml="60px" aligntext="start" style={{cursor:"pointer"}} width="100%" onClick={() => window.open("https://t.me/pros100k")}>Новости PRO100K</Text>

                <DividerNS/>

                </Flex>

                <Flex mt="24px" direction="column" align="flex-end">
                    <Text ml="60px" aligntext="start" style={{cursor:"pointer"}} width="100%" onClick={() => window.open("https://www.instagram.com/pros100k_ie?igsh=MWZ4enNtZmdvcWltMQ%3D%3D&utm_source=qr")}>Instagram PROS100K</Text>
                    <DividerNS/>
                </Flex>

                <Flex mt="24px" direction="column" align="flex-end">
                    <Text ml="60px" aligntext="start" style={{cursor:"pointer"}} width="100%" onClick={() => window.open("https://x.com/pros100k?s=21")}>X Twitter PROS100K</Text>
                </Flex>
            </Innercontainer>

            </GradientContainer>

            <GradientContainer>
                <Title alignself="center">Возникли сложности? Обратитесь к нам, используя любой из следующих способов связи!</Title>
            <Innercontainer>
                <Flex mt="12px" direction="column" align="flex-end">
                    <Text ml="60px" aligntext="start" style={{cursor:"pointer"}} width="100%" onClick={() => window.open("https://t.me/PROS100K_support")}>Telegram Support</Text>

                <DividerNS/>

                </Flex>

                <Flex mt="24px" direction="column" align="flex-end">
                    <Text ml="60px" aligntext="start" style={{cursor:"pointer"}} width="100%" onClick={()=> navigate("/FAQ")}>Вопрос/ответ</Text>
                </Flex>

                
            </Innercontainer>

            <Title mt="12px" alignself="center">Предложения и пожелания:</Title>

            <Innercontainer>
                <Flex mt="12px" direction="column" align="flex-end">
                    <Text ml="60px" aligntext="start" style={{cursor:"pointer"}} width="100%">Оставить отзыв</Text>

                <DividerNS/>

                </Flex>

                <Flex mt="24px" direction="column" align="flex-end">
                    <Text ml="60px" aligntext="start" style={{cursor:"pointer"}} width="100%">Написать @-mail</Text>
                </Flex>

                
            </Innercontainer>

            </GradientContainer>
    </ResponsiveContainer>

}

export default Settings