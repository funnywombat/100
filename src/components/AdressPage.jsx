import React, {useState, useEffect, Fragment} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {getOrderById, setUserIsPaid, getBankNames} from '../api/api'
import {changeIsLoaderVisible} from '../store/orderSlice'
import {useDispatch, useSelector} from 'react-redux'
import {useTelegram} from "../hooks/useTelegram";
import {exchangeTypeNames, orderTypeNames, valueTranslate} from "../common/enums"
import {translate} from '../translater/translater'

import Notiflix from 'notiflix'
import Loader from './Loader'

import Text from './styledComponent/Text'
import Flex from './styledComponent/Flex'
import Title from './styledComponent/Title'
import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import GradientContainer from "./newStyledComponents/GradientContainer";
import GoldTextNS from "./newStyledComponents/GoldText";
import GradientMenuItem from "./newStyledComponents/GradientMenuItem";
import DoubleMenuItemHorizontal from "./newStyledComponents/DoubleMenuItemHorizontal";
import MenuItemShort from "./newStyledComponents/MenuItemShort";
import MenuItemWithoutFocus from "./newStyledComponents/MenuItemWithoutFocus";
import ButtonRounded from "./styledComponent/ButtonRounded";
import CustomTextArea from "./styledComponent/CustomTextArea";
import ResponsiveContainer from './styledComponent/ResponsiveContainer'

