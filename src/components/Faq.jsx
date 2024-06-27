import React, { Fragment, useEffect, useState } from "react"
import { Route, Routes, Link, useNavigate } from "react-router-dom"
import { commonTextUa, changeTextUa, procedureTextUa, commonTextRu, changeTextRu, procedureTextRu } from "../common/faqTexts"
import { useTelegram } from '../hooks/useTelegram'
import { useSelector } from "react-redux"
import { translate } from '../translater/translater'
import Flex from "./styledComponent/Flex"
import FaqTemplate from "./FaqTemplate"
import styled from "styled-components"
import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import ResponsiveContainer from "./styledComponent/ResponsiveContainer"
import Title from './styledComponent/Title';
import { Accordion, Card} from 'react-bootstrap'
import GoldTextNS from "./newStyledComponents/GoldText";
import Text from './styledComponent/Text'
import RadioButtonGroup from "./newStyledComponents/RadioButtonGroup";

const faqPartButtons = ["Общие", "Нал. Обмен", "Вопросы"]
const StyledAccordion = styled(Accordion)`
    width: 100%;
    margin-top: 20px;
    
    
    & .accordion-header {
        border: none;
        outline: none;
        border-radius: 4px;
    }
    
    & .accordion-button {
        background-color: #1C1C1C; 
        color: #fff;
        border: 2px solid #3F3F3F;
        border-radius: 4px;
        display: flex;
        box-shadow: none;
        min-height: 70px;
        
        &::after {
            background-color: #F6BB0D;
            border-radius: 50%;
        }
    }
    
    & .accordion-body {
        background-color: #000;
        color: #fff;
    }
`
const StyledLink = styled(Link)`
    padding: 2px 3px 2px 3px;
    background-color: transparent;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    width: auto;
    border-radius: 5px;
`

