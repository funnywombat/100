import {statusTypeNames, valueTranslate} from "../common/enums"
import {dateFormat} from "../common/dateFormatter"
import {translate} from "../translater/translater"

import {useSelector} from "react-redux"
import {exchangeTypeNames, orderTypeNames} from "../common/enums"
import {useNavigate} from "react-router"
import React, {useEffect, useState} from "react"
import styled from "styled-components"
import Flex from "./styledComponent/Flex"
import _isEmpty from 'lodash/isEmpty'
import Title from "./styledComponent/Title";
import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import NSFilterButton from "./newStyledComponents/NSFilterButton";
import RadioButtonGroup from "./newStyledComponents/RadioButtonGroup";
import OrderListItem from "./newStyledComponents/OrderListItem";
import {statsBtns, typeBtns, kindBtns} from "../common/buttonList";
import {useTelegram} from "../hooks/useTelegram";
import Text from "./styledComponent/Text"
import Loader from "./Loader";
import ResponsiveContainer from "./styledComponent/ResponsiveContainer"
import TextGray from "./styledComponent/TextGrey"

const List = styled.ul`
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: 100%;
    border-radius: 15px;
    background-color: transparent;

    & li {
        display: flex;
    }
`
const Instantbutton = styled.button`
    display: flex;
    border:none;
    background-color: transparent;

    & span {
        background: linear-gradient(90deg, #B5A883, #F6BB0D);
        -webkit-background-clip: text;
        font-size: 1.125em;
        font-weight: 600;
        -webkit-text-fill-color: transparent;
        display: table;
    }
   `

export default function OrderList({orders, getUserOrders, filteringOrders, filteringByKind, filteringByType}) {

    const [clickeStatusdId, setClickedStatusId] = useState(0);
    const [clickeTypedId, setClickedStatusTypeId] = useState(0);
    const [clickeKinddId, setClickedKindId] = useState(0);



    const lang = useSelector(state => state.order.lang)

    const navigate = useNavigate()
    const [filtered, setFiltered] = useState(null)
    const [isFiltersVisible, setIsFiltersVisible] = useState(false)

    const sellTitle = translate('0071', lang)
    const buyTitle = translate('0072', lang)

    const [currentOrders, setCurrentOrders] = useState([])
    const {backButton} = useTelegram()

    const goBack = () => {
        navigate('/')
    }



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


    useEffect(() => {

        if (clickeStatusdId === 1 || clickeStatusdId === 2) return
        if (orders && orders.length > 0) {
            setCurrentOrders(orders)
        }
    }, [orders])

    useEffect(() => {
        instant()        
    }, [currentOrders]);

    const instant = ()=>{
        if (currentOrders && currentOrders.length > 0) {
            // let correctOrders = currentOrders.filter(o => o.status !== statusTypeNames.OrderCancelled && o.status !== statusTypeNames.OrderComplete).sort(((a, b) => b.order_id - a.order_id))
            setFiltered(currentOrders)
        }
    }
    const handleStatusClick = (label, id) => {
        setClickedStatusId(id)

        let filterOrders = filteringOrders(label)
        let sortedData = filterOrders.sort(((a, b) => b.order_id - a.order_id))

        setFiltered(sortedData)
    };

    const handleTypeClick = (label, id) => {
        setClickedStatusTypeId(id)
        let filterOrders = filteringByType(label)
        let sortData = filterOrders.sort(((a, b) => b.order_id - a.order_id))
        setFiltered(sortData)

    };

    const handleKindClick = (label, id) => {
        setClickedKindId(id)
        let filterOrders = filteringByKind(label)
        let sortData = filterOrders.sort(((a, b) => b.order_id - a.order_id))
        setFiltered(sortData)
    };


    return (
        <ResponsiveContainer
            justify={"flex-start"}
            direction="column"
            padding='60px 20px 0px 20px'
        >

            <Flex align='center' justify='space-between'>
                <NSBackButton onClick={goBack}>{translate('0010', lang)}</NSBackButton>
                <NSHelpButton/>
            </Flex>

            <Title weight='500' alignself='center' mt='34px' mb='24px'>История ордеров</Title>
            <Flex>
                <Instantbutton onClick={instant}><span>Все</span></Instantbutton>
                <Flex justify='flex-end' mb='12px'>
                    <NSFilterButton onClick={() => setIsFiltersVisible(!isFiltersVisible)}>Фильтр</NSFilterButton>
                </Flex>
            </Flex>
            

            {
                isFiltersVisible && <Flex align='start' direction='column' mb='34px'>
                    <TextGray mb='8px'>Статус:</TextGray>
                    <RadioButtonGroup>
                        {statsBtns.map((label, i) => <button
                                type='radio'
                                key={i}
                                onClick={() => handleStatusClick(label, i)}
                                className={i === clickeStatusdId ? "active" : "radioBtn"}
                            >
                                {label}
                            </button>
                        )}
                    </RadioButtonGroup>

                    <TextGray mb='8px' mt='14px'>Тип ордера:</TextGray>
                    <RadioButtonGroup>
                        {typeBtns.map((label, i) => <button
                                type='radio'
                                key={i}
                                onClick={() => handleTypeClick(label, i)}
                                className={i === clickeTypedId ? "active" : "radioBtn"}
                            >
                                {label}
                            </button>
                        )}
                    </RadioButtonGroup>


                    <TextGray mb='8px' mt='14px'>Вид ордера:</TextGray>
                    <RadioButtonGroup>
                        {kindBtns.map((label, i) => <button
                                type='radio'
                                key={i}
                                onClick={() => handleKindClick(label, i)}
                                className={i === clickeKinddId ? "active" : "radioBtn"}
                            >
                                {label}
                            </button>
                        )}
                    </RadioButtonGroup>
                </Flex>
            }

            {
                !_isEmpty(filtered) ? filtered.map(o => <OrderListItem
                    key={o.order_id}
                    orderId={o.order_id}
                    orderType={o.order_type === orderTypeNames.buy
                        ? buyTitle
                        : sellTitle
                    }
                    exchangeType={o.exchange_type}
                    date={dateFormat(o.date_creation)}
                    amount={o.send_amount}
                    currency={o.order_type === orderTypeNames.buy
                        ? o.currencies.currency_2
                        : o.currencies.currency_1
                    }
                    status={valueTranslate(o.status)}
                />)

                    : <><Text mt='34px'>Нет активных ордеров.</Text><Text mt='34px' alignself='center' onClick={() => navigate('/')}>Вернуться на главную для создания нового?</Text></>
            }
            
        </ResponsiveContainer>
    )
}


