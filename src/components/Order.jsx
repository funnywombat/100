import React, {useEffect, useState, Fragment} from 'react'
import {useParams, useNavigate, Navigate} from "react-router-dom"
import {useTelegram} from '../hooks/useTelegram'
import {transferNetworkNames, valueTranslate} from '../common/enums'
import {getBankNames, getOrderById, setOrderStatus, setUserIsPaid} from '../api/api'

import {changeIsLoaderVisible} from "../store/orderSlice";
import {useDispatch, useSelector} from "react-redux"

import {exchangeTypeNames, orderTypeNames, statusTypeNames} from "../common/enums"

import Notiflix from 'notiflix'
import Flex from './styledComponent/Flex'
import Text from './styledComponent/Text'
import Title from './styledComponent/Title'
import Loader from './Loader'
import StatusText from './styledComponent/StatusText'
import CustomTextArea from './styledComponent/CustomTextArea'

import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import {translate} from "../translater/translater"

import GradientContainer from "./newStyledComponents/GradientContainer";
import GradientMenuItem from "./newStyledComponents/GradientMenuItem";
import DoubleMenuItemHorizontal from "./newStyledComponents/DoubleMenuItemHorizontal";
import MenuItemShort from "./newStyledComponents/MenuItemShort";
import MenuItemWithoutFocus from "./newStyledComponents/MenuItemWithoutFocus";
import GoldTextNS from "./newStyledComponents/GoldText";
import MainGreyButton from "./newStyledComponents/MainGreyButton";
import MainGoldButton from "./newStyledComponents/MainGoldButton";
import ButtonRounded from "./styledComponent/ButtonRounded";
import SuccessModal from "./SuccessModal";
import ResponsiveContainer from "./styledComponent/ResponsiveContainer"

