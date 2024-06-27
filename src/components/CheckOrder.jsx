import React, {Fragment, useEffect, useState} from 'react'
import {useTelegram} from '../hooks/useTelegram'
import {createOrder} from '../api/api'
import {useNavigate} from 'react-router-dom'
import {formaterLongString} from '../common/formaterLongString'

import Notiflix from 'notiflix'

import Flex from './styledComponent/Flex'
import Title from './styledComponent/Title'
import Text from './styledComponent/Text'

import {changeIsLoaderVisible, setFullNameToState} from "../store/orderSlice";
import {useDispatch, useSelector} from "react-redux"
import {translate} from "../translater/translater"
import Loader from './Loader'


import {exchangeTypeNames, orderTypeNames} from "../common/enums"
import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import GradientContainer from "./newStyledComponents/GradientContainer";
import GradientMenuItem from "./newStyledComponents/GradientMenuItem";
import DoubleMenuItemHorizontal from "./newStyledComponents/DoubleMenuItemHorizontal";
import MenuItemShort from "./newStyledComponents/MenuItemShort";
import MenuItemWithoutFocus from "./newStyledComponents/MenuItemWithoutFocus";
import MainGoldButton from "./newStyledComponents/MainGoldButton";
import MainGreyButton from "./newStyledComponents/MainGreyButton";
import GroupLeftText from "./styledComponent/GroupLeftText";
import GoldTextNS from "./newStyledComponents/GoldText";
import DividerNS from "./newStyledComponents/DividerNS";
import CustomTextArea from "./styledComponent/CustomTextArea";
import ResponsiveContainer from "./styledComponent/ResponsiveContainer"