const Faq = (props) => {

    const {backButton} = useTelegram()
    const navigate = useNavigate()
    const lang = useSelector(state => state.order.lang)
    const [clickeStatusdId, setClickedStatusId] = useState(0);



    /*
    * Обработчик кнопки Назад
    **/
    useEffect(() => {
        backButton.show()
        backButton.onClick(() => {navigate('/')})
        return () => {
            backButton.offClick(() => {navigate('/')})
        }
    }, [backButton])

    useEffect(() => {
        navigate('1')
    }, [])

    function goToMain() {
        navigate('/')
    }

    const handleStatusClick = (label, id) => {
        setClickedStatusId(id)

    };


    return <ResponsiveContainer direction='column' padding='40px 20px 20px 20px'>
        <Flex align='center' justify='space-between' mt='34px'>
            <NSBackButton onClick={goToMain}>{translate('0010', lang)}</NSBackButton>
            <NSHelpButton/>
        </Flex>

        <Title mt="20px" mb="20px" alignself="center">Вопрос/Ответ</Title>    
        <Flex align='start' direction='column' mb='34px'>
                    <RadioButtonGroup>
                        {faqPartButtons.map((label, i) => <button
                                type='radio'
                                key={i}
                                onClick={() => handleStatusClick(label, i)}
                                className={i === clickeStatusdId ? "active" : "radioBtn"}
                            >
                                {label}
                            </button>
                        )}
                    </RadioButtonGroup>
        </Flex>

{clickeStatusdId === 0 && 
        <StyledAccordion defaultActiveKey="0" flush>

            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <GoldTextNS>PRO1OOK</GoldTextNS>
                </Accordion.Header>
                <Accordion.Body>
                    <h2>Evoluция 100% в работе</h2>
                   <Text>Обмен на расстоянии одного клика,
                     а главное прозрачно, безопасно и удобно.
                     <br/>
                     <br/>
                     <h4>PROS1OO</h4>автоматизация -
                     только там, где это уместно,
                     важно и практично.</Text>
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
                <Accordion.Header>
                    <GoldTextNS>График работы</GoldTextNS>
                </Accordion.Header>
                <Accordion.Body>
                    <h2>24/7 365 дней в году</h2>
                   <Text>
                     <div><h5>Кассы, наличный обмен:</h5>
                         ПН-ПТ 09:00 -19:00
                         <br/>
                         СБ 10:00-15:00
                         <br/>
                         Время обмена - до 30 мин.
                         <br/>
                         Писать: @PROS100K_support
                         <br/>
                         <br/>
                         <h5>Безнал, покупка с карты:</h5>
                         @Merchant_PROS100K
                         <br/>
                         Ежедневно, без выходных 
                         <br/>
                         С 09:00-23:00
                         <br/>
                         Время обмена - до 30 мин.
                         <br/>
                         <br/>
                         <h5>Трансфер:</h5>
                         Время работы:
                         <br/>
                         ПН-ПТ: 09:00 - 19:00
                         <br/>
                         СБ: 10:00 - 15:00
                         <br/>
                         Регламент обмена - до 1-го календарного дня
                         <br/>
                         По вопросам обмена писать: https://t.me/PROS100K_support

                         </div>
                         </Text>
                </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="2">
                <Accordion.Header>
                    <GoldTextNS>Принимаем/Выдаем</GoldTextNS>
                </Accordion.Header>
                <Accordion.Body>
                    <h2>С такими валютами и платежными системами:</h2>
                   <Text><h5>Наличные операции:</h5>
                        - Доллар США (USD)
                        <br/>
                        - Евро (EUR)
                        <br/>
                        - Гривна (UAH)
                        <br/>
                        <i>Мин. сумма операции в еквиваленте 1000 Долларов США</i>
                        <br/>
                        <br/>
                        <h5>Безнал, покупка с карты:</h5>
                        - Visa/Mastercard UAH (Моно, Приват-Банк, ПУМБ, Ощад и др.)
                        <br/>
                        - PerfectMoney (USD)
                        <br/>
                        - Payoneer (EUR)
                        <br/>
                        - Wise (EUR)
                        <br/>
                        - Capitalist (USD)
                        <br/>
                        - Paypal (USD)
                        <br/>
                        - SEPA Instant (EUR)
                        <br/>
                        <i>Мин. сумма операции в еквиваленте 200 Долларов США</i>
                        <br/>
                        <b>После осуществления перевода обязательно прикрепить квитанцию о совершении перевода!</b>
                        </Text>


                </Accordion.Body>
            </Accordion.Item>


            <Accordion.Item eventKey="3">
                <Accordion.Header>
                    <GoldTextNS>Кассы Украина</GoldTextNS>
                </Accordion.Header>
                <Accordion.Body>
                    <h2>В таких городах:</h2>
                   <Text><h4>
                    - Винница;
                    <br/>
                    - Днепр;
                    <br/>
                    - Житомир;
                    <br/>
                    - Запорожье;
                    <br/>
                    - Киев;
                    <br/>
                    - Кропивницкий;
                    <br/>
                    - Кривой-Рог;
                    <br/>
                    - Львов;
                    <br/>
                    - Ивано-Франковск;
                    <br/>
                    - Одесса;
                    <br/>
                    - Харьков;
                    <br/>
                    - Тернополь;
                    <br/>
                    - Чернигов;
                    <br/>
                    - Черкассы;
                    <br/>
                    - Черновцы;
                    </h4>
                    </Text>

                    </Accordion.Body>
                </Accordion.Item>

            <Accordion.Item eventKey="4">
                <Accordion.Header>
                    <GoldTextNS>Международные переводы</GoldTextNS>
                </Accordion.Header>
                <Accordion.Body>
                    <h2>В таких странах:</h2>
                   <Text><h4>
                    - Украина;
                    <br/>
                    - США;
                    <br/>
                    - Канада;
                    <br/>
                    - Турция;
                    <br/>
                    - Испания;
                    <br/>
                    - Молдавия;
                    <br/>
                    - Польша;
                    <br/>
                    - Германия;
                    <br/>
                    - Австрия;
                    <br/>
                    - Чехия;
                    <br/>
                    - Франция;
                    <br/>
                    - ОАЕ;
                    <br/>
                    - Англия;
                    <br/>
                    - Израель.
                    </h4>
                    </Text> 


                </Accordion.Body>
            </Accordion.Item>

        </StyledAccordion>}
        
        {clickeStatusdId === 1 && 
        <StyledAccordion defaultActiveKey="0" flush>

            

            <Accordion.Item eventKey="1">
                <Accordion.Header>
                    <GoldTextNS>Создание ордера на покупку</GoldTextNS>
                </Accordion.Header>
                <Accordion.Body>
                    <h2>Этап 1: выбор направления (КУПИТЬ/ПРОДАТЬ) и заполнение данных:</h2>
                    <Text>Купить крипто - выбираем монету для покупки;
                    <br/>
                    Сеть перевода - выбираем сеть в которой монета будет Вам отправлена;\
                    <br/>
                    Фиатная валюта - указываем какую валюту кешем будем отдавать;
                    <br/>
                    Страна - выбираем в какой стране будет осуществлена операция;
                    <br/>
                    Город - выбираем город в котором будем вносить кеш;
                    <br/>
                    Курс - исходя из указанных Вами данных отображает сколько Вы за единицу продаваемой валюты получите единиц выбранной монеты;
                    <br/>
                    Комиссия - отображает комиссию сервиса по выбранному направлению с учетом выбранной страны и города;
                    <br/>
                    СУММА - Вы можете внести сумму как для внесения так и в поле я получаю, если Вы укажете сумму в поле “Я получаю” то сумма в поле “Я отдаю” будет автоматически пересчитана и наоборот.
                    <br/>
                    РЕКВИЗИТЫ:
                    <br/> 
                    Адрес кошелька: указываем адрес согласно выбранной Вами монеты и сети перевода (в зависимости от выбранной сети адрес меняется, если Вы укажете не ту сеть перевода или отправите не на ту что выбрали - Ваши средства могут быть утрачены навсегда);
                    <br/>
                    Ник в ТГ - это Ваш никнейм в телеграм который подтягивается автоматически;
                    <br/>
                    Телефон - укажите свой телефон или телефон человека который будет вносить средства (если не Вы лично будете вносить то человек который будет это делать должен будет написать адрес кошелька указанный при создании заявки);
                    <br/>
                    Имя - Укажите свое имя или Имя человека, который будет вносить средства наличными в кассу.
                    <br/>
                    ДАЛЕЕ - переход от этапа заполнения введенных данных - к этапу проверки ордера перед его созданием.
</Text>
                </Accordion.Body>
            </Accordion.Item>

            

        </StyledAccordion>
        }

{clickeStatusdId === 2 && 
        <StyledAccordion defaultActiveKey="0" flush>

                      

            <Accordion.Item eventKey="2">
                <Accordion.Header>
                    <GoldTextNS>Вопрос 2</GoldTextNS>
                </Accordion.Header>
                <Accordion.Body>
                    <h2>Блог3</h2>
                    <Text> Ответ на вопрос3</Text>
                </Accordion.Body>
            </Accordion.Item>

        </StyledAccordion>
        }

        
    </ResponsiveContainer>
}

export default Faq