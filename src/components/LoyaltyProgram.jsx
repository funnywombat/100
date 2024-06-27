import React, {useEffect, useState} from "react"
import {translate} from "../translater/translater"
import {useSelector} from "react-redux"
import {useNavigate} from "react-router"
import {ReactComponent as Accumulate} from "../images/newStyle/accumulate.svg"
import {ReactComponent as RefIcon} from "../images/newStyle/referal.svg"
import {useTelegram} from "../hooks/useTelegram"

import Flex from "./styledComponent/Flex"
import CustomNavLink from "./styledComponent/CustomNavLink"
import Title from "./styledComponent/Title"
import MenuItemText from "./styledComponent/MenuItemText"
import CustomTextArea from "./styledComponent/CustomTextArea"
import Modal from "./Modal"
import GoldText from "./styledComponent/TextGold"
import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import NewMenuItem from "./newStyledComponents/MenuItem";
import GradientContainer from "./newStyledComponents/GradientContainer";
import TableDataNS from "./newStyledComponents/TableDataNS";
import MainGoldButton from "./newStyledComponents/MainGoldButton";
import _isEmpty from "lodash/isEmpty";
import ResponsiveContainer from "./styledComponent/ResponsiveContainer"

const transactions = [
    {
        date: "24.05.2025",
        amount: 1.4
    },
    {
        date: "24.05.2025",
        amount: 1.4
    },
    {
        date: "24.05.2025",
        amount: 1.4
    },
]

export default function LoyaltyProgram(props) {

    const lang = useSelector(state => state.order.lang)
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(0)
    const [isDisable, setIsDisable] = useState(1)
    const [bonusAmout, setBonusAmout] = useState(0)
    const [transactions, setTransactions] = useState(0)
    const {backButton} = useTelegram()


    useEffect(() => {

        const allTrans = props.userData.bonus_transactions
        if (!_isEmpty(allTrans)) {
            setTransactions(allTrans)
        }

    }, [props.userData])


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
                navigate('/loyalty')
            })
        }
    }, [backButton])


    useEffect(() => {

        if (props.userData) {
            let amount = (props.userData.accumulated_value + props.userData.referral_amount) || 0

            setBonusAmout(amount)
        }

    }, [props.userData])


    useEffect(() => {
        if (bonusAmout && bonusAmout >= 50) {
            setIsDisable(0)
        }

    }, [bonusAmout])

    const closeModal = () => {
        setShowModal(0)
    }

    const goBack = () => {
        navigate('/')
    }


    const getAmount = async () => {
        setShowModal(1)
    }


    return (
        <ResponsiveContainer direction='column' padding='50px 20px 20px 20px'>

            <Flex align='center' justify='space-between'>
                <NSBackButton onClick={goBack}>{translate('0010', lang)}</NSBackButton>
                <NSHelpButton/>
            </Flex>

            <Title alignself='center' mt='40px' mb='34px'>Поощрение лояльности</Title>


            <NewMenuItem onClick={() => navigate('/referal')}>
                <CustomNavLink to={'/referal'}>
                    <MenuItemText>{translate('0094', lang)}</MenuItemText>
                </CustomNavLink>
                <RefIcon height='40' width='40'/>
            </NewMenuItem>

            <NewMenuItem onClick={() => navigate('/comulative')}>
                <CustomNavLink to={'/comulative'}>
                    <MenuItemText>{translate('0095', lang)}</MenuItemText>
                </CustomNavLink>
                <Accumulate height='40' width='40'/>
            </NewMenuItem>

            <GradientContainer mb="0px" padding='40px 40px 10px 40px'>
                <Flex direction='column' align='center' justify='center'>

                    <Title alignself='center' mb='14px'>Бонусный счет</Title>

                    <GoldText size='50px' ml='10px'>{bonusAmout}$</GoldText>

                        <CustomTextArea
                            size='18px'
                            style={{opacity: "0.6"}}
                            rows='5'
                            value={"Ваш бонусный счет, сумма бонусных средств из реферальной программы, и программы накопления"}
                            readOnly
                        />



                </Flex>
            </GradientContainer>

            <Title mt='34px' alignself='start'>История начислений</Title>
            <TableDataNS transactions={transactions}/>

            <CustomTextArea style={{opacity: "0.6"}} rows='5' value={translate('0099', lang)} readOnly/>

            <MainGoldButton disabled={isDisable} background={isDisable && 'grey'}
                           style={{position: "fixed", bottom: 0, right: 0}}
                           onClick={getAmount}> {translate('0098', lang)}</MainGoldButton>
            <Modal active={showModal} onClose={closeModal}/>
        </ResponsiveContainer>
    )
}