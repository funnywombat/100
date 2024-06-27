import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {addOrder, clearOrder, toggleIsSave} from '../store/orderSlice'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {useTelegram} from '../hooks/useTelegram'
import {getAllPairs, calculatePrice, getBankNames} from '../api/api'
import {changeIsLoaderVisible} from "../store/orderSlice"
import {translate} from "../translater/translater"
import {exchangeTypeNames, orderTypeNames, priceTypeNames} from "../common/enums"
import {sellBuyBtns} from "../common/buttonList";

import InputMask from 'react-input-mask';
import styles from "./styles.module.css";

import Notiflix from 'notiflix'
import styled from "styled-components";
import CustomInput from './styledComponent/CustomInput'
import Flex from "./styledComponent/Flex"
import CustomForm from './styledComponent/CustomForm'
import CustomDropdown from './styledComponent/Dropdown'
import GroupLeftText from './styledComponent/GroupLeftText'
import Title from './styledComponent/Title'
import Loader from './Loader'

import _map from 'lodash/map'
import _uniq from 'lodash/uniq'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _isEmpty from 'lodash/isEmpty'
import _round from 'lodash/round'

import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import GradientContainer from "./newStyledComponents/GradientContainer";
import ButtonGroup from "./newStyledComponents/ButtonGroup";
import DoubleMenuItem from "./newStyledComponents/DoubleMenuItem";
import MenuItemWithoutFocus from "./newStyledComponents/MenuItemWithoutFocus";
import Text from "./styledComponent/Text";
import MainGoldButton from "./newStyledComponents/MainGoldButton";
import DividerMiniNS from "./newStyledComponents/DividerMiniNS";
import ResponsiveContainer from "./styledComponent/ResponsiveContainer"
import TextGray from "./styledComponent/TextGrey"

const StyledDoubleMenuItem = styled.div`
    display: flex;
    flex-direction: column;
    height: 150px;
    gap: 8px;
    border-radius: 12px;
    border: 2px solid #3F3F3F;
    padding: 19px 9px;
    width: calc(50% - 10px);
    background-color: #1C1C1E;
`

