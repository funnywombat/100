import CustomForm from "./styledComponent/CustomForm"
import CustomDropdown from "./styledComponent/Dropdown"
import CustomInput from "./styledComponent/CustomInput"
import GroupLeftText from "./styledComponent/GroupLeftText"
import Title from "./styledComponent/Title"
import GreyTitle from "./styledComponent/GreyTitle"
import Flex from "./styledComponent/Flex"
import Text from "./styledComponent/Text"

import _filter from "lodash/filter"
import _find from "lodash/find"
import _map from 'lodash/map'

import InputMask from 'react-input-mask';
import styles from "./styles.module.css";


import {getAllPairs, calculateTransferPrice} from '../api/api'


import {clearOrder, toggleIsSave} from '../store/orderSlice'
import React, {useEffect, useState} from 'react'

import {useDispatch} from 'react-redux'
import {useSelector} from 'react-redux'
import Notiflix from "notiflix"

import _isEmpty from 'lodash/isEmpty'

import {useNavigate} from 'react-router-dom'


import {changeIsLoaderVisible} from "../store/orderSlice"
import Loader from './Loader'
import MainContainer from "./styledComponent/MainContainer"

import {translate} from "../translater/translater"
import {exchangeTypeNames, orderTypeNames} from "../common/enums"
import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import GradientContainer from "./newStyledComponents/GradientContainer";
import MenuItemWithoutFocus from "./newStyledComponents/MenuItemWithoutFocus";
import DividerNS from "./newStyledComponents/DividerNS";
import DoubleMenuItem from "./newStyledComponents/DoubleMenuItem";
import styled from "styled-components";
import MainGoldButton from "./newStyledComponents/MainGoldButton";
import _round from "lodash/round";
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

