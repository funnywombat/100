import React, {useState} from "react"
import {useTelegram} from '../hooks/useTelegram'
import {useEffect} from "react"
import {useSearchParams, useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"

import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import 'swiper/css/effect-fade';
import styles from './styles.module.css'

import {FreeMode} from 'swiper/modules';

import NewMenuItem from "./newStyledComponents/MenuItem"
import Title from "./styledComponent/Title"
import Thumb from "./styledComponent/Thumb"
import Text from "./styledComponent/Text"
import CustomNavLink from "./styledComponent/CustomNavLink"
import MenuItemText from "./styledComponent/MenuItemText"

import Notiflix from "notiflix"
import _round from "lodash/round"
import _isEmpty from 'lodash/isEmpty'
import {translate} from "../translater/translater"

import {ReactComponent as Cash} from '../images/newStyle/cash.svg'
import {ReactComponent as Bank} from '../images/newStyle/bank.svg' 
import {ReactComponent as Transfer} from '../images/newStyle/transfer.svg'
import {ReactComponent as OrderHistory} from "../images/newStyle/orderHistory.svg"
import {ReactComponent as RefBonus} from "../images/newStyle/refBonus.svg"
import {ReactComponent as AccumBonus} from "../images/newStyle/accumBonus.svg"
import {ReactComponent as MainBlackTitle} from '../images/newStyle/BlackTitle.svg'
import {ReactComponent as Banner1} from '../images/newStyle/Banner1.svg'
import {ReactComponent as Banner2} from '../images/newStyle/Banner2.svg'

import OrangeButton from "./newStyledComponents/OrangeButton"
import DividerNS from "./newStyledComponents/DividerNS";
import ResponsiveContainer from './styledComponent/ResponsiveContainer'


const Main = (props) => {

    const navigate = useNavigate()
    const lang = useSelector(state => state.order.lang)

    const {backButton, settings_button, initData, tg, startParam} = useTelegram()
    const [searchParams, setSearchParams] = useSearchParams()
    const [slogan, setSlogan] = useState("")

    useEffect(() => {
        let orderId = searchParams.get('order')
        let paymentOrderId = searchParams.get('payment')
        let newOrder = searchParams.get('new_order')
        let paymentBuy = searchParams.get('payment_buy')
        let faq = searchParams.get('FAQ')

        if (orderId) {
            navigate(`/order/${orderId}`)
        }

        if (paymentBuy) {
            navigate(`/payment_buy/${paymentBuy}`)
        }

        if (paymentOrderId) {
            navigate(`/payment/${paymentOrderId}`)
        }

        if (newOrder) {
            navigate(`/form`)
        }

        if (faq) {
            navigate(`/faq`)
        }

    }, [])


    useEffect(() => {
        console.log(settings_button)
        if (props.order && !_isEmpty(props.order)) {
            props.setOrder({})
        }
    }, [props.order])

    useEffect(() => {
        settings_button.show()
        settings_button.onClick(()=>{navigate("/settings")})
    }, [settings_button])



    function random(min, max) {
        return min + Math.random() * (max - min);
    }

    function setTriggerText() {
        const triggers = [
            "Моментальная выгода",
            "Сделаем за вас",
            "Взаимная благодарность",
            "Свежие веяния",
            "Быстрая выгода",
            "Дарим эксклюзив",
            "Дарим новинку",
            "Взаимодействие эволюционирует"
        ]

        let index = _round(random(0, 7), 0);
        setSlogan(triggers[index])
    }

    useEffect(() => {
        setTriggerText()
    }, [])

    useEffect(() => {
        if (backButton) {
            backButton.hide()
        }
    }, [backButton])

    useEffect(() => {
        if (startParam) {
            Notiflix.Notify.success("Приветствуем! Вы были приглашены по реферальной ссылке")
        }
    }, [startParam])


    return <ResponsiveContainer direction="column" padding="60px 20px 20px 20px" style={{position: 'relative'}}>

        {/* <Thumb style={{padding: "0px 15px"}} justify='center' align='center'>
            <img src={Logo} alt='logo'/>
        </Thumb> */}
        {/* <MainLogoTitle/> */}
        <Thumb justify='center' align='center'>
        <MainBlackTitle width={"100%"}/>
        
        </Thumb>

        <Thumb justify='center' align='center' mt='34px' mb='34px'>
            <Text>{slogan && slogan}</Text>
        </Thumb>

        <Title mb='14px' style={{width: '100%'}}>
            {translate('0004', lang)}
        </Title>

        <NewMenuItem onClick={() => navigate('form')}>
            <CustomNavLink to={'form'}>
                <MenuItemText>{translate('0001', lang)}</MenuItemText>
            </CustomNavLink>
            <Cash height='44' width='44'/>
        </NewMenuItem>

        <NewMenuItem onClick={() => navigate('formByCard')}>
            <CustomNavLink to={'formByCard'}>
                <MenuItemText>{translate('0002', lang)}</MenuItemText>
            </CustomNavLink>
            <Bank height='44' width='44'/>
        </NewMenuItem>

        <NewMenuItem onClick={() => navigate('permutations')} mb='34px'>
            <CustomNavLink to={'permutations'}>
                <MenuItemText>{translate('0003', lang)}</MenuItemText>
            </CustomNavLink>
            <Transfer height='44' width='44'/>
        </NewMenuItem>

        <Swiper
            className={styles.swiper}
            slidesPerView={1.3}
            spaceBetween={30}
            freeMode={true}
            modules={[FreeMode]}
        >
            <SwiperSlide className={styles.swiperBanner} onClick={()=> navigate("/settings")}>
                {/* <img height={"100%"} width={"100%"} src={banner1} alt='baner1'/> */}
                <Banner1 height={"100%"}/>
            </SwiperSlide>

            <SwiperSlide className={styles.swiperBanner} onClick={() => window.open("https://t.me/pros100k")}>
                {/* <img height={"100%"} width={"100%"} src={banner2} alt='baner1'/> */}
                <Banner2  height={"100%"}/>
            </SwiperSlide>
        </Swiper>

        <Title mb='14px' mt='24px' onClick={()=> navigate("/settings")}>
            Взаимодействие
        </Title>

        <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>

                <OrangeButton onClick={() => window.open("https://t.me/PROS100K_support")}>
                    <CustomNavLink to={"https://t.me/PROS100K_support"}>
                    </CustomNavLink>
                    Поддержка

                </OrangeButton>
            <OrangeButton onClick={() => navigate('/faq')}>
                F.A.Q.
            </OrangeButton>
        </div>

        <Title mb='7px' mt='24px'>
            Откройте для себя
        </Title>

        <Swiper
            className={styles.swiper}
            slidesPerView={1.3}
            spaceBetween={30}
            freeMode={true}
            modules={[FreeMode]}
        >
            <SwiperSlide className={styles.swiperSlide} onClick={() => navigate("/loyalty")}>
                Поощрение лояльности
                <RefBonus height='44' width='44 '/>
            </SwiperSlide>

            <SwiperSlide className={styles.swiperSlide} onClick={() => navigate("/loyalty")}>
                Дарим благодарность
                <AccumBonus height='44' width='44'/>
            </SwiperSlide>
        </Swiper>

        <DividerNS/>

        <NewMenuItem onClick={() => navigate('orderList')} mt='30px'>
            <CustomNavLink to={'orderList'}>
                <MenuItemText>История ордеров</MenuItemText>

            </CustomNavLink>
            <OrderHistory height='44' width='44'/>
        </NewMenuItem>

    </ResponsiveContainer>
}

export default Main