const CardForm = (props) => {

    let {tg} = useTelegram()
    let navigate = useNavigate()
    const dispatch = useDispatch()

    const isSaved = useSelector(state => state.order.isSaved)
    const savedOrder = useSelector(state => state.order.order)
    const theme = useSelector(state => state.order.theme)
    const lang = useSelector(state => state.order.lang)


    const buyTitle = translate('0014', lang)
    const sellTitle = translate('0015', lang)
    const comissionTitle = translate('0021', lang)
    const {backButton} = useTelegram()


    const [operationType, setOperationType] = useState(orderTypeNames.sell)
    const [currency, setCurrency] = useState('USDT')
    const [fiatCurrency, setFiatCurrency] = useState('UAH')
    const [amount, setAmount] = useState('')
    const [calcAmount, setCalcAmount] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [transferNetwork, setTransferNetwork] = useState('TRC')
    const [wallet, setWallet] = useState('')
    const [allPairs, setAllPairs] = useState([])
    const [needCalculate, setNeedCalculate] = useState(false)

    const [clickeStatusdId, setClickedStatusId] = useState(1);

    const [banks, setBanks] = useState([])
    const [bank, setBank] = useState('Приват-Банк')

    const [allBanksInfo, setAllBanksInfo] = useState([])

    const [cardNumber, setCardNumber] = useState('')
    const [fullName, setFullName] = useState('')
    const [course, setCourse] = useState(1)
    const [percentBuy, setPercentBuy] = useState(1)
    const [percentSell, setPercentSell] = useState(1)
    const [calcPrice, setCalcPrice] = useState(1)

    const [currentPair, setCurrentPair] = useState({})
    const [cryptoCurrencies, setCryptoCurrencies] = useState([])
    const [fiatCurrencies, setFiatCurrencies] = useState([])
    const [networks, setNetworks] = useState([])
    const [placeholder, setPlaceholder] = useState('')
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


    /*
    * Получение всех пар
    **/
    useEffect(() => {

        async function getPairs() {
            dispatch(changeIsLoaderVisible(true))
            await getAllPairs().then(data => {

                let filteredPairs = _filter(data, (a) => a.activated && a.pair_type === exchangeTypeNames.banking)
                if (filteredPairs.length > 0) {
                    setAllPairs(filteredPairs)
                }
            })
                .finally(() => dispatch(changeIsLoaderVisible(false)))

            await getBankNames().then(data => {

                if (!_isEmpty(data)) {

                    setAllBanksInfo(data)

                    let bankNamesArr = _map(data, "cardName")

                    if (!_isEmpty(bankNamesArr)) {
                        setBanks(bankNamesArr)
                        setBank(bankNamesArr[0])
                    }
                }

            }).catch(error => console.log(error))
        }

        getPairs()

    }, [dispatch])


    /*
    * Заполнение полей по валюте
    * Пересчет цены за единицуrf
    **/
    useEffect(() => {
        setDataByCurrency()
        checkFiatByCurrensy()
        calculatating()
    }, [allPairs])


    /*
    * Просчет суммы
    **/
    useEffect(() => {
        getCoast(1)
        setNeedCalculate(false)
    }, [needCalculate])


    useEffect(() => {
        setDataByCurrency()
        setAmount('')
        setCalcAmount('')
        setBankByCurrency()
    }, [fiatCurrency, currency])


    useEffect(() => {
        checkFiatByCurrensy()
    }, [currency])


    useEffect(() => {
        if (!_isEmpty(props.order)) {
            orderForEdit(props.order)
        }
    }, [props.order])


    useEffect(() => {
        setAmount('')
        setCalcAmount('')
    }, [operationType, percentBuy, percentSell])


    useEffect(() => {
        recalculateCourse()
        changePlaceholder()
        calculatating()
    }, [operationType, currentPair])


    function checkFiatByCurrensy() {

        let filteredPairs = _filter(allPairs, (p) => p.currency_1 === currency && p.activated)
        let filteredFiats = _map(filteredPairs, (a) => a.currency_2)

        if (!_isEmpty(filteredFiats)) {
            setFiatCurrencies(filteredFiats)
        }
    }

    /*
    * Фильтрация списка фиатных валют по активным
    **/
    function filterActiveFiatCurrencies() {


        let activePairs = _filter(allPairs, (p) => p.currency_1 === currency && p.activated)

        if (!_isEmpty(activePairs)) {
            let fiatCurrencies = _map(activePairs, 'currency_2')
            setFiatCurrencies(fiatCurrencies)

            if (!fiatCurrencies.includes(fiatCurrency)) {
                setFiatCurrency(fiatCurrencies[0])
            }

        }

    }


    /*
    * Заполнение полей если есть сохраненные данныеW
    **/
    useEffect(() => {
        if (isSaved === true) {
            orderForEdit(savedOrder)
        }
    }, [isSaved, savedOrder])


    /*
    * ПРосчет цены если есть сумма, или нужен перерасчет
    **/
    async function getCoast(type) {
        if (type === 1) {
            if (amount) {
                await calculatePriceByAmount()

                if (needCalculate) {
                    await calculatePriceByAmount()
                    setNeedCalculate(false)
                }
            }


        } else {
            if (calcAmount) {
                await calculatePriceByCalcAmount()

            }
        }
    }


    /*
    * Заполнение банков по фалюте
    **/
    function setBankByCurrency() {

        if (!_isEmpty(allBanksInfo) && fiatCurrency) {

            let bankNameArr = _map(allBanksInfo, "cardName")

            if (!_isEmpty(bankNameArr)) {
                setBanks(bankNameArr)
                setBank(bankNameArr[0])
            } else {
                setBanks([])
                setBank('')
            }


        }

    }


    /*
    * Функция просчета вперед
    **/
    async function calculatePriceByAmount() {

        let sum = await calculatePrice(currency, fiatCurrency, operationType, parseFloat(amount), null, null, 1)

        if (sum) {
            setCalcAmount(Number(sum).toFixed(3))
        }
    }


    /*
    * Функция просчета назад
    **/
    async function calculatePriceByCalcAmount() {

        let sum = await calculatePrice(currency, fiatCurrency, operationType, parseFloat(calcAmount), null, null, 0)

        if (sum) {
            setAmount(Number(sum).toFixed(3))
        }
    }


    /*
    * Переход на предыдушую страницу с вопросом о сохранении
    **/
    async function goBackWithQuestion() {

        const isChanged = (amount !== '') || (name !== '') || (phone !== '') || (wallet !== '')

        if (isChanged) {

            const params = {
                title: "Сохранение заявки",
                message: "Вы не закончили заполнение заявки, хотите сохранить данные?",
                buttons: [
                    {id: 'ok', type: 'ok'},
                    {id: 'cancel', type: 'cancel'}
                ]
            }

            await tg.showPopup(params, btn => {
                if (btn === 'ok') {

                    let currentOrder = {
                        operationType,
                        fiatCurrency,
                        transferNetwork,
                        wallet: wallet,
                        amount: amount,
                        calcAmount: calcAmount,
                        phone: phone,
                        name: name,
                        bank,
                        cardNumber: cardNumber
                    }

                    dispatch(addOrder(currentOrder))
                    dispatch(toggleIsSave(true))


                } else {

                    dispatch(clearOrder())
                    dispatch(toggleIsSave(false))

                }

                navigate('/')
            })

        } else {
            navigate('/')
        }
    }


    /*
    * Установка данных в форму по криптовалюте
    **/
    function setDataByCurrency() {

        let pairName = 'USDTUAH';

        if (currency && fiatCurrency) {
            pairName = `${currency}${fiatCurrency}`
        }

        if (!_isEmpty(allPairs)) {
            let cryptoCurrencies = _uniq(_map(allPairs, 'currency_1'))

            setCryptoCurrencies(cryptoCurrencies)
            filterActiveFiatCurrencies()


            const pairData = _find(allPairs, (a) => a.pair_name === pairName)


            if (!_isEmpty(pairData)) {

                setCurrentPair(pairData)
                const chainList = pairData.chain_list;
                const networks = _map(chainList, "name")

                setNetworks(networks)
                setTransferNetwork(networks[0])


                if (pairData.activated) {
                    setPercentBuy(pairData.percent_buy)
                    setPercentSell(pairData.percent_sell)
                }

            }
        }


    }


    /*
    * Изменение подписи
    **/
    function changePlaceholder() {

        if (!currentPair) {
            return
        }

        if (operationType === orderTypeNames.sell) {
            setPlaceholder(`(min: ${currentPair.min_amount_sell} ${currency}, max: ${currentPair.max_amount_sell} ${currency})`)
        } else {
            setPlaceholder(`(min: ${currentPair.min_amount_buy} ${fiatCurrency}, max: ${currentPair.max_amount_buy} ${fiatCurrency})`)
        }
    }


    /*
    * Редактирование ордера
    **/
    const orderForEdit = useCallback(() => (order) => {
        if (order) {
            setOperationType(order.operationType)
            setCurrency(order.currency)
            setFiatCurrency(order.fiatCurrency)
            setTransferNetwork(order.transferNetwork)
            setAmount(order.amount)
            setCalcAmount(order.calcAmount)
            setName(order.name)
            setPhone(order.phone)
            setWallet(order.wallet)
            setBank(order.bankName)
            setCardNumber(order.cardNumber)
        }

        if (isSaved === true) {
            dispatch(toggleIsSave(false))
        }

    }, [dispatch, isSaved])


    /*
    * Пересчет курса
    **/
    function recalculateCourse() {

        if (!_isEmpty(currentPair)) {
            let marginPercentBuy = currentPair.margin_percent_buy
            let marginPercentSell = currentPair.margin_percent_sell


            if (operationType === orderTypeNames.buy) {
                let buyCourseWithMargin = _round(Number(percentBuy + marginPercentBuy), 3)
                setCourse(buyCourseWithMargin)
            }

            if (operationType === orderTypeNames.sell) {
                let sellCourseWithMargin = _round(Number(percentSell - marginPercentSell), 3)
                setCourse(sellCourseWithMargin)
            }

        }
    }


    function calculatating() {

        if (!_isEmpty(currentPair)) {

            let marginPercentBuy = Number(currentPair.margin_percent_buy)
            let marginPercentSell = Number(currentPair.margin_percent_sell)

            let percentBuy = Number(currentPair.percent_buy)
            let percentSell = Number(currentPair.percent_sell)

            if (currentPair.price_settings === priceTypeNames.live) {

                let priceBuy = Number(currentPair.live_buy)
                let priceSell = Number(currentPair.live_sell)


                let calculatePriceBuy = _round(priceBuy / (1 - ((percentBuy + marginPercentBuy) / 100)), 2)
                let calculatePriceSell = _round(priceSell * (1 + ((percentSell - marginPercentSell) / 100)), 2)

                if (operationType === orderTypeNames.buy) {
                    setCalcPrice(calculatePriceBuy)
                } else {
                    setCalcPrice(calculatePriceSell)
                }
            }


            if (currentPair.price_settings === priceTypeNames.static) {

                let priceBuy = Number(currentPair.static_buy)
                let priceSell = Number(currentPair.static_sell)


                let calculatePriceBuy = _round(priceBuy / (1 - ((percentBuy + marginPercentBuy) / 100)), 2)
                let calculatePriceSell = _round(priceSell * (1 + ((percentSell - marginPercentSell) / 100)), 2)


                if (operationType === orderTypeNames.buy) {
                    setCalcPrice(calculatePriceBuy)
                } else {
                    setCalcPrice(calculatePriceSell)
                }
            }

        }
    }


    /*
    * При вводе значения в инпут
    **/
    const onInput = (e) => {
        e.target.style.color = theme === true ? '#000000' : '#ffffff'
        e.target.style.border = 'none'

        if (e.target.name === "amount" && amount) {
            setAmount('')
            setCalcAmount('')
        }

        if (e.target.name === "calcAmount" && calcAmount) {
            setAmount('')
            setCalcAmount('')
        }

        if (e.target.name === "cardNumber") {

            let value = (e.target.value).trim()

            if (value.length > 16) {
                Notiflix.Notify.warning('Максимальное количество цифр доджно быть 16')
                let prevValue = value.slice(0, 16)
                e.target.value = prevValue
            }
        }

    }


    /*
    * При убирании фокуса с инпута
    **/
    const onBlur = async (e) => {

        if (e.target.name === "amount" && amount) {

            if (!currentPair) {
                return
            }


            if (operationType === orderTypeNames.sell) {


                if (amount < currentPair.min_amount_sell) {
                    Notiflix.Notify.warning('Сумма меньше минимальной')
                    setCalcAmount('')
                    return
                } else if (amount > currentPair.max_amount_sell) {
                    Notiflix.Notify.warning('Сумма больше максимальной')
                    setCalcAmount('')
                    return
                }
            } else {


                if (amount < currentPair.min_amount_buy) {
                    Notiflix.Notify.warning('Сумма меньше минимальной')
                    setCalcAmount('')
                    return
                } else if (amount > currentPair.max_amount_buy) {
                    Notiflix.Notify.warning('Сумма больше максимальной')
                    setCalcAmount('')
                    return
                }
            }


            getCoast(1)
        }

        if (e.target.name === "calcAmount" && calcAmount) {
            if (!amount) {
                getCoast(0)
            }
        }
    }

    /*
    * Валидация перед отправкой
    **/
    function validate(elements) {

        let result = true;

        for (let elem of elements) {

            if (elem.name === 'amount' && (elem.value === "0" || elem.value === "")) {
                elem.style.borderBottom = '1px solid red'
                result = false
            }


            if (elem.name === 'calcAmount' && (elem.value === "0" || elem.value === "")) {
                elem.style.borderBottom = '1px solid red'
                result = false
            }


            if (elem.name === 'name' && elem.value === "") {
                elem.style.borderBottom = '1px solid red'
                result = false
            }

            if (elem.name === 'phone' && (elem.value === "0" || elem.value === "")) {
                elem.style.borderBottom = '1px solid red'
                result = false
            }


            if (elem.name === 'wallet' && elem.value === "" && operationType === orderTypeNames.buy) {
                elem.style.borderBottom = '1px solid red'
                result = false
            }

            if (elem.name === 'fullName' && elem.value === "" && operationType === orderTypeNames.sell) {
                elem.style.borderBottom = '1px solid red'
                result = false
            }

        }

        return result
    }


    /*
    * Основной обработчик сабмита формы
    **/
    function handleSubmit(event) {
        event.preventDefault()

        let form = event.target;
        let noError = validate(form.elements)

        if (!noError) {
            return Notiflix.Notify.warning('Необходимо заполнить обяазательные колонки!')
        }

        const currentOrder = {
            operationType,
            currency,
            fiatCurrency,
            transferNetwork,
            user: props.user,
            wallet: wallet,
            amount: parseFloat(amount),
            calcAmount: parseFloat(calcAmount),
            phone: phone,
            name: name,
            bank: bank,
            fullName: fullName ? fullName : "",
            cardNumber: cardNumber,
            exchangeType: exchangeTypeNames.banking,
            exchangeRate: operationType === orderTypeNames.buy
                ? `${calcPrice} ${fiatCurrency} = 1 ${currency}`
                : `1 ${currency} = ${calcPrice} ${fiatCurrency} `
        }

        dispatch(toggleIsSave(false))
        dispatch(clearOrder())
        props.setOrder(currentOrder)
        navigate('/checkByCard')

    }

    const handlerCryptoSelect = (event, value, id) => {
        event.preventDefault()
        setClickedCrypto(id)
        console.log(value);
        setCurrency(value);
    }

    const handleSellBuyClick = (event, label, id) => {
        event.preventDefault();
        setClickedStatusId(id);

        if (label === "Купить") {
            setOperationType(orderTypeNames.buy)
        }

        if (label === "Продать") {
            setOperationType(orderTypeNames.sell)
        }
    };

    if (isLoading) {
        return <Loader/>
    }


    return <CustomForm onSubmit={handleSubmit} name='form'>

        <ResponsiveContainer direction="column" padding="20px">

            <Flex align='center' justify='space-between'>
                <NSBackButton onClick={goBackWithQuestion}>{translate('0010', lang)}</NSBackButton>
                <NSHelpButton/>
            </Flex>

            <Title alignself='center' mt='22px'>Безналичный обмен</Title>

            <Title mt='22px'>Я хочу</Title>

            <GradientContainer mb='40px'>
                <ButtonGroup>
                    {sellBuyBtns.map((label, i) => <button
                            type='radio'
                            key={label}
                            defaultValue={operationType}
                            onClick={(event) => handleSellBuyClick(event, label, i)}
                            className={i === clickeStatusdId ? "active" : "radioBtn"}
                        >
                            {label}
                        </button>
                    )}
                </ButtonGroup>

                <Flex justify='space-between' mt='20px'>
                    <GroupLeftText>{operationType === orderTypeNames.buy ? buyTitle : sellTitle}</GroupLeftText>
                    <CustomDropdown
                        options={cryptoCurrencies}
                        selected={currency}
                        setSelected={setCurrency}
                        value={'USDT'}
                    />
                </Flex>

                <Flex justify='space-between' mt='10px'>
                    <GroupLeftText>Сеть перевода:</GroupLeftText>
                    <CustomDropdown
                        options={networks}
                        selected={transferNetwork}
                        setSelected={setTransferNetwork}
                        value={transferNetwork}
                    />

                </Flex>

                <Flex justify='space-between' mt='10px'>
                    <GroupLeftText>Фиатная валюта:</GroupLeftText>
                    <CustomDropdown
                        options={fiatCurrencies}
                        selected={fiatCurrency}
                        setSelected={setFiatCurrency}
                        value={'USD'}
                    />
                </Flex>

                <Flex justify='space-between' mt='10px'>
                    <GroupLeftText>Банк</GroupLeftText>
                    <CustomDropdown
                        options={banks}
                        selected={bank}
                        setSelected={setBank}
                        value={bank}
                    />
                </Flex>

            </GradientContainer>

            <Flex justify="space-between">
                <DoubleMenuItem
                    text1={"Курс"}
                    text2={operationType === orderTypeNames.buy
                        ? `${calcPrice}${fiatCurrency}=1${currency}`
                        : `1${currency}=${calcPrice}${fiatCurrency}`
                    }/>

                <DoubleMenuItem
                    text1={course < 0 ? 'Доплата' : comissionTitle}
                    text2={course < 0 ? (course * -1) + '%' : course + '%'}
                />
            </Flex>

            <Title mt="34px" mb='10px'>Сумма:</Title>
            <TextGray size='17px' color='#888681a2' aligntext='start'>{placeholder}</TextGray>

            <Flex justify="space-between">
                <StyledDoubleMenuItem>
                    <Text
                        mb='14px'>{operationType === orderTypeNames.buy ? `Я отдаю (${fiatCurrency})` : `Я отдаю (${currency})`}</Text>
                    <DividerMiniNS/>
                    <CustomInput
                        type='number'
                        autoComplete={'off'}
                        onInput={e => onInput(e)}
                        onBlur={e => onBlur(e)}
                        name='amount'
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        onScroll={e => e.preventDefault()}
                    />
                </StyledDoubleMenuItem>

                <StyledDoubleMenuItem>
                    <Text
                        mb='14px'>{operationType === orderTypeNames.buy ? `Я получаю (${currency})` : `Я получаю (${fiatCurrency})`}</Text>
                    <DividerMiniNS/>
                    <CustomInput
                        type='number'
                        onInput={e => onInput(e)}
                        onBlur={e => onBlur(e)}
                        name='calcAmount'
                        value={calcAmount}
                        onChange={e => setCalcAmount(e.target.value)}
                        onScroll={e => e.preventDefault()}
                    />
                </StyledDoubleMenuItem>
            </Flex>

            <Title mt="34px">Реквизиты:</Title>
            <TextGray size="16px" color="#888681a2" aligntext="start">Или другие необходимые данные</TextGray>
            <TextGray size="16px" color="#888681a2" aligntext="start" mb="14px">для выполнения ордера.</TextGray>

            {operationType === orderTypeNames.sell && <>
                <MenuItemWithoutFocus>
                    <Text width='100%'>Номер карты:</Text>
                    <InputMask
                        className={styles.inputMask}
                        mask="9999 9999 9999 9999"
                        name='cardNumber'
                        value={cardNumber}
                        onBlur={e => onBlur(e)}
                        onChange={e => setCardNumber(e.target.value)}
                        autoComplete={'off'}
                    />
                </MenuItemWithoutFocus>

                <MenuItemWithoutFocus>
                    <Text width='20%'>ФИО:</Text>
                    <CustomInput
                        style={{width: '80%'}}
                        type='text'
                        autoComplete={'off'}
                        onInput={e => onInput(e)}
                        onBlur={e => onBlur(e)}
                        name='fullName'
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                    />
                </MenuItemWithoutFocus>
            </>


            }


            {operationType === orderTypeNames.buy &&
                <MenuItemWithoutFocus>
                    <CustomInput
                        type='text'
                        placeholder='Адрес кошелька'
                        onInput={e => onInput(e)}
                        onBlur={e => onBlur(e)}
                        name='wallet'
                        value={wallet}
                        onChange={e => setWallet(e.target.value)}
                        autoComplete={'off'}
                        textalign='end'
                    />
                </MenuItemWithoutFocus>
            }


            <MenuItemWithoutFocus direction='column' style={{marginBottom: '70px'}}>
                <Flex justify="space-between" mt='14px'>
                    <Text>Telegram @username:</Text>
                    <Text>{props.user}</Text>
                </Flex>

                <Flex justify="space-between" mt='24px'>
                    <Text>Телефон:</Text>

                    <InputMask
                        className={styles.inputMask}
                        mask="+38 (999) 999 99 99"
                        placeholder="+38 (XXX) XXX XX XX"
                        type='tel'
                        autoComplete={'off'}
                        onInput={e => onInput(e)}
                        onBlur={e => onBlur(e)}
                        name='phone'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </Flex>


                <Flex justify="space-between" mt='24px' mb='14px'>
                    <Text>Имя:</Text>
                    <CustomInput
                        type='text'
                        autoComplete={'off'}
                        onInput={e => onInput(e)}
                        onBlur={e => onBlur(e)}
                        name='name'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        textalign='end'
                    />
                </Flex>


            </MenuItemWithoutFocus>

            <MainGoldButton type='submit'>{translate('0031', lang)}</MainGoldButton>

        </ResponsiveContainer>

    </CustomForm>

}

export default CardForm




