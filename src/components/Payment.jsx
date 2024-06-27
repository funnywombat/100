import React, { useState, useEffect, useCallback, Fragment } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getOrderById, setUserIsPaid } from '../api/api'
import { useClipboard } from "use-clipboard-copy"
import Flex from "./styledComponent/Flex"
import Text from "./styledComponent/Text"
import CustomTextArea from "./styledComponent/CustomTextArea"
import QRCodeThumb from "./styledComponent/QRCodeThumb"
import Notiflix from 'notiflix'
import LiveQRCode from "./live-qr-code"

import { changeIsLoaderVisible } from "../store/orderSlice";
import { useDispatch, useSelector } from "react-redux"

import { translate } from '../translater/translater'
import Loader from './Loader'
import {exchangeTypeNames, orderTypeNames, valueTranslate} from "../common/enums"
import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import GradientContainer from "./newStyledComponents/GradientContainer";
import GoldTextNS from "./newStyledComponents/GoldText";
import ButtonRounded from "./styledComponent/ButtonRounded";
import ResponsiveContainer from "./styledComponent/ResponsiveContainer"

const Payment = (props) => {

    let theme = useSelector(state => state.order.theme)

    const clipboard = useClipboard()




    const navigate = useNavigate()
    const {order_id} = useParams()
    const [currentOrder, setCurrentOrder] = useState(null)
    const [networkValue, setNetworkValue] = useState('')
    const [qrCodeValue, setQrCodeValue] = useState('')
    const lang = useSelector(state => state.order.lang)
    
    const dispatch = useDispatch()

    const warningMessage1 = translate('0064', lang)
    const warningMessage2 = translate('0065', lang)
    const adressTitle = translate('0066', lang)
    const isLoading = useSelector(state => state.order.isLoaderVisible)

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

    }, [order_id])


    useEffect(() => {
        if (currentOrder !== null) {

            if (currentOrder.exchange_type === exchangeTypeNames.transfer) {
                return navigate('/')
            }

            if (currentOrder.order_type === orderTypeNames.buy) {
                return navigate(`/order/${currentOrder.order_id}`)
            }

            let network = currentOrder.requisites.chain_network
            let adress = currentOrder.invoice_data.address
            let amount = currentOrder.send_amount
            let formattedValue = ''

            if (network === 'BTC') {
                formattedValue = `bitcoin:${adress}?amount=${amount}`
                setQrCodeValue(formattedValue)
                setNetworkValue('')
            } else if (network === 'ETH') {
                let wei = amount * 100000000000000
                formattedValue = `ethereum:${adress}?value=${wei}`
                setQrCodeValue(formattedValue)
                setNetworkValue(currentOrder.requisites.chain_network)
            } else {
                setQrCodeValue(adress)
                setNetworkValue(currentOrder.requisites.chain_network)
            }

        }
            
    }, [currentOrder])


    const copy = useCallback(
        () => {
          const address = currentOrder.invoice_data.address

          if (address) {
            clipboard.copy(address)
            const message = translate('0060', lang)
            Notiflix.Notify.success(message)
          }

        },
        [clipboard, currentOrder]
    );



    const payOrder = async () => {
        
        await setUserIsPaid(order_id)
        const message = translate('0061', lang)
        Notiflix.Notify.success(message)
        navigate('/')
    }


    if (isLoading) {
        return <Loader />
    }

    return <ResponsiveContainer direction='column'>

        {
            currentOrder !== null && <Flex direction='column' padding='20px'>

                <Flex align='center' justify='space-between' mb='34px'>
                    <NSBackButton onClick={() => navigate(`/order/${currentOrder.order_id}`)}>{translate('0010', lang)}</NSBackButton>
                    <NSHelpButton/>
                </Flex>

                <GradientContainer>
                    <Flex justify='space-between'>
                        <Text>{currentOrder.exchange_type === exchangeTypeNames.cash ? 'Наличный' : 'Безналичный'} Ордер</Text>
                        <GoldTextNS>2954</GoldTextNS>
                    </Flex>

                    <Flex justify='space-between' mt='12px'>
                        <Text>Статус</Text>
                        <Text size='18px'>Страница оплаты</Text>
                    </Flex>

                </GradientContainer>

                <GradientContainer>
                        <Flex direction='column' align='center'>
                            <QRCodeThumb style={{backgroundColor: theme === true ? '#ffffff' : '#1c1c1e'}}>
                                <LiveQRCode value={qrCodeValue} />


                                <CustomTextArea
                                    theme={theme}
                                    value={currentOrder.invoice_data.address}
                                    onClick={copy}
                                    readOnly
                                />
                                {/*<Flex widht='100%'>*/}
                                {/*    <Text*/}
                                {/*        theme={theme}*/}
                                {/*        mt='40px'*/}
                                {/*        mb='14px'*/}
                                {/*        onClick={copy}*/}
                                {/*        size='16px'*/}
                                {/*    >{currentOrder.invoice_data.address}</Text>*/}

                                {/*</Flex>*/}


                                <Flex align='start'>
                                    <Text size='16px' mr='5px'>{translate('0062', lang)}: </Text>
                                    <Text size='16px' mr='5px'  color='#99999A'>{currentOrder.send_amount}</Text>
                                    <Text size='16px' color='#99999A'>{currentOrder.currencies.currency_1}</Text>
                                </Flex>

                                <Flex align='start'>
                                    <Text size='16x' mr='5px'>{adressTitle}:</Text>
                                    <Text size='16px' color='#99999A'>{`${currentOrder.currencies.currency_1} ${networkValue}`}</Text>
                                </Flex>
                            </QRCodeThumb>
                        </Flex>
                </GradientContainer>

                <Flex mt='14px' justify='space-between'>
                    <ButtonRounded width={'47%'} bg='#1C1C1E' onClick={copy}>Копировать</ButtonRounded>
                    <ButtonRounded width={'47%'} onClick={payOrder}>Я оплатил</ButtonRounded>
                </Flex>

                <Text width='100%' mt='16px'  size='16px' align='center'>
                    {`Отправляйте только ${currentOrder.currencies.currency_1} ${networkValue} на этот адрес!`}
                </Text>

                <Text width='100%' mt='16px' size='16px' color='#99999A' align='center'>
                    Другие активы могут не дойти и будут утрачены
                </Text>

            </Flex>
        }

        {/*    { currentOrder && <Flex direction='column' mt='60px' background='#232e3c'>*/}
        {/*        <CustomBackButton type='button' top='-50px' onClick={() => navigate('/')}>{translate('0010', lang)}</CustomBackButton>*/}

        {/*        <Thumb direction='column' align='center'>*/}

                    {/*<QRCodeThumb style={{backgroundColor: theme === true ? '#ffffff' : '#1c1c1e'}}>*/}
                    {/*    <LiveQRCode value={qrCodeValue} />*/}
                    {/*    */}
                    {/*    <CustomTextArea  */}
                    {/*        theme={theme} */}
                    {/*        value={currentOrder.invoice_data.address} */}
                    {/*        onClick={copy} */}
                    {/*        readOnly */}
                    {/*    />*/}
                    {/*    */}
                    {/*    <Flex mb='10px' mt='10px'>*/}
                    {/*        <Text size='14px' style={{opacity: '0.5'}}>{translate('0062', lang)} {currentOrder.send_amount} {currentOrder.currencies.currency_1}</Text>*/}
                    {/*    </Flex>*/}
                    {/*    */}
                    {/*    <Text style={{opacity: '0.5'}}>*/}
                    {/*        {`${adressTitle} ${currentOrder.currencies.currency_1} ${networkValue}`}*/}
                    {/*    </Text>*/}
                    {/*</QRCodeThumb>*/}

        {/*            <CustomTextArea theme={theme} value={`${warningMessage1} ${currentOrder.currencies.currency_1} ${networkValue}. ${warningMessage2}`} readOnly />*/}
        {/*            */}
        {/*            <Flex mt='10px' justify='space-around'>*/}
        {/*                <InnerButton width={'40%'} onClick={copy}>{translate('0063', lang)}</InnerButton>*/}
        {/*                <InnerButton width={'40%'} onClick={payOrder}>{translate('0054', lang)}</InnerButton>*/}
        {/*            </Flex>*/}


        {/*        </Thumb>*/}
        {/*    </Flex>*/}
        {/*}*/}
    </ResponsiveContainer>
}

export default Payment