const Order = (props) => {

    const {backButton} = useTelegram()
    const {order_id} = useParams()
    const navigate = useNavigate()
    let [currentOrder, setCurrentOrder] = useState(null)
    const dispatch = useDispatch()
    const lang = useSelector(state => state.order.lang)
    const [currentBank, setCurrentBank] = useState({})
    const [cur1, setCur1] = useState('USDT')
    const [cur2, setCur2] = useState('UAH')
    const [isShowModal, setIsShowModal] = useState(false)
    let [fiatChar, setFiatChar] = useState("")
    const fullName = useSelector(state => state.order.fullName)
    const isLoading = useSelector(state => state.order.isLoaderVisible)

    async function setBank() {
        const banksForPay = await getBankNames()
        if (banksForPay) {
            for (let bank of banksForPay) {
                if (bank.cardNumber === currentOrder.banking_data.card) {
                    setCurrentBank(bank)
                }
            }
        }
    }

    useEffect(() => {

        if (currentOrder) {
            setBank();
        }
    }, [currentOrder])

    useEffect(() => {
        if (currentOrder) {
            if (currentOrder.currencies.currency_2 === 'UAH') {
                setFiatChar("₴")
            } else if (currentOrder.currencies.currency_2 === 'USD') {
                setFiatChar("$")
            } else if (currentOrder.currencies.currency_2 === 'EUR') {
                setFiatChar("€")
            }
        }

    }, [currentOrder])


    /*
    * Обработчик кнопки Назад
    **/
    useEffect(() => {
        backButton.show()
        backButton.onClick(() => {
            navigate('/orderList')
        })
        return () => {
            backButton.offClick(() => {
                navigate('/orderList')
            })
        }
    }, [backButton])


    /*
    * Получение ордера по ид
    **/
    useEffect(() => {
        let getOrder = async () => {
            dispatch(changeIsLoaderVisible(true))
            await getOrderById(order_id)
                .then(data => setCurrentOrder(data))
                .finally(() => {
                    dispatch(changeIsLoaderVisible(false))
                })
        }

        getOrder()

    }, [])


    useEffect(() => {
        if (currentOrder && currentOrder.exchange_type !== exchangeTypeNames.transfer) {
            if (currentOrder.order_type === orderTypeNames.buy) {
                setCur1(currentOrder.currencies.currency_2)
                setCur2(currentOrder.currencies.currency_1)
            } else {
                setCur1(currentOrder.currencies.currency_1)
                setCur2(currentOrder.currencies.currency_2)
            }
        }
    }, [currentOrder])


    useEffect(() => {
        if (isShowModal) {

            setTimeout(() => {
                setIsShowModal(false)
                goToMain()
            }, 6000)
        }

    }, [isShowModal])

    function goToMain() {
        navigate('/')
    }

    function openTransaction() {
        if (currentOrder.additional_info.pay_info && currentOrder.requisites.chain_network) {

            switch (currentOrder.requisites.chain_network) {

                case transferNetworkNames.ERC: {
                    return window.open(`https://etherscan.io/tx/${currentOrder.additional_info.pay_info}`)
                }

                case transferNetworkNames.BEP: {
                    return window.open(`https://bscscan.com/tx/${currentOrder.additional_info.pay_info}`)
                }

                case transferNetworkNames.TON: {
                    return window.open(`https://tonviewer.com/transaction/${currentOrder.additional_info.pay_info}`)
                }

                case transferNetworkNames.SOL: {
                    return window.open(`https://explorer.solana.com/${currentOrder.additional_info.pay_info}`)
                }

                case transferNetworkNames.BTC: {
                    return window.open(`https://www.blockchain.com/explorer/transactions/btc/${currentOrder.additional_info.pay_info}`)
                }

                default: {
                    return window.open(`https://tronscan.org/#/transaction/${currentOrder.additional_info.pay_info}`)
                }
            }

        }

    }

    const payOrder = async () => {

        await setUserIsPaid(order_id)
        Notiflix.Notify.success('Статус заявки успешно изменён')
        navigate('/')
    }

    /*
    * Отмена ордера
    **/
    const discardOrder = async () => {
        let status = statusTypeNames.OrderCancelled
        await setOrderStatus(order_id, status)
        Notiflix.Notify.success(translate("0081", lang))
        goToMain()
    }

    /*
    * Изменение статуса Я Получил
    **/
    const acceptPayment = async () => {
        let status = statusTypeNames.OrderComplete
        await setOrderStatus(order_id, status)

        setIsShowModal(true)
    }

    if (isLoading) {
        return <Loader/>
    }


    return <ResponsiveContainer direction='column'>

        {currentOrder && <Flex direction='column'>

            <Flex direction='column' padding='20px 20px 60px 20px' style={{
                opacity: isShowModal ? 0.3 : 1
            }}>

                <Flex align='center' mb='34px' justify='space-between'>
                    <NSBackButton onClick={goToMain}>{translate('0010', lang)}</NSBackButton>
                    <NSHelpButton/>
                </Flex>

                <Title mt='10px'>
                    {currentOrder.exchange_type === exchangeTypeNames.cash ? "Наличный ордер:" : "Безналичный ордер"}
                </Title>

                <GradientContainer>
                    <Flex justify='space-between'>
                        <Text>{currentOrder.exchange_type === exchangeTypeNames.cash ? "Наличный ордер:" : "Безналичный ордер"}</Text>
                        <GoldTextNS>{currentOrder.order_id}</GoldTextNS>
                    </Flex>

                    <Flex justify='space-between' mt='12px'>
                        <Text>Статус</Text>
                        {
                            (currentOrder.status === statusTypeNames.PaymentVerified
                                && currentOrder.exchange_type === exchangeTypeNames.cash
                                && currentOrder.order_type === orderTypeNames.sell
                            )
                                ? <Text size='18px' color='#7A7A7A'>Ожидание выдачи средств</Text>
                                : <StatusText
                                    status={currentOrder.status}>{valueTranslate(currentOrder.status)}</StatusText>
                        }
                    </Flex>

                </GradientContainer>

                <GradientContainer>
                    <Flex justify='space-between'>
                        <Flex direction='column'>
                            <Text aligntext='start'>Курс:</Text>
                            <Text aligntext='start'>{currentOrder.additional_info.exchange_rate}</Text>
                        </Flex>

                        <GradientMenuItem>{currentOrder.order_type === orderTypeNames.buy ? 'Покупка' : 'Продажа'}</GradientMenuItem>
                    </Flex>

                    <Flex justify='flex-end' mt='5px' style={{gap: '30px'}}>
                        <Text>Отдаю:</Text>
                        <Text>Получаю:</Text>
                    </Flex>

                    <Flex justify='space-between' mt='5px'>
                        <Text>Валюта:</Text>
                        {currentOrder.order_type === orderTypeNames.buy
                            ? <DoubleMenuItemHorizontal text1={currentOrder.currencies.currency_2 + fiatChar}
                                                        text2={currentOrder.currencies.currency_1 + " " + currentOrder.requisites.chain_network}/>
                            : <DoubleMenuItemHorizontal
                                text1={currentOrder.currencies.currency_1 + " " + currentOrder.requisites.chain_network}
                                text2={currentOrder.currencies.currency_2 + fiatChar}/>
                        }
                    </Flex>

                    <Flex justify='space-between' mt='10px'>
                        <Text>Сумма:</Text>
                        <DoubleMenuItemHorizontal text1={currentOrder.send_amount} text2={currentOrder.recieve_amount}/>
                    </Flex>

                    {currentOrder.exchange_type === exchangeTypeNames.cash && <Flex justify='space-between' mt='10px'>
                        <Text>Офис</Text>
                        <DoubleMenuItemHorizontal text1={currentOrder.country} text2={currentOrder.city}/>
                    </Flex>
                    }

                    {currentOrder.exchange_type === exchangeTypeNames.banking &&
                        <Flex justify='space-between' mt='10px'>
                            <Text>Банк:</Text>
                            <MenuItemShort text={currentOrder.requisites.bank_name}/>
                        </Flex>
                    }

                </GradientContainer>


                {/*CASH  BUY---------------------------------*/}

                {
                    ((currentOrder.status === statusTypeNames.OrderInitiated
                            || currentOrder.status === statusTypeNames.PaymentPending) &&
                        currentOrder.exchange_type === exchangeTypeNames.cash) &&
                    currentOrder.order_type === orderTypeNames.buy && <>

                        <Title mt="34px">Реквизиты:</Title>
                        <Text size="16px" color="#99999A" aligntext="start">Или другие необходимые данные</Text>
                        <Text size="16px" color="#99999A" aligntext="start" mb="14px">для выполнения ордера.</Text>

                        {
                            currentOrder.order_type === orderTypeNames.buy && <>


                                <Title>Адрес кошелька:</Title>
                                <MenuItemWithoutFocus>
                                    <CustomTextArea mt='0px' mb='0px' col="2" value={currentOrder.requisites.wallet_address}
                                                    readOnly/>
                                </MenuItemWithoutFocus>

                            </>

                        }


                        <MenuItemWithoutFocus mb='100px'>
                            <Flex direction='column'>
                                <Flex justify='space-between' mt='14px'>
                                    <Text>Telegram @username</Text>
                                    <Text>{currentOrder.user_reciever_info.username}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px'>
                                    <Text>Телефон</Text>
                                    <Text>{currentOrder.user_reciever_info.phone}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px' mb='14px'>
                                    <Text>Имя</Text>
                                    <Text>{currentOrder.user_reciever_info.full_name}</Text>
                                </Flex>
                            </Flex>
                        </MenuItemWithoutFocus>
                    </>
                }

                {
                    (currentOrder.status === statusTypeNames.UserPaid
                        && currentOrder.order_type === orderTypeNames.buy
                        && currentOrder.exchange_type === exchangeTypeNames.cash) && <>
                        <Title mt='14px'>Информация для оплаты:</Title>
                        <Text size="18px" color="#99999A" aligntext="start">Или другие необходимые данные</Text>
                        <Text size="18px" color="#99999A" aligntext="start" mb="14px">для выполнения ордера.</Text>

                        <MenuItemWithoutFocus>
                            <Text>{currentOrder.escrow_info}</Text>
                        </MenuItemWithoutFocus>


                        <Title mt='30px' mb='10px'>Адрес кошелька:</Title>
                        <MenuItemWithoutFocus>
                            <CustomTextArea mt='0px' mb='0px' col="2" value={currentOrder.requisites.wallet_address}
                                            readOnly/>
                        </MenuItemWithoutFocus>
                        <Text color='#99999A' width='100%' size='18px'>Который был указан при создании Вашего
                            ордера
                        </Text>
                    </>
                }


                {
                    currentOrder.status === statusTypeNames.InEscrow &&
                    currentOrder.exchange_type === exchangeTypeNames.cash &&
                    currentOrder.order_type === orderTypeNames.buy &&

                    <Flex direction='column'>
                        <Title mt='30px' mb='10px'>Комментарий:</Title>
                        <MenuItemWithoutFocus>
                            <Text>
                                {currentOrder.user_reciever_info.username}, менеджер подтвердил получение средств по
                                Вашему ордеру!
                                Ожидайте дополнительного уведомления о
                                переводе {currentOrder.order_type === orderTypeNames.buy ?
                                "криптовалюты на Ваш кошелек" : "средств на Вашу банковскую карту"
                            }
                            </Text>
                        </MenuItemWithoutFocus>

                        <Title mt='30px' mb='10px'>Текущий статус:</Title>
                        <MenuItemWithoutFocus>
                            <Text>Подготовка перевода средств</Text>
                        </MenuItemWithoutFocus>

                        <Title mt='30px' mb='10px'>Адрес кошелька:</Title>

                        <MenuItemWithoutFocus>
                            <CustomTextArea mt='0px' mb='0px' col="2" value={currentOrder.requisites.wallet_address}
                                            readOnly/>
                        </MenuItemWithoutFocus>
                        <Text color='#99999A' width='97%' size='18px'>Который был указан при создании Вашего
                            ордера
                        </Text>
                    </Flex>
                }

                {/*PAYMENT_VERIFIIED*/}

                {
                    currentOrder.status === statusTypeNames.PaymentVerified &&
                    currentOrder.order_type === orderTypeNames.buy &&

                    <>
                        <Title mt='30px' mb='10px'>Комментарий</Title>
                        <MenuItemWithoutFocus>
                            <Text>
                                {currentOrder.user_reciever_info.username}, менеджер отправил средства по Вашему ордеру
                                №{currentOrder.order_id}.
                                Пожалуйста подтвердите получение нажатием “Я Получил”!
                            </Text>
                        </MenuItemWithoutFocus>

                        <Title mt='30px' mb='10px'>ID транзакции:</Title>
                        <MenuItemWithoutFocus>
                            <CustomTextArea col={3}
                                            width='100%'
                                            value={currentOrder.additional_info.pay_info}
                            />
                        </MenuItemWithoutFocus>

                        <ButtonRounded mt='20px' mb='120px' onClick={openTransaction}>Открыть транзакцию</ButtonRounded>
                    </>
                }


                {
                    currentOrder.status === statusTypeNames.OrderComplete &&
                    currentOrder.exchange_type === exchangeTypeNames.cash &&
                    currentOrder.order_type === orderTypeNames.buy && <>
                        <>

                            <Title mt="34px">Реквизиты:</Title>
                            <Text size="16px" color="#99999A" aligntext="start">Или другие необходимые данные</Text>
                            <Text size="16px" color="#99999A" aligntext="start" mb="14px">для выполнения ордера.</Text>

                            {
                                currentOrder.order_type === orderTypeNames.buy && <>
                                    <Title mt='14px' mb='10px'>Адрес кошелька:</Title>
                                    <MenuItemWithoutFocus>
                                        <CustomTextArea mt='0px' mb='0px' col="2" value={currentOrder.requisites.wallet_address}
                                                        readOnly/>
                                    </MenuItemWithoutFocus>
                                </>
                            }


                            <MenuItemWithoutFocus mb='100px'>
                                <Flex direction='column'>
                                    <Flex justify='space-between' mt='14px'>
                                        <Text>Telegram @username</Text>
                                        <Text>{currentOrder.user_reciever_info.username}</Text>
                                    </Flex>

                                    <Flex justify='space-between' mt='24px'>
                                        <Text>Телефон</Text>
                                        <Text>{currentOrder.user_reciever_info.phone}</Text>
                                    </Flex>

                                    <Flex justify='space-between' mt='24px' mb='14px'>
                                        <Text>Имя</Text>
                                        <Text>{currentOrder.user_reciever_info.full_name}</Text>
                                    </Flex>
                                </Flex>
                            </MenuItemWithoutFocus>
                        </>
                    </>
                }


                {/*CASH SELL---------------------------------*/}

                {
                    currentOrder.status === statusTypeNames.OrderInitiated
                    && currentOrder.order_type === orderTypeNames.sell
                    && currentOrder.exchange_type === exchangeTypeNames.cash && <>

                        <Title mt="34px">Реквизиты:</Title>
                        <Text size="18px" color="#99999A" aligntext="start">Или другие необходимые данные</Text>
                        <Text size="18px" color="#99999A" aligntext="start" mb="14px">для выполнения ордера.</Text>

                        <MenuItemWithoutFocus mb='100px'>
                            <Flex direction='column'>
                                <Flex justify='space-between' mt='14px'>
                                    <Text>Telegram @username</Text>
                                    <Text>{currentOrder.user_reciever_info.username}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px'>
                                    <Text>Телефон</Text>
                                    <Text>{currentOrder.user_reciever_info.phone}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px' mb='14px'>
                                    <Text>Имя</Text>
                                    <Text>{currentOrder.user_reciever_info.full_name}</Text>
                                </Flex>
                            </Flex>
                        </MenuItemWithoutFocus>
                    </>

                }


                {
                    (currentOrder.status === statusTypeNames.PaymentPending
                        && currentOrder.order_type === orderTypeNames.sell
                        && currentOrder.exchange_type === exchangeTypeNames.cash) && <>
                        <Title mt="34px">Мои реквизиты:</Title>
                        <Text size="16px" color="#99999A" aligntext="start">Или другие необходимые данные</Text>
                        <Text size="16px" color="#99999A" aligntext="start" mb="14px">для выполнения ордера.</Text>

                        <MenuItemWithoutFocus mb='100px'>
                            <Flex direction='column'>
                                <Flex justify='space-between' mt='14px'>
                                    <Text>Telegram @username</Text>
                                    <Text>{currentOrder.user_reciever_info.username}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px'>
                                    <Text>Телефон</Text>
                                    <Text>{currentOrder.user_reciever_info.phone}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px' mb='14px'>
                                    <Text>Имя</Text>
                                    <Text>{currentOrder.user_reciever_info.full_name}</Text>
                                </Flex>
                            </Flex>
                        </MenuItemWithoutFocus>
                    </>
                }


                {
                    (currentOrder.status === statusTypeNames.InEscrow
                        && currentOrder.order_type === orderTypeNames.sell
                        && currentOrder.exchange_type === exchangeTypeNames.cash) && <>
                        <Title mt='30px' mb='10px'>Комментарий:</Title>
                        <MenuItemWithoutFocus>
                            <Text>
                                {currentOrder.user_reciever_info.username}, менеджер подтвердил Ваш платеж,
                                Мы подготовим средства для выдачи и отправим дополнительную информацию
                                для получения денег.
                            </Text>
                        </MenuItemWithoutFocus>

                        <Title mt='30px' mb='10px'>Текущий статус:</Title>
                        <MenuItemWithoutFocus>
                            <Text>Подготовка наличных средств</Text>
                        </MenuItemWithoutFocus>
                    </>
                }

                {
                    (currentOrder.status === statusTypeNames.OrderComplete
                        && currentOrder.order_type === orderTypeNames.sell
                        && currentOrder.exchange_type === exchangeTypeNames.cash) && <>
                        <Title mt="34px">Мои реквизиты:</Title>
                        <Text size="16px" color="#99999A" aligntext="start">Или другие необходимые данные</Text>
                        <Text size="16px" color="#99999A" aligntext="start" mb="14px">для выполнения ордера.</Text>

                        <MenuItemWithoutFocus mb='100px'>
                            <Flex direction='column'>
                                <Flex justify='space-between' mt='14px'>
                                    <Text>Telegram @username</Text>
                                    <Text>{currentOrder.user_reciever_info.username}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px'>
                                    <Text>Телефон</Text>
                                    <Text>{currentOrder.user_reciever_info.phone}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px' mb='14px'>
                                    <Text>Имя</Text>
                                    <Text>{currentOrder.user_reciever_info.full_name}</Text>
                                </Flex>
                            </Flex>
                        </MenuItemWithoutFocus>
                    </>
                }


                {
                    (currentOrder.status === statusTypeNames.UserPaid
                        && currentOrder.order_type === orderTypeNames.sell
                        && currentOrder.exchange_type === exchangeTypeNames.cash) && <>
                        <Title mt="34px">Мои реквизиты:</Title>
                        <Text size="16px" color="#99999A" aligntext="start">Или другие необходимые данные</Text>
                        <Text size="16px" color="#99999A" aligntext="start" mb="14px">для выполнения ордера.</Text>

                        <MenuItemWithoutFocus mb='100px'>
                            <Flex direction='column'>
                                <Flex justify='space-between' mt='14px'>
                                    <Text>Telegram @username</Text>
                                    <Text>{currentOrder.user_reciever_info.username}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px'>
                                    <Text>Телефон</Text>
                                    <Text>{currentOrder.user_reciever_info.phone}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px' mb='14px'>
                                    <Text>Имя</Text>
                                    <Text>{currentOrder.user_reciever_info.full_name}</Text>
                                </Flex>
                            </Flex>
                        </MenuItemWithoutFocus>
                    </>
                }


                {
                    currentOrder.status === statusTypeNames.PaymentVerified &&
                    currentOrder.order_type === orderTypeNames.sell &&
                    currentOrder.exchange_type === exchangeTypeNames.cash &&
                    <>
                        <Title mt='30px' mb='10px'>Комментарий:</Title>
                        <MenuItemWithoutFocus>
                            <Text>
                                {currentOrder.user_reciever_info.username}, менеджер подтвердил что Ваши
                                средства находятся в обменнике.
                            </Text>
                        </MenuItemWithoutFocus>

                        <Title mt='30px' mb='10px'>Информация для получения:</Title>
                        <MenuItemWithoutFocus>
                            <Text>{currentOrder.escrow_info}</Text>
                        </MenuItemWithoutFocus>
                    </>
                }


                {/*BANKING  BUY---------------------------------*/}

                {
                    ((currentOrder.status === statusTypeNames.OrderInitiated ||
                            currentOrder.status === statusTypeNames.PaymentPending ||
                            currentOrder.status === statusTypeNames.OrderComplete) &&
                        currentOrder.order_type === orderTypeNames.buy &&
                        currentOrder.exchange_type === exchangeTypeNames.banking) && <>

                        <Title mt='30px'>Реквизиты:</Title>
                        <Text mb='8px' width='100%' size='18px' color='#99999A'>Или другие необходимые данные для выполнения
                            ордера.</Text>

                        <Title mt='14px' mb='10px'>Адрес кошелька:</Title>
                        <MenuItemWithoutFocus>
                            <CustomTextArea mt='0px' mb='0px' col="2" value={currentOrder.requisites.wallet_address}
                                            readOnly/>
                        </MenuItemWithoutFocus>

                        <MenuItemWithoutFocus mb='100px'>
                            <Flex direction='column'>
                                <Flex justify='space-between' mt='14px'>
                                    <Text>@username:</Text>
                                    <Text>{currentOrder.user_reciever_info.username}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px'>
                                    <Text>Телефон:</Text>
                                    <Text>{currentOrder.user_reciever_info.phone}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px' mb='14px'>
                                    <Text>Имя:</Text>
                                    <Text>{currentOrder.user_reciever_info.full_name}</Text>
                                </Flex>
                            </Flex>
                        </MenuItemWithoutFocus>
                    </>
                }

                {
                    currentOrder.order_type === orderTypeNames.buy &&
                    currentOrder.status === statusTypeNames.InEscrow &&
                    currentOrder.exchange_type === exchangeTypeNames.banking && <>
                        <Title mt='30px' mb='10px'>Комментарий:</Title>
                        <MenuItemWithoutFocus>
                            <Text>
                                {currentOrder.user_reciever_info.username}, менеджер подтвердил получение средств по Вашему
                                ордеру!
                                Ожидайте дополнительного уведомления о переводе криптовалюты на Ваш кошелек.
                            </Text>
                        </MenuItemWithoutFocus>


                        <Title mt='30px' mb='10px'>Текущий статус:</Title>
                        <MenuItemWithoutFocus>
                            <Text>Подготовка перевода средств</Text>
                        </MenuItemWithoutFocus>

                        <Title mt='30px'>Ваши реквизиты:</Title>
                        <Text mb='8px' width='100%' size='18px' color='#99999A'>Которые были указаны при создании Вашего
                            ордера</Text>

                        <Title mt='14px' mb='10px'>Адрес кошелька:</Title>
                        <MenuItemWithoutFocus>
                            <CustomTextArea mt='0px' mb='0px' col="2" value={currentOrder.requisites.wallet_address}
                                            readOnly/>
                        </MenuItemWithoutFocus>
                    </>
                }


                {/*USER_PAID*/}
                {
                    (currentOrder.status === statusTypeNames.UserPaid &&
                        currentOrder.order_type === orderTypeNames.buy &&
                        currentOrder.exchange_type === exchangeTypeNames.banking) && <>

                        <Title mt="34px" mb='10px'>Реквизиты для перевода:</Title>
                        <MenuItemWithoutFocus>
                            <Flex direction='column'>
                                <Flex mb='10px' justify='space-between'>
                                    <Text width='100%'>Номер карты:</Text>
                                    <Text aligntext='flex-end' color='#99999A'>{currentBank.cardNumber}</Text>
                                </Flex>

                                <Flex justify='space-between'>
                                    <Text>Получатель:</Text>
                                    <Text aligntext='flex-end' color='#99999A'>{currentBank.name}</Text>
                                </Flex>
                            </Flex>
                        </MenuItemWithoutFocus>

                        <Title mb='10px' mt='30px'>Сумма перевода:</Title>
                        <MenuItemWithoutFocus>
                            <Text>{currentOrder.send_amount + " " + currentOrder.currencies.currency_2 + fiatChar}</Text>
                        </MenuItemWithoutFocus>

                        <Title mt='30px' mb='10px'>Комментарий</Title>
                        <MenuItemWithoutFocus>
                            <Text>
                                {currentOrder.user_reciever_info.username}, ожидайте уведомление о подтверждении
                                выполненного Вами перевода.
                            </Text>
                        </MenuItemWithoutFocus>

                    </>
                }


                {/*BANKING  SELL---------------------------------*/}


                {(currentOrder.status === statusTypeNames.OrderInitiated ||
                        currentOrder.status === statusTypeNames.UserPaid ||
                        currentOrder.status === statusTypeNames.PaymentPending) &&
                    currentOrder.order_type === orderTypeNames.sell &&
                    currentOrder.exchange_type === exchangeTypeNames.banking && <>

                        <Title mt='30px'>Мои реквизиты:</Title>
                        <Text mb='8px' width='100%' size='18px' color='#99999A'>Или другие необходимые данные для
                            выполнения ордера.</Text>
                        <MenuItemWithoutFocus>
                            <Text>Номер карты:</Text>
                            <Text>{currentOrder.requisites.card_number}</Text>
                        </MenuItemWithoutFocus>

                        <MenuItemWithoutFocus>
                            <Text width='20%'>ФИО:</Text>
                            <Text width='80%'>{currentOrder.requisites.card_full_name}</Text>
                        </MenuItemWithoutFocus>

                        <MenuItemWithoutFocus mb='100px'>
                            <Flex direction='column'>
                                <Flex justify='space-between' mt='14px'>
                                    <Text>@username:</Text>
                                    <Text>{currentOrder.user_reciever_info.username}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px'>
                                    <Text>Телефон:</Text>
                                    <Text>{currentOrder.user_reciever_info.phone}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px' mb='14px'>
                                    <Text>Имя:</Text>
                                    <Text>{currentOrder.user_reciever_info.full_name}</Text>
                                </Flex>
                            </Flex>
                        </MenuItemWithoutFocus>
                    </>
                }


                {
                    currentOrder.status === statusTypeNames.PaymentVerified &&
                    currentOrder.order_type === orderTypeNames.sell &&
                    currentOrder.exchange_type === exchangeTypeNames.banking && <>

                        <Title mt='30px' mb='10px'>Комментарий</Title>
                        <MenuItemWithoutFocus>
                            <Text>
                                {currentOrder.user_reciever_info.username}, менеджер отправил средства по
                                Вашему ордеру. Пожалуйста подтвердите получение нажатием "Я Получил".
                            </Text>
                        </MenuItemWithoutFocus>

                        <Title mb='10px' mt='30px'>Мои реквизиты:</Title>
                        <Text mb='8px' width='100%' size='18px' color='#99999A'>Или другие необходимые данные для выполнения
                            ордера.</Text>
                        <MenuItemWithoutFocus>
                            <Text>Номер карты:</Text>
                            <Text>{currentOrder.requisites.card_number}</Text>
                        </MenuItemWithoutFocus>
                        <MenuItemWithoutFocus>
                            <Text width='20%'>ФИО:</Text>
                            <Text width='80%'>{currentOrder.requisites.card_full_name}</Text>
                        </MenuItemWithoutFocus>
                    </>
                }


                {currentOrder.status === statusTypeNames.InEscrow &&
                    currentOrder.order_type === orderTypeNames.sell &&
                    currentOrder.exchange_type === exchangeTypeNames.banking && <>

                        <Title mt='30px'>Комментарий:</Title>
                        <MenuItemWithoutFocus>
                            <Text>
                                {currentOrder.user_reciever_info.username}, мы получили оплату с Вашей стороны,
                                ожидайте пожалуйста перевода фиатных средств на Вашу карту.

                            </Text>
                        </MenuItemWithoutFocus>

                        <Title mt='30px'>Мои реквизиты::</Title>
                        <Text mb='8px' width='100%' size='18px' color='#99999A'>Или другие необходимые данные для
                            выполнения ордера.</Text>
                        <MenuItemWithoutFocus>
                            <Text>Номер карты:</Text>
                            <Text>{currentOrder.requisites.card_number}</Text>
                        </MenuItemWithoutFocus>

                        <MenuItemWithoutFocus>
                            <Text width='20%'>ФИО:</Text>
                            <Text width='80%'>{currentOrder.requisites.card_full_name}</Text>
                        </MenuItemWithoutFocus>

                    </>
                }

                {
                    currentOrder.exchange_type === exchangeTypeNames.banking &&
                    currentOrder.status === statusTypeNames.OrderComplete &&
                    currentOrder.order_type === orderTypeNames.sell && <>

                        <Title mt='30px'>Мои реквизиты:</Title>
                        <Text mb='8px' width='100%' size='18px' color='#99999A'>Или другие необходимые данные для выполнения
                            ордера.</Text>
                        <MenuItemWithoutFocus>
                            <Text>Номер карты:</Text>
                            <Text>{currentOrder.requisites.card_number}</Text>
                        </MenuItemWithoutFocus>

                        <MenuItemWithoutFocus>
                            <Text width='20%'>ФИО:</Text>
                            <Text width='80%'>{currentOrder.requisites.card_full_name}</Text>
                        </MenuItemWithoutFocus>

                        <MenuItemWithoutFocus mb='100px'>
                            <Flex direction='column'>
                                <Flex justify='space-between' mt='14px'>
                                    <Text>@username:</Text>
                                    <Text>{currentOrder.user_reciever_info.username}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px'>
                                    <Text>Телефон:</Text>
                                    <Text>{currentOrder.user_reciever_info.phone}</Text>
                                </Flex>

                                <Flex justify='space-between' mt='24px' mb='14px'>
                                    <Text>Имя:</Text>
                                    <Text>{currentOrder.user_reciever_info.full_name}</Text>
                                </Flex>
                            </Flex>
                        </MenuItemWithoutFocus>
                    </>
                }


                {/*{*/}
                {/*    (currentOrder && currentOrder.exchange_type === exchangeTypeNames.transfer) && */}
                {/*    */}
                {/*    <Flex direction='column' padding='0 15px 0 15px' justify='space-between'>*/}
                {/*        <ButtonToMain top='0px' left='8px' type='button' onClick={goToMain}>{translate('0010', lang)}</ButtonToMain>*/}

                {/*        <Thumb paddingtop='5px' paddingbottom='5px' background='#232e3c' justify='center' align='center'>*/}
                {/*            <Title size='20px' alignself='center'>Ордер № {currentOrder.order_id}</Title>*/}
                {/*        </Thumb>*/}

                {/*        <Flex direction='column'>*/}
                {/*            <Group direction='column'>*/}
                {/*                <Flex justify='space-between' mb='5px' align='center' direction='row'  background='#17212B'>*/}
                {/*                    <Text color='#d9d9d9'>Статус:</Text>*/}
                {/*                    <StatusText status={currentOrder.status}>{valueTranslate(currentOrder.status)}</StatusText>*/}
                {/*                </Flex>*/}

                {/*                <LineLong/>*/}

                {/*                <Flex mt='10px' justify='space-between' align='center' direction='row'  background='#17212B'>*/}
                {/*                    <Text color='#d9d9d9'>{translate("0091", lang)}</Text>*/}
                {/*                    <Text color='#ffffff' weight='500'>Перестановка</Text>*/}
                {/*                </Flex>*/}

                {/*                <LineLong/>*/}

                {/*                <Flex mt='10px' justify='space-between' align='center' direction='row'  background='#17212B'>*/}
                {/*                    <Text color='#d9d9d9'>{translate("0092", lang)}</Text>*/}
                {/*                    <Text color='#ffffff' weight='500'>{currentOrder.exchange_type}</Text>*/}
                {/*                </Flex>*/}
                {/*            </Group>*/}
                {/*        </Flex>*/}

                {/*        <Group direction='column'>*/}
                {/*            <Flex mb='10px' justify='space-between' align='center'>*/}
                {/*                <Text color='#d9d9d9'>{translate('0038', lang)}</Text>*/}
                {/*                <Text color='#ffffff'>{currentOrder.send_amount} {currentOrder.currency}</Text>*/}
                {/*            </Flex>*/}

                {/*            <LineLong/>*/}

                {/*            <Flex mt='10px' justify='space-between' align='center'>*/}
                {/*                <Text color='#d9d9d9'>{translate('0039', lang)}</Text>*/}
                {/*                <Text color='#ffffff'>{currentOrder.recieve_amount} {currentOrder.currency}</Text>*/}
                {/*                */}
                {/*            </Flex>*/}
                {/*        </Group>*/}

                {/*        <Title>{translate('0075', lang)}</Title>*/}

                {/*        */}
                {/*        {*/}
                {/*            currentOrder.user_creator_info && <Group direction='column' mt='3px'>*/}
                {/*        */}
                {/*            */}
                {/*                <Flex mb='10px'  justify='space-between' align='center'>*/}
                {/*                    <Text color='#d9d9d9'>{translate('0017', lang)}</Text>*/}
                {/*                    <Text color='#ffffff'>*/}
                {/*                        {*/}
                {/*                            currentOrder.user_creator_info.country*/}
                {/*                        }*/}
                {/*                    </Text>*/}
                {/*                </Flex>*/}

                {/*                <LineLong/>*/}

                {/*                <Flex mt='10px' mb='10px' justify='space-between' align='center'>*/}
                {/*                    <Text color='#d9d9d9'>{translate('0018', lang)}</Text>*/}
                {/*                    <Text color='#ffffff'>*/}
                {/*                        {*/}
                {/*                            currentOrder.user_creator_info.city*/}
                {/*                        }*/}
                {/*                    </Text>*/}
                {/*                </Flex>*/}

                {/*                <LineLong/>*/}

                {/*                <Flex mt='10px' mb='10px' justify='space-between' align='center'>*/}
                {/*                    <Text color='#d9d9d9'>{translate('0026', lang)}</Text>*/}
                {/*                    <Text color='#ffffff'>{currentOrder.user_creator_info.username}</Text>*/}
                {/*                </Flex>*/}

                {/*                <LineLong/>*/}

                {/*                <Flex mt='10px' mb='10px' justify='space-between' align='center'>*/}
                {/*                    <Text color='#d9d9d9'>{translate('0027', lang)}</Text>*/}
                {/*                    <Text color='#ffffff'>{currentOrder.user_creator_info.full_name}</Text>*/}
                {/*                </Flex>*/}

                {/*                <LineLong/>*/}

                {/*                <Flex mt='10px' mb='10px' justify='space-between' align='center'>*/}
                {/*                    <Text color='#d9d9d9'>Телефон</Text>*/}
                {/*                    <Text color='#ffffff'>{currentOrder.user_creator_info.phone}</Text>*/}
                {/*                </Flex>*/}

                {/*            </Group>*/}

                {/*        }*/}
                {/*        */}


                {/*        <Title>{translate('0076', lang)}</Title>*/}

                {/*        <Group direction='column' mt='3px'>*/}
                {/*            <Flex mb='10px' justify='space-between' align='center'>*/}
                {/*                <Text color='#d9d9d9'>{translate('0017', lang)}</Text>*/}
                {/*                <Text color='#ffffff'>{currentOrder.user_reciever_info.country}</Text>*/}
                {/*            </Flex>*/}

                {/*            <LineLong/>*/}

                {/*            <Flex mt='10px' mb='10px' justify='space-between' align='center'>*/}
                {/*                <Text color='#d9d9d9'>{translate('0018', lang)}</Text>*/}
                {/*                <Text color='#ffffff'>{currentOrder.user_reciever_info.city}</Text>*/}
                {/*            </Flex>*/}

                {/*            <LineLong/>*/}

                {/*            <Flex mb='10px' mt='10px' justify='space-between' align='center'>*/}
                {/*                <Text color='#d9d9d9'>{translate('0026', lang)}</Text>*/}
                {/*                <Text color='#ffffff'>{currentOrder.user_reciever_info.username}</Text>*/}
                {/*            </Flex>*/}

                {/*            <LineLong/>*/}

                {/*            <Flex mt='10px' mb='10px' justify='space-between' align='center'>*/}
                {/*                <Text color='#d9d9d9'>{translate('0027', lang)}</Text>*/}
                {/*                <Text color='#ffffff'>{currentOrder.user_reciever_info.full_name}</Text>*/}
                {/*            </Flex>*/}

                {/*            <LineLong/>*/}

                {/*            <Flex  mt='10px' mb='10px' justify='space-between' align='center'>*/}
                {/*                <Text color='#d9d9d9'>Телефон</Text>*/}
                {/*                <Text color='#ffffff'>{currentOrder.user_reciever_info.phone}</Text>*/}
                {/*            </Flex>*/}

                {/*            {*/}
                {/*                currentOrder.status === statusTypeNames.PaymentVerified && <Fragment>*/}
                {/*                    <LineLong/>*/}

                {/*                    <Flex  mt='10px' mb='10px' justify='space-between' align='center'>*/}
                {/*                        <Text color='#d9d9d9'>Информация от менеджера</Text>*/}
                {/*                        <Text color='#ffffff'>{currentOrder.escrow_info}</Text>*/}
                {/*                    </Flex>*/}
                {/*                </Fragment>*/}
                {/*            }*/}

                {/*        </Group>*/}


                {/*        <Flex>*/}

                {/*            {  */}
                {/*                currentOrder.status === statusTypeNames.PaymentPending  && <Flex>*/}
                {/*                    <CustomLink to={`/payment_buy/${order_id}`}>{translate('0079', lang)}</CustomLink>*/}
                {/*                </Flex>*/}
                {/*            }*/}

                {/*            {  */}
                {/*                currentOrder.status === statusTypeNames.PaymentVerified  && <Flex>*/}
                {/*                    <DefaultButton background={'tomato'} type='button' onClick={acceptPayment}>{translate('0080', lang)}</DefaultButton>*/}
                {/*                </Flex>*/}
                {/*            }*/}
                {/*            */}
                {/*            {*/}
                {/*                (currentOrder.status === statusTypeNames.OrderInitiated || currentOrder.status === statusTypeNames.OrderAccepted) && <Flex>*/}
                {/*                <DefaultButton background={'tomato'} type='button' onClick={discardOrder}>{translate('0077', lang)}</DefaultButton>*/}
                {/*            </Flex>*/}
                {/*            }*/}
                {/*        */}
                {/*        </Flex>*/}


                {/*    </Flex>*/}
                {/*}*/}


                {/*{(currentOrder && currentOrder.exchange_type !== exchangeTypeNames.transfer) && */}
                {/*    <Flex direction='column' style={{height: '100vh'}}>*/}


                {/*        <Flex align='center' justify='space-between'>*/}
                {/*            <NSBackButton onClick={goToMain}>{translate('0010', lang)}</NSBackButton>*/}
                {/*            <NSHelpButton />*/}
                {/*        </Flex>*/}

                {/*        /!*<ButtonToMain top='0px' left='8px' type='button' onClick={goToMain}>{translate('0010', lang)}</ButtonToMain>*!/*/}
                {/*    */}
                {/*        <Flex direction='column' padding='0 15px 0 15px'>*/}
                {/*            <Title alignself='center'>Ордер № {currentOrder.order_id}</Title>*/}

                {/*            <Group direction='column'>*/}
                {/*                <Flex justify='space-between' mb='5px' align='center' direction='row'  background='#17212B'>*/}
                {/*                    <Text color='#d9d9d9'>Статус:</Text>*/}
                {/*                    <StatusText status={currentOrder.status}>{valueTranslate(currentOrder.status)}</StatusText>*/}
                {/*                </Flex>*/}

                {/*                <LineLong/>*/}

                {/*                <Flex mt='10px' mb='10px' justify='space-between' align='center' direction='row'  background='#17212B'>*/}
                {/*                    <Text color='#d9d9d9'>{translate("0091", lang)}</Text>*/}
                {/*                    <Text color='#ffffff' weight='500'>{currentOrder.order_type === orderTypeNames.buy ? "Покупка" : "Продажа"}</Text>*/}
                {/*                </Flex>*/}

                {/*                <LineLong/>*/}

                {/*                <Flex mt='10px' justify='space-between' align='center' direction='row'  background='#17212B'>*/}
                {/*                    <Text color='#d9d9d9'>{translate("0092", lang)}</Text>*/}
                {/*                    <Text color='#ffffff' weight='500'>{*/}
                {/*                        currentOrder.exchange_type*/}
                {/*                    }</Text>*/}
                {/*                </Flex>*/}
                {/*            </Group>*/}


                {/*            <Group direction='column'>*/}
                {/*                <Flex mb='10px' justify='space-between' align='center'>*/}
                {/*                    <Text color='#d9d9d9'>{translate('0038', lang)}</Text>*/}
                {/*                    <Text color='#ffffff'>{currentOrder.send_amount} {cur1}</Text>*/}
                {/*                </Flex>*/}

                {/*                <LineLong/>*/}

                {/*                <Flex mt='10px' justify='space-between' align='center'>*/}
                {/*                    <Text color='#d9d9d9'>{translate('0039', lang)}</Text>*/}
                {/*                    <Text color='#ffffff'>{currentOrder.recieve_amount} {cur2}</Text>*/}
                {/*                    */}
                {/*                </Flex>*/}
                {/*            </Group>*/}

                {/*            {*/}

                {/*                currentOrder.exchange_type === exchangeTypeNames.cash && */}
                {/*                <Group direction='column'>*/}

                {/*                    <Flex mb='10px' justify='space-between' align='center'>*/}
                {/*                        <Text color='#d9d9d9'>{translate('0017', lang)}</Text>*/}
                {/*                        <Text color='#ffffff'>{currentOrder.country}</Text>*/}
                {/*                    </Flex>*/}

                {/*                    <LineLong/>*/}

                {/*                    <Flex mt='10px' justify='space-between' align='center'>*/}
                {/*                        <Text color='#d9d9d9'>{translate('0018', lang)}</Text>*/}
                {/*                        <Text color='#ffffff'>{currentOrder.city}</Text>*/}
                {/*                    </Flex>*/}
                {/*                </Group>*/}

                {/*            }*/}

                {/*            <Group direction='column'>*/}
                {/*                <Flex mb='10px' justify='space-between' align='center'>*/}
                {/*                    <Text color='#d9d9d9'>{translate('0026', lang)}</Text>*/}
                {/*                    <Text color='#ffffff'>{currentOrder.user_reciever_info.username}</Text>*/}
                {/*                </Flex>*/}

                {/*                <LineLong/>*/}

                {/*                <Flex mb='10px' mt='10px' justify='space-between' align='center'>*/}
                {/*                    <Text color='#d9d9d9'>Телефон</Text>*/}
                {/*                    <Text color='#ffffff'>{currentOrder.user_reciever_info.phone}</Text>*/}
                {/*                </Flex>*/}

                {/*                <LineLong/>*/}

                {/*                <Flex mt='10px' justify='space-between' align='center'>*/}
                {/*                    <Text color='#d9d9d9'>{translate('0027', lang)}</Text>*/}
                {/*                    <Text color='#ffffff'>{currentOrder.user_reciever_info.full_name}</Text>*/}
                {/*                </Flex>*/}
                {/*            </Group>*/}


                {/*            {currentOrder.order_type === orderTypeNames.buy && */}
                {/*                */}
                {/*                <Group direction='column' mb='10px'>*/}
                {/*                */}
                {/*                    <Flex justify='space-between' align='center' mb='10px'>*/}
                {/*                        <Text color='#d9d9d9'>{translate('0029', lang)}</Text>*/}
                {/*                        <Text color='#ffffff'>{currentOrder.requisites.chain_network}</Text>*/}
                {/*                    </Flex>*/}

                {/*                    <LineLong/>*/}

                {/*                    <Flex mt='10px' justify='space-between' align='center'>*/}
                {/*                        <Text color='#d9d9d9'>{translate('0030', lang)}</Text>*/}
                {/*                        <Text color='#ffffff'>{*/}
                {/*                            currentOrder.requisites.wallet_address.length > 14 */}
                {/*                            ? formaterLongString(currentOrder.requisites.wallet_address)*/}
                {/*                            : currentOrder.requisites.wallet_address*/}
                {/*                        }</Text>*/}
                {/*                    </Flex>*/}
                {/*                </Group>*/}
                {/*            }*/}

                {/*            {*/}
                {/*                (currentOrder.exchange_type === exchangeTypeNames.banking && currentOrder.order_type === orderTypeNames.sell) && */}
                {/*                <Group direction='column' mb='20px'>*/}
                {/*                */}
                {/*                    <Flex justify='space-between' align='center' mb='10px'>*/}
                {/*                        <Text color='#d9d9d9'>Банк</Text>*/}
                {/*                        <Text color='#ffffff'>{currentOrder.requisites.bank_name}</Text>*/}
                {/*                    </Flex>*/}

                {/*                    <LineLong/>*/}

                {/*                    <Flex mt='10px' justify='space-between' align='center'>*/}
                {/*                        <Text color='#d9d9d9'>Моя карта банка</Text>*/}
                {/*                        <Text color='#ffffff'>{currentOrder.requisites.card_number}</Text>*/}
                {/*                    </Flex>*/}
                {/*                </Group>*/}
                {/*            }*/}

                {/*            {  */}
                {/*             (currentOrder.escrow_info && */}
                {/*             currentOrder.exchange_type === exchangeTypeNames.cash &&*/}
                {/*             (currentOrder.status === statusTypeNames.InEscrow)) &&*/}
                {/*                <Group direction='column'> */}
                {/*                    <GroupLeftText ml='5px'>{translate('0053', lang)}</GroupLeftText>*/}
                {/*                    <Flex justify='flex-start' mt="10px">*/}
                {/*                        <CustomTextArea */}
                {/*                            ml='20px' */}
                {/*                            mt='0px' */}
                {/*                            align='start'  */}
                {/*                            value={currentOrder.order_type === orderTypeNames.sell */}
                {/*                                    ? currentOrder.escrow_info*/}
                {/*                                    : "Ожидайте получения средств"*/}
                {/*                                }*/}
                {/*                        />*/}
                {/*                    </Flex>*/}
                {/*                </Group>*/}
                {/*            }*/}

                {/*            {*/}
                {/*                (currentOrder.status === statusTypeNames.InEscrow && currentOrder.exchange_type === exchangeTypeNames.banking) && <Fragment>*/}
                {/*                    <Title alignself='start'>{translate('0053', lang)}</Title>*/}
                {/*                    <Group mt='0px' direction='column'> */}
                {/*                    */}
                {/*                        <Flex justify='flex-start'>*/}
                {/*                            <CustomTextArea mb='0px' mt='0px' align='start'  value={translate("0093", lang)}/>*/}
                {/*                        </Flex>*/}
                {/*                    </Group>*/}
                {/*                </Fragment>*/}
                {/*            }*/}
                {/*            */}
                {/*        </Flex>*/}

                {/*        <Flex>*/}
                {/*            {   */}
                {/*                (currentOrder.status === statusTypeNames.PaymentPending) && */}
                {/*                <Flex>*/}
                {/*                    {*/}
                {/*                        currentOrder.order_type === orderTypeNames.buy */}
                {/*                        ? <CustomLink to={`/payment_buy/${order_id}`}>{translate('0079', lang)}</CustomLink>*/}
                {/*                        : <CustomLink to={`/payment/${order_id}`}>{translate('0079', lang)}</CustomLink>*/}
                {/*                    }*/}
                {/*                    <DefaultButton background={'tomato'} type='button' onClick={discardOrder}>{translate('0077', lang)}</DefaultButton>*/}
                {/*                </Flex>*/}
                {/*            }*/}

                {/*        </Flex>*/}
                {/*        */}
                {/*        {  */}
                {/*            (currentOrder.status === statusTypeNames.OrderInitiated || currentOrder.status === statusTypeNames.OrderAccepted) && <Flex>*/}
                {/*                <DefaultButton background={'tomato'} type='button' onClick={discardOrder}>{translate('0077', lang)}</DefaultButton>*/}
                {/*            </Flex>*/}
                {/*        } */}

                {/*        {  */}
                {/*            (currentOrder.status === statusTypeNames.PaymentVerified) && <Flex>*/}
                {/*                <DefaultButton background={'tomato'} type='button' onClick={acceptPayment}>{translate('0080', lang)}</DefaultButton>*/}
                {/*            </Flex>*/}
                {/*        } */}
                {/*    </Flex>*/}
                {/*}*/}


            </Flex>

            <Flex style={{position: "absolute"}}>


                {
                    (currentOrder.status === statusTypeNames.OrderInitiated || currentOrder.status === statusTypeNames.OrderAccepted) &&
                    <MainGreyButton type='button' onClick={discardOrder}>
                        {translate('0077', lang)}
                    </MainGreyButton>
                }

                {
                    currentOrder.status === statusTypeNames.PaymentPending && <Flex justify='space-between'>
                        <MainGreyButton width='50%' onClick={discardOrder}>Отменить</MainGreyButton>
                        {
                            currentOrder.order_type === orderTypeNames.buy
                                ? <MainGoldButton width='50%' onClick={() => navigate(`/payment_buy/${order_id}`)}>Перейти к
                                    оплате</MainGoldButton>
                                : <MainGoldButton width='50%' onClick={() => navigate(`/payment/${order_id}`)}>Перейти к
                                    оплате</MainGoldButton>
                        }
                    </Flex>

                }

                {
                    currentOrder.status === statusTypeNames.PaymentVerified && !isShowModal &&
                    <MainGoldButton onClick={acceptPayment}>Я получил</MainGoldButton>

                }

                {
                    currentOrder.status === statusTypeNames.OrderComplete &&
                    <MainGoldButton onClick={() => navigate('https://t.me/PROS100K_support')}>
                        Оставить отзыв
                    </MainGoldButton>
                }


            </Flex>


        </Flex>
        }

        {
            isShowModal && <SuccessModal orderId={order_id}/>
        }

    </ResponsiveContainer>
}


export default Order