const CheckOrder = (props) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const lang = useSelector(state => state.order.lang)
    const isLoading = useSelector(state => state.order.isLoaderVisible)
    const {backButton, queryId} = useTelegram()

    let [fiatChar, setFiatChar] = useState("")

    useEffect(() => {
        if (props.order.fiatCurrency === 'UAH') {
            setFiatChar("₴")
        } else if (props.order.fiatCurrency === 'USD') {
            setFiatChar("$")
        } else if (props.order.fiatCurrency === 'EUR') {
            setFiatChar("€")
        }
    }, [])


    /*
    * Обработчик кнопки Назад
    **/
    useEffect(() => {
        backButton.show()
        backButton.onClick(() => {
            props.order.exchangeType === exchangeTypeNames.cash
            ? navigate('/form')
            : navigate('/formByCard')
        })
        return () => {
            backButton.offClick(() => {
                props.order.exchangeType === exchangeTypeNames.cash
                ? navigate('/form')
                : navigate('/formByCard')
            })
        }
    }, [backButton])

    const [walletValue, setWalletValue] = useState('')

    useEffect(() => {
        console.log(props.order);
        if (props.order.wallet) {

            if (props.order.wallet.length > 14) {
                setWalletValue(formaterLongString(props.order.wallet))
            } else {
                setWalletValue(props.order.wallet)
            }
        }

    }, [props.order])


    const gotoEdit = () => {
        props.setOrder(props.order)

        switch (props.order.exchangeType) {

            case exchangeTypeNames.transfer: {
                return navigate('/permutations')
            }

            case exchangeTypeNames.banking: {
                return navigate('/formByCard')
            }

            default: {
                return navigate('/form')
            }
        }
    }

    async function createCurrentOrder() {




        dispatch(changeIsLoaderVisible(true))
        let orderToSend = {};

        if (props.order) {

            if (props.order.exchangeType === exchangeTypeNames.transfer) {

                orderToSend = {
                    "currency": props.order.fiatCurrency,
                    "exchange_type": exchangeTypeNames.transfer,
                    "send_amount": props.order.amount,
                    "recieve_amount": props.order.calcAmount,
                    "additional_info": {
                        "exchange_rate": props.order.exchangeRate,
                    },
                    "user_creator_info": {
                        "country": props.order.senderCountry,
                        "city": props.order.senderCity,
                        "phone": props.order.senderPhone,
                        "full_name": props.order.senderName,
                        "username": props.order.user,
                    },
                    "user_reciever_info": {
                        "country": props.order.recieverCountry,
                        "city": props.order.recieverCity,
                        "username": props.order.recieverUsername,
                        "phone": props.order.recieverPhone,
                        "full_name": props.order.recieverName
                    },
                }


            } else if (props.order.exchangeType === exchangeTypeNames.banking) {


                orderToSend = {

                    "order_type": props.order.operationType,
                    "currencies": {
                        "currency_1": props.order.currency,
                        "currency_2": props.order.fiatCurrency,
                    },
                    "exchange_rate": props.order.exchangeRate,
                    "exchange_type": exchangeTypeNames.banking,
                    "send_amount": props.order.amount,
                    "recieve_amount": props.order.calcAmount,
                    "user_reciever_info": {
                        "username": props.order.user,
                        "phone": props.order.phone,
                        "full_name": props.order.name,
                    },
                    "requisites": {
                        "card_full_name": props.order.fullName,
                        "bank_name": props.order.bank,
                        "card_number": props.order.cardNumber || null,
                        "chain_network": props.order.transferNetwork,
                        "wallet_address": props.order.wallet,
                    }
                }
            } else {

                orderToSend = {

                    "order_type": props.order.operationType,
                    "currencies": {
                        "currency_1": props.order.currency,
                        "currency_2": props.order.fiatCurrency,
                    },
                    "exchange_rate": props.order.exchangeRate,
                    "exchange_type": exchangeTypeNames.cash,
                    "country": props.order.country,
                    "city": props.order.city,
                    "send_amount": props.order.amount,
                    "recieve_amount": props.order.calcAmount,
                    "user_reciever_info": {
                        "username": props.order.user,
                        "phone": props.order.phone,
                        "full_name": props.order.name,
                    },
                    "requisites": {
                        "chain_network": props.order.transferNetwork,
                        "wallet_address": props.order.wallet,
                    }
                }

            }

            if (orderToSend.exchange_type === exchangeTypeNames.transfer && props.order.comment) {
                orderToSend.additional_info = {
                    "comment": props.order.comment
                }
            }




            console.log('order to send', orderToSend)

            let result = await createOrder(orderToSend);


            if (result.status === 201) {
                Notiflix.Notify.success('Заявка успешно создана')
                navigate('/')
            } else {
                Notiflix.Notify.failure('Ошибка создания ордера!')
                console.log('result', result)
            }

            dispatch(changeIsLoaderVisible(false))


        }
    }

    const gotoMain = () => {
        return navigate('/')
    }

    if (isLoading) {
        return <Loader />
    }


    return <ResponsiveContainer direction='column' padding='20px 20px 70px 20px'>

        <>

            <Flex align='center' justify='space-between'>
                <NSBackButton onClick={gotoMain}>{translate('0010', lang)}</NSBackButton>
                <NSHelpButton/>
            </Flex>

            <Title alignself='center' mt='22px' mb='22px'>{translate('0037', lang)}</Title>

            {
                props.order.exchangeType === exchangeTypeNames.transfer

                    ? <>
                        <GradientContainer>
                            <Flex justify='space-between'>
                                <Text>Валюта</Text>
                                <MenuItemShort text={props.order.fiatCurrency}/>
                            </Flex>

                            <Flex justify='space-between' mt='24px' mb='14px'>
                                <Text>Комиссия</Text>
                                <GoldTextNS>{props.order.course}</GoldTextNS>
                            </Flex>

                            <DividerNS/>

                            <Flex justify='space-between' mt='14px'>
                                <Text>Курс</Text>
                                <GoldTextNS>{props.order.exchangeRate}</GoldTextNS>
                            </Flex>

                            <Flex mt='24px' justify='space-between' style={{gap: '20px'}}>

                                <Flex direction='column'>
                                    <Text>Отправлено {`(${props.order.fiatCurrency})`}</Text>
                                    <DividerNS style={{marginTop: '8px', marginBottom: '8px'}}/>
                                    <Text>{props.order.amount}</Text>
                                </Flex>



                                <Flex direction='column'>
                                    <Text>Получено {`(${props.order.fiatCurrency})`}</Text>
                                    <DividerNS style={{marginTop: '8px', marginBottom: '8px'}} />
                                    <Text>{props.order.calcAmount}</Text>
                                </Flex>

                            </Flex>


                        </GradientContainer>

                        <Title mt='34px' mb='4px'>КОНТАКТЫ ОТПРАВИТЕЛЯ</Title>
                        <GradientContainer>
                            <Flex justify='space-between' mt='8px' mb='8px'>
                                <GroupLeftText>{translate('0017', lang)}</GroupLeftText>
                                <Text>{props.order.senderCountry}</Text>
                            </Flex>

                            <Flex justify='space-between' mt='8px' mb='8px'>
                                <GroupLeftText>{translate('0018', lang)}</GroupLeftText>
                                <Text>{props.order.senderCity}</Text>
                            </Flex>


                            <Flex justify='space-between' mt='8px' mb='8px'>
                                <GroupLeftText>
                                    Telegram
                                </GroupLeftText>
                                <Text>{props.order.user}</Text>
                            </Flex>


                            <Flex justify='space-between' mt='8px' mb='8px'>
                                <GroupLeftText>Телефон</GroupLeftText>
                                <Text>{props.order.senderPhone}</Text>
                            </Flex>


                            <Flex justify='space-between' mt='8px' mb='8px'>
                                <GroupLeftText>{translate('0034', lang)}</GroupLeftText>
                                <Text>{props.order.senderName}</Text>
                            </Flex>

                        </GradientContainer>


                        <Title mt='24px' mb='4px'>КОНТАКТЫ ПОЛУЧАТЕЛЯ</Title>
                        <GradientContainer>
                            <Flex justify='space-between'>
                                <GroupLeftText>{translate('0017', lang)}</GroupLeftText>
                                <Text>{props.order.recieverCountry}</Text>
                            </Flex>

                            <Flex justify='space-between' mt='8px' mb='8px'>
                                <GroupLeftText>{translate('0018', lang)}</GroupLeftText>
                                <Text>{props.order.recieverCity}</Text>
                            </Flex>

                            <Flex justify='space-between' mt='8px' mb='8px'>
                                <Text width='100%'>Telegram</Text>
                                <Text>{props.order.recieverUsername}</Text>
                            </Flex>

                            <Flex justify='space-between' mt='8px' mb='8px'>
                                <GroupLeftText>Телефон</GroupLeftText>
                                <Text>{props.order.recieverPhone}</Text>

                            </Flex>

                            <Flex justify='space-between' mt='8px' mb='8px'>
                                <GroupLeftText>{translate('0034', lang)}</GroupLeftText>
                                <Text>{props.order.recieverName}</Text>
                            </Flex>

                        </GradientContainer>

                        {
                            props.order.comment && <>
                                <Title mt='24px' mb='4px'>Комментарий:</Title>
                                <MenuItemWithoutFocus>

                                    <Text>{props.order.comment}</Text>
                                </MenuItemWithoutFocus>
                            </>
                        }
                    </>

                    : <>
                        <Title>{props.order.exchangeType === exchangeTypeNames.cash ? "Наличный" : "Безналичный"} ордер:</Title>

                        <GradientContainer>
                            <Flex justify='space-between'>
                                <Flex direction='column'>
                                    <Text aligntext='start'>Курс:</Text>
                                    <Text aligntext='start'>{props.order.exchangeRate}</Text>
                                </Flex>

                                <GradientMenuItem>{props.order.operationType === orderTypeNames.buy ? 'Покупка' : 'Продажа'}</GradientMenuItem>
                            </Flex>

                            <Flex justify='flex-end' mt='5px' style={{gap: '30px'}}>
                                <Text>Отдаю:</Text>
                                <Text>Получаю:</Text>
                            </Flex>

                            <Flex justify='space-between' mt='5px'>
                                <Text>Валюта:</Text>
                                {props.order.operationType === orderTypeNames.buy
                                    ? <DoubleMenuItemHorizontal text1={props.order.fiatCurrency + fiatChar}
                                                                text2={props.order.currency + " " + props.order.transferNetwork}/>
                                    : <DoubleMenuItemHorizontal text1={props.order.currency + " " + props.order.transferNetwork}
                                                                text2={props.order.fiatCurrency + fiatChar}/>
                                }

                            </Flex>

                            <Flex justify='space-between' mt='10px'>
                                <Text>Сумма:</Text>
                                <DoubleMenuItemHorizontal text1={props.order.amount} text2={props.order.calcAmount}/>
                            </Flex>

                            {props.order.exchangeType === exchangeTypeNames.cash && <Flex justify='space-between' mt='10px'>
                                <Text>Офис</Text>
                                <DoubleMenuItemHorizontal text1={props.order.country} text2={props.order.city}/>
                            </Flex>
                            }


                            {props.order.exchangeType === exchangeTypeNames.banking && <Flex justify='space-between' mt='10px'>
                                <Text>Банк:</Text>
                                <MenuItemShort text={props.order.bank}/>
                            </Flex>
                            }

                            {props.order.cardNumber &&
                                <Flex justify='space-between' mt='10px'>
                                    <Text>Банк:</Text>
                                    <MenuItemShort text={props.order.cardNumber}/>
                                </Flex>
                            }


                        </GradientContainer>

                        <Flex direction='column'>
                            <Title mt="34px">Реквизиты:</Title>
                            <Text size="16px" color="#99999A" aligntext="start">Или другие необходимые данные</Text>
                            <Text size="16px" color="#99999A" aligntext="start" mb="14px">для выполнения ордера.</Text>
                        </Flex>

                        {
                            props.order.operationType === orderTypeNames.buy && <>
                                 <Title mb='10px'>Адрес кошелька</Title>
                                <MenuItemWithoutFocus>
                                    <CustomTextArea mt='0px' mb='0px' col="2" value={props.order.wallet} readonly/>
                                </MenuItemWithoutFocus>
                            </>

                        }

                        {
                            ( props.order.operationType === orderTypeNames.sell && props.order.exchangeType === exchangeTypeNames.banking) && <>
                                <MenuItemWithoutFocus>
                                    <Text>Номер карты:</Text>
                                    <Text>{props.order.cardNumber}</Text>
                                </MenuItemWithoutFocus>

                                <MenuItemWithoutFocus>
                                    <Text>ФИО:</Text>
                                    <Text>{props.order.fullName}</Text>
                                </MenuItemWithoutFocus>

                            </>
                        }


                        <MenuItemWithoutFocus>
                            <Flex direction='column'>
                                <Flex justify='space-between' mt='14px' mb='24px'>
                                    <Text>@username</Text>
                                    <Text>{props.order.user}</Text>
                                </Flex>

                                <Flex justify='space-between' mb='24px'>
                                    <Text>Телефон</Text>
                                    <Text>{props.order.phone}</Text>
                                </Flex>

                                <Flex justify='space-between' mb='14px'>
                                    <Text>Имя</Text>
                                    <Text>{props.order.name}</Text>
                                </Flex>
                            </Flex>
                        </MenuItemWithoutFocus>

                    </>
            }




            {/*{*/}
            {/*    exchangeType === exchangeTypeNames.transfer */}
            {/*    ? <Flex direction='column' align='flex-start'>*/}

            {/*        <Group direction='column'>*/}

            {/*            <Flex mb='10px' mt='10px' align='center' justify='space-between'>*/}
            {/*                <Text>{translate('0038', lang)}</Text>*/}
            {/*                <Text>{props.order.amount + " " + props.order.fiatCurrency}</Text>*/}
            {/*            </Flex>*/}
            {/*            */}
            {/*            <LineLong/>*/}

            {/*            <Flex mt='10px' align='center' justify='space-between'>*/}
            {/*                <Text>{translate('0039', lang)}</Text>*/}
            {/*                <Text>{props.order.calcAmount + " " + props.order.fiatCurrency}</Text>*/}
            {/*            </Flex>*/}
            {/*            */}
            {/*        </Group>       */}


            {/*        <GreyTitle>{translate('0040', lang)}</GreyTitle>*/}
            {/*        <Group mt='5px' mb='5px' direction='column'>*/}

            {/*            <Flex mb='10px' align='center' justify='space-between'>*/}
            {/*                <Text>{translate('0041', lang)}</Text>*/}
            {/*                <Text>{props.order.user}</Text>*/}
            {/*            </Flex>*/}

            {/*            <LineLong/>*/}

            {/*            <Flex mt='10px' mb='10px' align='center' justify='space-between'>*/}
            {/*                <Text>{translate('0017', lang)}</Text>*/}
            {/*                <Text>{props.order.senderCountry}</Text>*/}
            {/*            </Flex>*/}

            {/*            <LineLong/>*/}

            {/*            <Flex mt='10px' align='center' justify='space-between'>*/}
            {/*                <Text>{translate('0018', lang)}</Text>*/}
            {/*                <Text>{props.order.senderCity}</Text>*/}
            {/*            </Flex>*/}

            {/*            <LineLong/>*/}

            {/*            <Flex mt='10px' mb='10px' align='center' justify='space-between'>*/}
            {/*                <Text>{translate('0042', lang)}</Text>*/}
            {/*                <Text>{props.order.senderPhone}</Text>*/}
            {/*            </Flex>*/}

            {/*            <LineLong/>*/}

            {/*            <Flex mt='10px' align='center' justify='space-between'>*/}
            {/*                <Text>{translate('0043', lang)}</Text>*/}
            {/*                <Text>{props.order.senderName}</Text>*/}
            {/*            </Flex>*/}

            {/*        </Group>*/}


            {/*        <GreyTitle>{translate('0044', lang)}</GreyTitle>*/}
            {/*        <Group mb='5px' mt='5px' direction='column'>*/}

            {/*            <Flex mb='10px' align='center' justify='space-between'>*/}
            {/*                <Text>{translate('0045', lang)}</Text>*/}
            {/*                <Text>{props.order.recieverUsername}</Text>*/}
            {/*            </Flex>*/}

            {/*            <LineLong/>*/}

            {/*            <Flex mt='10px' mb='10px' align='center' justify='space-between'>*/}
            {/*                <Text>{translate('0017', lang)}</Text>*/}
            {/*                <Text>{props.order.recieverCountry}</Text>*/}
            {/*            </Flex>*/}

            {/*            <LineLong/>*/}

            {/*            <Flex mt='10px' align='center' justify='space-between'>*/}
            {/*                <Text>{translate('0018', lang)}</Text>*/}
            {/*                <Text>{props.order.recieverCity}</Text>*/}
            {/*            </Flex>*/}

            {/*            <LineLong/>*/}

            {/*            <Flex mt='10px' mb='10px' align='center' justify='space-between'>*/}
            {/*                <Text>{translate('0046', lang)}</Text>*/}
            {/*                <Text>{props.order.recieverPhone}</Text>*/}
            {/*            </Flex>*/}

            {/*            <LineLong/>*/}

            {/*            <Flex mt='10px' align='center' justify='space-between'>*/}
            {/*                <Text>{translate('0047', lang)}</Text>*/}
            {/*                <Text>{props.order.recieverName}</Text>*/}
            {/*            </Flex>*/}

            {/*        </Group>*/}

            {/*        {*/}
            {/*            props.order.comment && <Group>*/}
            {/*                <Flex align='center' justify='space-between'>*/}
            {/*                    <Text>{translate('0036', lang)}</Text>*/}
            {/*                    <Text>{props.order.comment}</Text>*/}
            {/*                </Flex>*/}
            {/*            </Group>*/}
            {/*        }*/}
            {/*    */}
            {/*     </Flex>*/}


        </>

        <Flex mt='40px' justify='flex-start'>
            <MainGreyButton width='50%' type='button' style={{background: '#1C1C1E'}}
                            onClick={gotoEdit}>Редактировать</MainGreyButton>
            <MainGoldButton width='50%' type='button' onClick={createCurrentOrder}>Создать ордер</MainGoldButton>
        </Flex>
    </ResponsiveContainer>
}


export default CheckOrder