const Permutations = (props) => {

    let navigate = useNavigate()
    const dispatch = useDispatch()

    const isSaved = useSelector(state => state.order.isSaved)
    const savedOrder = useSelector(state => state.order.order)
    const theme = useSelector(state => state.order.theme)
    const lang = useSelector(state => state.order.lang)

    const comissionTitle = translate('0021', lang)

    const [allPairs, setAllPairs] = useState([])
    const [fiatCurrency, setFiatCurrency] = useState('USD')
    const [senderCountry, setSenderCountry] = useState('')
    const [senderCity, setSenderCity] = useState('')
    const [senderName, setSenderName] = useState('')
    const [senderPhone, setSenderPhone] = useState('')

    const [recieverCountry, setRecieverCountry] = useState('')
    const [recieverCity, setRecieverCity] = useState('')
    const [recieverUsername, setRecieverUsername] = useState('')
    const [recieverName, setRecieverName] = useState('')
    const [recieverPhone, setRecieverPhone] = useState('')

    const [minAmount, setMinAmount] = useState(0)
    const [maxAmount, setMaxAmount] = useState(0)
    const [amount, setAmount] = useState('')
    const [calcAmount, setCalcAmount] = useState('')
    const [comment, setComment] = useState('')
    const [currentPair, setCurrentPair] = useState({})
    const [course, setCourse] = useState(0.00)
    const [margin, setMargin] = useState(0)
    const [placeholder, setPlaceholder] = useState(`(min: 0 ${fiatCurrency}, max: 0 ${fiatCurrency})`)

    const [fiatCurrencies, setFiatCurrencies] = useState([])
    const [countries, setCountries] = useState([])
    const [reciverCities, setReciverCities] = useState([])
    const [senderCities, setSenderCities] = useState([])
    const isLoading = useSelector(state => state.order.isLoaderVisible)

    useEffect(() => {

        if (isSaved === true) {
            orderForEdit(savedOrder)
        }

    }, [])

    useEffect(() => {

        async function getPairs() {
            dispatch(changeIsLoaderVisible(true))
            await getAllPairs().then(data => {

                let filteredPairs = _filter(data, (a) => a.pair_type === exchangeTypeNames.transfer && a.activated)
                setAllPairs(filteredPairs)
            })
                .finally(() => dispatch(changeIsLoaderVisible(false)))
        }

        getPairs()

    }, [])


    useEffect(() => {
        if (!_isEmpty(allPairs)) {
            setDataByCurrency()
            changePlaceholder()
        }
    }, [allPairs])


    useEffect(() => {
        if (fiatCurrency) {
            setDataByCurrency()
            changePlaceholder()
        }

    }, [fiatCurrency])


    useEffect(() => {
        setCityByCountry(1)
    }, [senderCountry])

    useEffect(() => {

        if (!_isEmpty(props.order)) {
            orderForEdit(props.order)
        }

    }, [props.order])

    useEffect(() => {
        setCityByCountry(0)
    }, [recieverCountry])

    useEffect(() => {
        changePlaceholder()
    }, [minAmount, maxAmount])

    useEffect(() => {
        setCountryByCurrentPair()
        setCityByCountry(1)
        setCityByCountry(0)
    }, [currentPair])

    useEffect(() => {
        setPercentCourse()

    }, [senderCity])


    function setDataByCurrency() {
        let pairName = fiatCurrency;

        if (!pairName) {
            pairName = 'USD'
        }


        if (!_isEmpty(allPairs)) {


            let currentfiatCurrencies = _map(allPairs, (a) => a.currency)
            setFiatCurrencies(currentfiatCurrencies)


            const pairData = _find(allPairs, (a) => a.currency === pairName)

            if (!_isEmpty(pairData)) {

                setCurrentPair(pairData)
                setMargin(pairData.margin_percent_buy)
                setCourse(pairData.margin_percent_buy)

                if (pairData.min_amount_buy && pairData.min_amount_buy !== 0) {
                    setMinAmount(pairData.min_amount_buy)
                }

                if (pairData.max_amount_buy && pairData.max_amount_buy !== 0) {
                    setMaxAmount(pairData.max_amount_buy)
                }


                let countryArr = pairData.country

                if (!_isEmpty(countryArr)) {

                    let countryNames = _map(countryArr, "name")


                    setCountries(countryNames);
                    setSenderCountry(countryNames[0])
                    setRecieverCountry(countryNames[0])
                }
            }
        }

    }


    function setCountryByCurrentPair() {
        if (currentPair) {

            let countryArr = currentPair.country

            if (!_isEmpty(countryArr)) {

                let countryNames = _map(countryArr, "name")
                let currentCountry = currentPair.country[0]

                setCountries(countryNames);
                setSenderCountry(countryNames[0])
                setRecieverCountry(countryNames[0])

                if (currentCountry.activated) {
                    if (currentCountry.percent_buy) {
                        let countryCourse = currentCountry.percent_buy
                        let currentCourse = margin + countryCourse
                        setCourse(currentCourse)
                    }

                    if (currentCountry.min_amount_buy && currentCountry.min_amount_buy !== 0) {
                        setMinAmount(currentCountry.min_amount_buy)
                    }

                    if (currentCountry.max_amount_buy && currentCountry.max_amount_buy !== 0) {
                        setMaxAmount(currentCountry.max_amount_buy)
                    }
                }

            }

        }

    }


    function setCityByCountry(type) {

        if (!_isEmpty(currentPair)) {


            let countryArr = currentPair.country

            if (!_isEmpty(countryArr)) {


                let countryField = type === 1 ? senderCountry : recieverCountry


                let currentCountry = _find(countryArr, (c) => c.name === countryField && c.activated)

                let currentCities = currentCountry.city_info


                if (!_isEmpty(currentCities)) {

                    const filteredCities = _filter(currentCities, (c) => c.activated)
                    const citiesNames = _map(filteredCities, "name")


                    if (type === 1) {

                        setSenderCities(citiesNames)
                        if (_isEmpty(props.order.senderCity)) {
                            setSenderCity(citiesNames[0])

                        } else {
                            setSenderCity(props.order.senderCity)
                        }
                    }

                    if (type === 0) {
                        setReciverCities(citiesNames)

                        if (_isEmpty(props.order.senderCity)) {
                            setRecieverCity(citiesNames[0])

                        } else {
                            setRecieverCity(props.order.recieverCity)
                        }
                    }

                }

            }

        }
    }


    /*
    * Редактирование ордера
    **/
    function setPercentCourse() {

        if (!_isEmpty(currentPair) && senderCountry && senderCity) {

            let currentCountry = _find(currentPair.country, (c) => c.name === senderCountry)
            let currentCity = _find(currentCountry.city_info, (c) => c.name === senderCity)

            if (!currentCity.activated) {
                if (currentCountry.percent_buy && currentCountry.percent_buy !== 0) {

                    let countryCourse = currentCountry.percent_buy
                    let currentCourse = margin + countryCourse
                    setCourse(currentCourse)
                } else {

                    setCourse(currentPair.margin_percent_buy)
                }
                if (currentCountry.min_amount_buy && currentCountry.min_amount_buy !== 0) {
                    setMinAmount(currentCountry.min_amount_buy)
                }

                if (currentCountry.max_amount_buy && currentCountry.max_amount_buy !== 0) {
                    setMaxAmount(currentCountry.max_amount_buy)
                }
            }


            if (currentCity.percent_buy && currentCity.percent_buy !== 0) {
                let cityCourse = currentCity.percent_buy
                let currentCourse = margin + cityCourse
                setCourse(currentCourse)
            } else {
                let countryCourse = currentCountry.percent_buy
                let currentCourse = margin + countryCourse
                setCourse(currentCourse)
            }


            if (currentCity.min_amount_buy) {
                setMinAmount(currentCity.min_amount_buy)
            }
            if (currentCity.max_amount_buy) {
                setMaxAmount(currentCity.max_amount_buy)
            }

        }
    }


    /*
    * Редактирование ордера
    **/
    const orderForEdit = (order) => {
        if (order) {
            setFiatCurrency(order.fiatCurrency)
            setSenderCountry(order.senderCountry)
            setSenderCity(order.senderCity)

            setAmount(order.amount)
            setCalcAmount(order.calcAmount)

            setSenderName(order.senderName)
            setSenderPhone(order.senderPhone)

            setRecieverCountry(order.recieverCountry)
            setRecieverCity(order.recieverCity)
            setRecieverUsername(order.recieverUsername)
            setRecieverPhone(order.recieverPhone)
            setRecieverName(order.recieverName)

            setComment(order.comment)
        }

        if (isSaved === true) {
            dispatch(toggleIsSave(false))
        }


    }


    /*
    * Изменение подписи
    **/
    function changePlaceholder() {

        if (!fiatCurrency) {
            return
        }

        setPlaceholder(`(min: ${minAmount} ${fiatCurrency}, max: ${maxAmount} ${fiatCurrency})`)
    }


    /*
    * Функция просчета
    **/
    async function calculatePriceByAmount() {

        let sum = await calculateTransferPrice(fiatCurrency, 1, parseFloat(amount), senderCountry, senderCity)
        if (sum) {
            setCalcAmount(Number(sum).toFixed(3))
        }
    }


    /*
    * Функция просчета
    **/
    async function calculatePriceByCalcAmount() {

        let sum = await calculateTransferPrice(fiatCurrency, 0, parseFloat(calcAmount), senderCountry, senderCity)

        if (sum) {
            setAmount(Number(sum).toFixed(3))
        }
    }


    /*
    * ПРосчет цены если есть сумма, или нужен перерасчет
    **/
    async function getCoast(type) {
        if (type === 1) {
            calculatePriceByAmount()
        } else {
            calculatePriceByCalcAmount()
        }
    }


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


            if (elem.name === 'wallet' && elem.value === "") {
                elem.style.borderBottom = '1px solid red'
                result = false
            }
        }

        return result
    }

    const goBack = () => {
        props.setOrder({})
        navigate('/')
    }

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

    const onBlur = async (e) => {
        e.target.style.color = '#41A8DC'

        if (e.target.name === "amount" && amount && course) {

            if (amount < minAmount) {
                Notiflix.Notify.warning('Сумма меньше минимальной')
                setCalcAmount('')
                return
            } else if (amount > maxAmount) {
                Notiflix.Notify.warning('Сумма больше максимальной')
                setCalcAmount('')
                return
            } else {
                getCoast(1)
            }

            if (!amount) {
                setCalcAmount('')
            }
        } else if (e.target.name === "calcAmount" && calcAmount && course) {

            if (!amount) {
                getCoast(2)
            }

            if (!calcAmount) setAmount('')
        }

    }

    function handleSubmit(event) {
        event.preventDefault()

        let form = event.target;
        let noError = validate(form.elements)

        if (!noError) {
            return Notiflix.Notify.warning('Необходимо заполнить обяазательные колонки!')
        }

        let calcPrice = _round(amount / (1 - ((course) / 100)), 4)


        const currentOrder = {
            fiatCurrency,
            amount: parseFloat(amount),
            calcAmount: parseFloat(calcAmount),
            user: props.user,
            senderCountry,
            senderCity,
            senderPhone,
            senderName,
            recieverCountry,
            recieverCity,
            recieverUsername,
            recieverPhone,
            recieverName,
            comment,
            exchangeType: exchangeTypeNames.transfer,
            exchangeRate: `${calcPrice} ${fiatCurrency} = 1 ${fiatCurrency}`,
            course: course
        }

        dispatch(toggleIsSave(false))
        dispatch(clearOrder())

        props.setOrder(currentOrder)
        navigate('/checkPerm')

        setAmount('')
        setCalcAmount('')

    }

    function goToMain() {
        navigate('/')
    }

    if (isLoading) {
        return <Loader />
    }



    return <CustomForm onSubmit={handleSubmit} name='form'>


        <ResponsiveContainer direction='column' padding='40px 20px 100px 20px'>

            <Flex align='center' justify='space-between' mt='24px'>
                <NSBackButton onClick={goToMain}>{translate('0010', lang)}</NSBackButton>
                <NSHelpButton/>
            </Flex>


            <Flex justify='space-between' align='center' mt='24px'>
                <Title mt='24px' mb='10px'>Перестановки</Title>
                <GreyTitle style={{marginRight: '20px'}}>{comissionTitle} {course}%</GreyTitle>
            </Flex>


            <GradientContainer>

                <Flex justify='space-between'>
                   <GroupLeftText>Валюта</GroupLeftText>

                    <CustomDropdown
                        options={fiatCurrencies}
                        selected={fiatCurrency}
                        setSelected={setFiatCurrency}
                        value={'USD'}
                    />
                </Flex>

            </GradientContainer>

            <Title mt='34px' mb='4px'>КОНТАКТЫ ОТПРАВИТЕЛЯ</Title>
            <GradientContainer>
                <Flex justify='space-between' mt='8px' mb='8px'>
                    <GroupLeftText>{translate('0017', lang)}</GroupLeftText>

                    <CustomDropdown
                        options={countries}
                        selected={senderCountry}
                        setSelected={setSenderCountry}
                        value={'пусто'}
                    />

                </Flex>

                <Flex justify='space-between' mt='8px' mb='8px'>
                    <GroupLeftText>{translate('0018', lang)}</GroupLeftText>

                    <CustomDropdown
                        options={senderCities}
                        selected={senderCity}
                        setSelected={setSenderCity}
                        value={'пусто'}
                    />

                </Flex>


                <Flex justify='space-between' mt='8px' mb='8px'>

                    <GroupLeftText>
                        Telegram
                    </GroupLeftText>

                    <CustomInput
                        autoComplete={'off'}
                        textalign='end'
                        placeholder='@username'
                        defaultValue={props.user}
                        readOnly
                    />

                </Flex>


                <Flex justify='space-between' mt='8px' mb='8px'>

                    <GroupLeftText>Телефон</GroupLeftText>
                    <InputMask
                        className={styles.inputMask}
                        mask="+38 (999) 999 99 99"
                        placeholder="+38 (XXX) XXX XX XX"
                        type='tel'
                        autoComplete={'off'}
                        onInput={e => onInput(e)}
                        onBlur={e => onBlur(e)}
                        name='phone'
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                    />

                </Flex>



                <Flex justify='space-between' mt='8px' mb='8px'>

                    <Text width='100%'>{translate('0034', lang)}</Text>

                    <CustomInput
                        textalign='end'
                        type='text'
                        autoComplete={'off'}
                        onInput={e => onInput(e)}
                        onBlur={e => onBlur(e)}
                        name='name'
                        value={senderName}
                        onChange={e => setSenderName(e.target.value)}
                    />

                </Flex>


            </GradientContainer>


            <Title mt='24px' mb='4px'>КОНТАКТЫ ПОЛУЧАТЕЛЯ</Title>
            <GradientContainer>
                <Flex justify='space-between'>
                    <GroupLeftText>{translate('0017', lang)}</GroupLeftText>

                    <CustomDropdown
                        options={countries}
                        selected={recieverCountry}
                        setSelected={setRecieverCountry}
                        value={'пусто'}
                    />

                </Flex>

                <Flex justify='space-between' mt='8px' mb='8px'>
                    <GroupLeftText>{translate('0018', lang)}</GroupLeftText>

                    <CustomDropdown
                        options={reciverCities}
                        selected={recieverCity}
                        setSelected={setRecieverCity}
                        value={'пусто'}
                    />

                </Flex>

                <Flex justify='space-between' mt='8px' mb='8px'>
                    <Text width='100%'>Telegram</Text>

                    <CustomInput
                        textalign='end'
                        type='text'
                        autoComplete={'off'}
                        onInput={e => onInput(e)}
                        onBlur={e => onBlur(e)}
                        name='recipientLogin'
                        placeholder='@username'
                        value={recieverUsername}
                        onChange={(e) => setRecieverUsername(e.target.value)}
                    />


                </Flex>

                <Flex justify='space-between' mt='8px' mb='8px'>
                    <GroupLeftText>Телефон</GroupLeftText>


                    <InputMask
                        mask="+38 (999) 999 99 99"
                        placeholder="+38 (XXX) XXX XX XX"
                        className={styles.inputMask}
                        type='tel'
                        autoComplete={'off'}
                        onInput={e => onInput(e)}
                        onBlur={e => onBlur(e)}
                        name='recipientPhone'
                        value={recieverPhone}
                        onChange={(e) => setRecieverPhone(e.target.value)}
                    />

                </Flex>

                <Flex justify='space-between' mt='8px' mb='8px'>
                    <GroupLeftText>{translate('0034', lang)}</GroupLeftText>

                    <CustomInput
                        textalign='end'
                        type='text'
                        autoComplete={'off'}
                        onInput={e => onInput(e)}
                        onBlur={e => onBlur(e)}
                        name='recipientName'
                        value={recieverName}
                        onChange={e => setRecieverName(e.target.value)}
                    />

                </Flex>

            </GradientContainer>



            <MenuItemWithoutFocus mt='24px'>
                <Flex direction='column'>
                    <Flex justify='space-between' mb='8px'>
                        <Text>Комиссия:</Text>
                        <Text>{course}%</Text>
                    </Flex>

                    <DividerNS/>

                    <Flex justify='space-between' mt='8px'>
                        <Text>Курс:</Text>
                        <Text>1{fiatCurrency}={1+course}{fiatCurrency}</Text>
                    </Flex>
                </Flex>
            </MenuItemWithoutFocus>

            <Title mt='24px' mb='4px'>Сумма перевода:</Title>
            <TextGray mb='8px' size='18px' aligntext='start' color='#888681a2'>{placeholder}</TextGray>
            <Flex justify='space-between'>
                <StyledDoubleMenuItem>

                    <Flex mb='14px'>
                        <GroupLeftText>Перевожу {`(${fiatCurrency})`}</GroupLeftText>
                    </Flex>

                    <DividerNS />

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

                    <Flex mb='14px'>
                        <GroupLeftText>Получаю {`(${fiatCurrency})`}</GroupLeftText>
                    </Flex>

                    <DividerNS />

                    <CustomInput
                        type='number'
                        onInput={e => onInput(e)}
                        onBlur={e => onBlur(e)}
                        name='calcAmount'
                        value={calcAmount}
                        onChange={e => setCalcAmount(e.target.value)}
                    />

                </StyledDoubleMenuItem>
            </Flex>

            <Title mt='24px' mb='4px'>Комментарий:</Title>
            <MenuItemWithoutFocus>

                <CustomInput
                    textalign='end'
                    placeholder='Что бы Вы хотели указать'
                    type='text'
                    autoComplete={'off'}
                    name='comment'
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
            </MenuItemWithoutFocus>

        </ResponsiveContainer>

        <MainGoldButton type='submit' disabled={false}>{translate('0031', lang)}</MainGoldButton>


    </CustomForm>
}

export default Permutations