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
import TextGray from "./styledComponent/TextGrey"

const StyledDoubleMenuItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 140px;
    border-radius: 12px;
    border: 2px solid #3F3F3F;
    padding: 12px 9px;
    width: calc(50% - 10px);
    background-color: #1C1C1E;
`

const CashForm = (props) => {

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

    useEffect(() => {
        if (isSaved === true) {
            orderForEdit(savedOrder)
        }
    }, [])


    useEffect(() => {
        async function getPairs() {
            dispatch(changeIsLoaderVisible(true))
            await getAllPairs().then(data => {

                let filteredPairs = _filter(data, (a) => a.activated && a.pair_type === exchangeTypeNames.cash)
                setAllPairs(filteredPairs)

            })
                .finally(() => dispatch(changeIsLoaderVisible(false)))
        }

        getPairs()
    }, [])


    useEffect(() => {
        setDataByCurrency()
        checkFiatByCurrensy()
    }, [allPairs])


    useEffect(() => {
        getCoast(1)
        setNeedCalculate(false)
    }, [needCalculate])


    useEffect(() => {
        setDataByCurrency()
        setCurrentCourse()
        recalculatePrice()
        setAmount('')
        setCalcAmount('')
    }, [fiatCurrency, currency])

    useEffect(() => {
        setCurrentCourse()
    }, [city])

    useEffect(() => {
        checkFiatByCurrensy()
    }, [currency])


    useEffect(() => {
        setCountryByCurrentPair()
        setCurrentCourse()
        recalculatePrice()
    }, [currentPair])


    useEffect(() => {
        if (!_isEmpty(props.order)) {
            orderForEdit(props.order)
        }
    }, [props.order])


    useEffect(() => {
        setCurrentCourse()
        setAmount('')
        setCalcAmount('')
        recalculatePrice()
    }, [operationType, percentBuy, percentSell])


    useEffect(() => {
        changePlaceholder()
    }, [operationType, currentPair])


    useEffect(() => {
        setCitiesByCountry()
    }, [country])


    /*
    * Проверка на соответствие фиатных валют
    **/
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
    * Функция просчета вперед
    **/
    async function calculatePriceByAmount() {

        let sum = await calculatePrice(currency, fiatCurrency, operationType, parseFloat(amount), country, city, 1)
        if (sum) {
            setCalcAmount(Number(sum).toFixed(3))
        }
    }


    /*
    * Функция просчета назад
    **/
    async function calculatePriceByCalcAmount() {

        let sum = await calculatePrice(currency, fiatCurrency, operationType, parseFloat(calcAmount), country, city, 0)

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
                        currency,
                        fiatCurrency,
                        country,
                        city,
                        transferNetwork,
                        wallet: wallet,
                        amount: amount,
                        calcAmount: calcAmount,
                        phone: phone,
                        name: name,
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


    function recalculatePrice() {

        if (!_isEmpty(currentPair)) {

            if (currentPair.price_settings === priceTypeNames.live) {

                let priceBuy = Number(currentPair.live_buy)
                let priceSell = Number(currentPair.live_sell)

                let calculatePriceBuy = _round(priceBuy / (1 - ((percentBuy / 100))), 2)
                let calculatePriceSell = _round(priceSell * (1 + ((percentSell / 100))), 2)

                if (operationType === orderTypeNames.buy) {

                    setCalcPrice(calculatePriceBuy)
                } else {
                    setCalcPrice(calculatePriceSell)
                }
            }


            if (currentPair.price_settings === priceTypeNames.static) {

                let priceBuy = Number(currentPair.static_buy)
                let priceSell = Number(currentPair.static_sell)

                let calculatePriceBuy = _round(priceBuy / (1 - ((percentBuy) / 100)), 2)
                let calculatePriceSell = _round(priceSell * (1 + ((percentSell) / 100)), 2)

                if (operationType === orderTypeNames.buy) {
                    console.log(calculatePriceBuy);
                    setCalcPrice(calculatePriceBuy)
                } else {
                    console.log(calculatePriceSell);
                    setCalcPrice(calculatePriceSell)
                }
            }
        }
    }


    /*
    * Установка данных в форму по криптовалюте
    **/
    function setDataByCurrency() {

        let pairName = 'USDTUSD';

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


                let countryArr = pairData.country

                if (!_isEmpty(countryArr)) {

                    let filteredCountries = _filter(countryArr, (c) => c.activated)

                    let countryNames = _map(filteredCountries, "name")

                    setCountries(countryNames);
                    setCountry(countryNames[0])

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


    function setCountryByCurrentPair() {
        if (!_isEmpty(currentPair)) {
            let countryArr = currentPair.country

            if (!_isEmpty(countryArr)) {
                let filteredCountries = _filter(countryArr, (c) => c.activated)
                let countryNames = _map(filteredCountries, "name")

                setCountries(countryNames);
                setCountry(countryNames[0])
                setCitiesByCountry()
            }
        }
    }


    /*
    * Установка городов по стране
    **/
    const setCitiesByCountry = () => {

        if (!_isEmpty(currentPair)) {
            let countryArr = currentPair.country

            if (!_isEmpty(countryArr)) {

                let currentCountry = _find(countryArr, (c) => c.name === country && c.activated)
                let currentCities = currentCountry?.city_info

                if (!_isEmpty(currentCities)) {

                    let filteredCities = _filter(currentCities, (c) => c.activated)
                    let citiesNames = _map(filteredCities, "name")

                    setCities(citiesNames)
                    setCity(citiesNames[0])
                }
            }
        }

    }


    /*
    * Установка курса c маржой, по схеме город - страна - пара
    **/
    function setCurrentCourse() {

        if (!_isEmpty(currentPair)) {
            let currentPercentBuy = 0
            let currentPercentSell = 0
            let currentMarginBuy = currentPair.margin_percent_buy
            let currentMarginSell = currentPair.margin_percent_sell

            let currentCountry = _find(currentPair.country, (c) => c.name === country)
            let currentCity = _find(currentCountry?.city_info, (c) => c.name === city)

            if (currentCity) {

                if (currentCity.activated) {

                    if (currentCity.percent_buy) {
                        currentPercentBuy = currentCity.percent_buy
                    } else if (currentCountry.percent_buy) {
                        currentPercentBuy = currentCountry.percent_buy
                    } else {
                        currentPercentBuy = currentPair.percent_buy
                    }

                    if (currentCity.percent_sell) {
                        currentPercentSell = currentCity.percent_sell
                    } else if (currentCountry.percent_sell) {
                        currentPercentSell = currentCountry.percent_sell
                    } else {
                        currentPercentSell = currentPair.percent_sell
                    }

                    let courseWithMarginBuy = (Number(currentPercentBuy) + Number(currentMarginBuy)).toFixed(4)
                    let courseWithMarginSell = (Number(currentPercentSell) - Number(currentMarginSell)).toFixed(4)

                    if (operationType === orderTypeNames.buy) {
                        setCourse(courseWithMarginBuy)
                    } else {
                        setCourse(courseWithMarginSell)
                    }

                    setPercentBuy(courseWithMarginBuy)
                    setPercentSell(courseWithMarginSell)
                }
            }
        }
    }


    /*
    * Редактирование ордера
    **/
    const orderForEdit = (order) => {
        if (order) {
            setOperationType(order.operationType)

            setCurrency(order.currency)
            setFiatCurrency(order.fiatCurrency)

            setTransferNetwork(order.transferNetwork)
            setCountry(order.country)
            setCity(order.city)
            setAmount(order.amount)
            setCalcAmount(order.calcAmount)
            setName(order.name)
            setPhone(order.phone)
            setWallet(order.wallet)
        }

        if (isSaved === true) {
            dispatch(toggleIsSave(false))
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
    }


    /*
    * При убирании фокуса с инпута
    **/
    const checkField = async (e) => {

        window.scrollBy(0, window.innerHeight)

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
        console.log(calcPrice);

        const currentOrder = {
            operationType,
            currency,
            fiatCurrency,
            country,
            city,
            transferNetwork,
            user: props.user,
            wallet: wallet,
            amount: parseFloat(amount),
            calcAmount: parseFloat(calcAmount),
            phone: phone,
            name: name,
            exchangeType: exchangeTypeNames.cash,
            exchangeRate: operationType === orderTypeNames.buy
                ? `${calcPrice} ${fiatCurrency} = 1 ${currency}`
                : `1 ${currency} = ${calcPrice} ${fiatCurrency} `
        }

        dispatch(toggleIsSave(false))
        dispatch(clearOrder())

        props.setOrder(currentOrder)
        navigate('/check')

    }

    /*
    * Изминение типа ордера
    **/
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

    const handlerCryptoSelect = (event, value, id) => {
        event.preventDefault()
        setClickedCrypto(id)
        setCurrency(value);
    }

    if (isLoading) {
        return <Loader />
    }



    return <CustomForm onSubmit={handleSubmit} name='form'>

        <ResponsiveContainer direction="column" padding="20px">

            <Flex align='center' justify='space-between'>
                <NSBackButton onClick={goBackWithQuestion}>{translate('0010', lang)}</NSBackButton>
                <NSHelpButton/>
            </Flex>

            <Title alignself='center' mt='34px'>Наличный обмен</Title>

            <Title mt='34px'>Я хочу</Title>

            <GradientContainer mb='24px'>

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

                <Flex mt='20px' justify='space-between'>
                    <GroupLeftText
                        style={{width: '70%'}}>{operationType === orderTypeNames.buy ? buyTitle : sellTitle}</GroupLeftText>

                    <CustomDropdown
                        options={cryptoCurrencies}
                        selected={currency}
                        setSelected={setCurrency}
                        value={'USDT'}
                    />
                </Flex>

                <Flex justify='space-between' mt='14px'>
                    <GroupLeftText>Сеть перевода:</GroupLeftText>
                    <CustomDropdown
                        options={networks}
                        selected={transferNetwork}
                        setSelected={setTransferNetwork}
                        value={transferNetwork}
                    />

                </Flex>

                <Flex justify='space-between' mt='14px'>
                    <GroupLeftText>Фиатная валюта:</GroupLeftText>
                    <CustomDropdown
                        options={fiatCurrencies}
                        selected={fiatCurrency}
                        setSelected={setFiatCurrency}
                        value={'USD'}
                    />
                </Flex>

                <Flex justify='space-between' mt='10px'>
                    <GroupLeftText>Страна:</GroupLeftText>
                    <CustomDropdown
                        options={countries}
                        selected={country}
                        setSelected={setCountry}
                        value={'пусто'}
                    />
                </Flex>

                <Flex justify='space-between' mt='10px'>
                    <GroupLeftText>Город:</GroupLeftText>
                    <CustomDropdown
                        options={cities}
                        selected={city}
                        setSelected={setCity}
                        value={'пусто'}
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

            <Title mt="34px">Сумма:</Title>
            <TextGray size='17px' color='#888681a2' aligntext='start'>{placeholder}</TextGray>

            <Flex justify="space-between">
                <StyledDoubleMenuItem>
                    <Text mb='14px'>{operationType === orderTypeNames.buy ? `Я отдаю (${fiatCurrency})` : `Я отдаю (${currency})`}</Text>
                    <DividerMiniNS/>

                        <CustomInput
                            type='number'
                            autoComplete={'off'}
                            onInput={e => onInput(e)}
                            onBlur={e => checkField(e)}
                            name='amount'
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            onScroll={e => e.preventDefault()}
                        />
                </StyledDoubleMenuItem>

                <StyledDoubleMenuItem>
                    <Text mb='14px'>{operationType === orderTypeNames.buy ? `Я получаю (${currency})` : `Я получаю (${fiatCurrency})`}</Text>
                    <DividerMiniNS/>
                        <CustomInput
                            type='number'
                            onInput={e => onInput(e)}
                            onBlur={e => checkField(e)}
                            name='calcAmount'
                            value={calcAmount}
                            onChange={e => setCalcAmount(e.target.value)}e
                            onScroll={e => e.preventDefault()}
                        />
                </StyledDoubleMenuItem>
            </Flex>


            <Title mt="34px">Реквизиты:</Title>
            <TextGray size="16px" color="#888681a2" aligntext="start">Или другие необходимые данные</TextGray>
            <TextGray size="16px" color="#888681a2" aligntext="start" mb="14px">для выполнения ордера.</TextGray>


            {operationType === orderTypeNames.buy &&
                <MenuItemWithoutFocus juatify='center'>
                    <CustomInput
                        type='text'
                        onInput={e => onInput(e)}
                        onBlur={e => checkField(e)}
                        name='wallet'
                        value={wallet}
                        placeholder='Адрес кошелька'
                        onChange={e => setWallet(e.target.value)}
                        autoComplete={'off'}
                        textalign='end'
                    />
                </MenuItemWithoutFocus>
            }


            <MenuItemWithoutFocus direction='column' mb='60px'>
                <Flex  style={{position: 'static'}} justify="space-between" mb='24px' mt='14px'>
                    <Text>Telegram @username</Text>
                    <Text>{props.user}</Text>
                </Flex>

                <Flex justify="space-between" align='center' mb='24px'>
                    <Text>Телефон</Text>

                    <InputMask
                        className={styles.inputMask}
                        mask="+38 (999) 999 99 99"
                        placeholder="+38 (XXX) XXX XX XX"
                        type='tel'
                        autoComplete='off'
                        onInput={e => onInput(e)}
                        onBlur={e => checkField(e)}
                        name='phone'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </Flex>


                <Flex justify="space-between" align='center' mb='14px' style={{position: 'relative'}}>
                    <Text>Имя</Text>
                    <CustomInput
                        type='text'
                        autoComplete={'off'}
                        onFocus={() => window.scrollBy(0, window.innerHeight)}
                        onInput={e => onInput(e)}
                        onBlur={e => checkField(e)}
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

export default CashForm