const AdressPage = (props) => {

    const [currentOrder, setCurrentOrder] = useState(null)
    const [currentBank, setCurrentBank] = useState({})
    let [fiatChar, setFiatChar] = useState("")

    const {order_id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const lang = useSelector(state => state.order.lang)
    const {backButton} = useTelegram()
    const isLoading = useSelector(state => state.order.isLoaderVisible)

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


    useEffect(() => {
        async function getOrder() {
            dispatch(changeIsLoaderVisible(true))
            await getOrderById(order_id)
                .then(data => setCurrentOrder(data))
                .finally(() => {
                    dispatch(changeIsLoaderVisible(false))
                })
        }

        getOrder()

    }, [order_id, dispatch])


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


    function goToMain() {
        navigate('/')
    }


    const payOrder = async () => {

        await setUserIsPaid(order_id)
        Notiflix.Notify.success('Статус заявки успешно изменён')
        navigate('/')
    }

    const gotoTransferOrder = async () => {
        navigate(`/order/${order_id}`)
    }

    if (isLoading) {
        return <Loader />
    }



    return <Fragment>

        {/*{*/}
        {/*    (!_isEmpty(currentOrder) && currentOrder.exchange_type === exchangeTypeNames.transfer) && <Flex direction='column' padding='0px 15px 0px 15px'>*/}

        {/*        <ButtonToMain top='0px' left='8px' type='button' onClick={goToMain}>{translate('0010', lang)}</ButtonToMain>*/}
        {/*        <Thumb paddingtop='5px' paddingbottom='5px' background='#232e3c' justify='center' align='center'>*/}
        {/*            <Title alignself='center'>Ордер № {currentOrder.order_id}</Title>*/}
        {/*        </Thumb>*/}

        {/*        <CashGroup style={{marginTop: '10px'}}>*/}

        {/*            <Flex justify='space-between' padding='10px 0px 10px 0px'>*/}
        {/*                <GroupLeftText>{translate('0051', lang)}</GroupLeftText>*/}
        {/*                <Flex justify='flex-end' style={{marginRight: '20px'}}>*/}
        {/*                    <Text>{currentOrder.user_creator_info.country}</Text>*/}
        {/*                    <Text style={{marginLeft: '4px'}}>({currentOrder.user_creator_info.city})</Text>*/}
        {/*                </Flex>*/}
        {/*            </Flex>*/}

        {/*            <LineLong />*/}

        {/*            <Flex justify='space-between' padding='10px 0px 10px 0px'>*/}
        {/*                <GroupLeftText>{translate('0052', lang)}</GroupLeftText>*/}
        {/*                <Flex justify='flex-end' style={{marginRight: '20px'}}>*/}
        {/*                    <Text>{currentOrder.send_amount}</Text>*/}
        {/*                    <Text style={{marginLeft: '4px'}}>{currentOrder.currency}</Text>*/}
        {/*                </Flex>*/}

        {/*            </Flex>*/}

        {/*            {*/}
        {/*                currentOrder.escrow_info && <Flex direction='column' >*/}
        {/*                    <LineLong />*/}

        {/*                    <GroupLeftText ml='40px' style={{marginTop: '10px', marginBottom: '10px'}}>{translate('0053', lang)}</GroupLeftText>*/}
        {/*                    <Flex justify='flex-start'>*/}
        {/*                        <CustomTextArea ml='20px' mt='0px' alignSelf='start'>{currentOrder.escrow_info}</CustomTextArea>*/}
        {/*                    </Flex>*/}
        {/*                </Flex>*/}
        {/*            } */}

        {/*        </CashGroup>*/}

        {/*        <DefaultButton background='#47a447' style={{borderRadius: '10px'}} onClick={payOrder}>{translate('0054', lang)}</DefaultButton>*/}
        {/*        <Flex align='center' justify='center'>*/}
        {/*            <Text size="11px" style={{opacity: "0,7"}}> {translate('0058', lang)}</Text>*/}
        {/*        </Flex>*/}

        {/*        <GroupLeftText size='16px' style={{marginTop: '20px'}}>{translate('0055', lang)}</GroupLeftText>*/}
        {/*        <CashGroup>*/}

        {/*            <Flex justify='space-between' padding='10px 0px 10px 0px'>*/}
        {/*                <GroupLeftText>{translate('0056', lang)}</GroupLeftText>*/}
        {/*                <Flex justify='flex-end' style={{marginRight: '20px'}}>*/}
        {/*                    <Text>{currentOrder.user_reciever_info.country}</Text>*/}
        {/*                    <Text style={{marginLeft: '4px'}}>({currentOrder.user_reciever_info.city})</Text>*/}
        {/*                </Flex>*/}
        {/*            </Flex>*/}

        {/*            <LineLong />*/}

        {/*            <Flex justify='space-between' padding='10px 0px 10px 0px'>*/}
        {/*                <GroupLeftText>{translate('0057', lang)}</GroupLeftText>*/}
        {/*                <Flex justify='flex-end' style={{marginRight: '20px'}}>*/}
        {/*                    <Text>{currentOrder.recieve_amount}</Text>*/}
        {/*                    <Text style={{marginLeft: '4px'}}>{currentOrder.currency}</Text>*/}
        {/*                </Flex>*/}

        {/*            </Flex>*/}

        {/*        </CashGroup>*/}
        {/*        <DefaultButton style={{borderRadius: '10px', marginBottom: '10px'}} onClick={gotoTransferOrder}>{translate('0059', lang)}</DefaultButton>*/}
        {/*            */}
        {/*    </Flex>*/}
        {/*}*/}

        {(currentOrder !== null && currentOrder.exchange_type !== exchangeTypeNames.transfer) &&
            <ResponsiveContainer direction='column' padding='20px'>

                <Flex align='center' mb='34px' justify='space-between'>
                    <NSBackButton onClick={goToMain}>{translate('0010', lang)}</NSBackButton>
                    <NSHelpButton/>
                </Flex>

                <GradientContainer>
                    <Flex justify='space-between'>
                        <Text>{currentOrder.exchange_type === exchangeTypeNames.cash ? "Наличный" : "Безналичный"} ордер</Text>
                        <GoldTextNS>2954</GoldTextNS>
                    </Flex>

                    <Flex justify='space-between' mt='12px'>
                        <Text>Статус:</Text>
                        <Text size='18px' color='#7A7A7A' >Страница оплаты</Text>
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
                        <Text>Офис:</Text>
                        <DoubleMenuItemHorizontal text1={currentOrder.country} text2={currentOrder.city}/>
                    </Flex>
                    }

                    {currentOrder.exchange_type === exchangeTypeNames.banking &&
                        <Flex justify='space-between' mt='10px'>
                            <Text>Банк:</Text>
                            <MenuItemShort text={currentBank.cardName}/>
                        </Flex>
                    }

                </GradientContainer>

                {
                    currentOrder.exchange_type === exchangeTypeNames.cash && <>
                        <Title mt="34px">Информация для оплаты:</Title>
                        <Text size="16px" color="#99999A" aligntext="start">Или другие необходимые данные</Text>
                        <Text size="16px" color="#99999A" aligntext="start" mb="14px">для выполнения ордера.</Text>

                        {
                            currentOrder.escrow_info && <>
                                <MenuItemWithoutFocus>
                                    <Text width='100%' align='center'>{currentOrder.escrow_info}</Text>
                                </MenuItemWithoutFocus>

                                <Title mt='30px' mb='10px'>Адрес кошелька:</Title>
                                <MenuItemWithoutFocus>
                                    <CustomTextArea mt='0px' mb='0px' col="2" value={currentOrder.requisites.wallet_address} readOnly/>
                                </MenuItemWithoutFocus>
                            </>
                        }

                        <ButtonRounded onClick={payOrder} mt='34px' mb='34px'>{translate('0054', lang)}</ButtonRounded>

                        <Text width='100%' align='center' size='18px' color='#99999A'>
                            Нажатие отправит уведомление менеджеру, что Вы внесли средства по адресу и коду
                            который указан в поле "информация для оплаты". Не нажимайте кнопку "Я оплатил"
                            если Вы ещё не внесли средства в кассу.
                        </Text>

                    </>
                }

                {
                    currentOrder.exchange_type === exchangeTypeNames.banking && <>
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

                        <ButtonRounded onClick={payOrder} mt='34px' mb='34px'>{translate('0054', lang)}</ButtonRounded>

                        <Text width='100%' align='center' size='19px' color='#99999A'>
                            Нажатие отправит уведомление менеджеру, что Вы осуществили перевод
                            на указанные реквизиты. Не нажимайте кнопку "Я оплатил", если
                            перевод не был выполнен.
                        </Text>

                    </>
                }

            </ResponsiveContainer>
        }

    </Fragment>
}

export default AdressPage