import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { translate } from "../translater/translater"
import {useTelegram} from "../hooks/useTelegram";
import _isEmpty from "lodash/isEmpty"
import _filter from "lodash/filter"

import Flex from "./styledComponent/Flex"
import Title from "./styledComponent/Title"
import Text from "./styledComponent/Text"
import CustomTextArea from "./styledComponent/CustomTextArea"
import GoldText from "./styledComponent/TextGold"
import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import GradientContainer from "./newStyledComponents/GradientContainer";
import TableDataNS from "./newStyledComponents/TableDataNS";
import ResponsiveContainer from "./styledComponent/ResponsiveContainer"

export default function ComulativeProgram(props) {

    const lang = useSelector(state => state.order.lang)
    const navigate = useNavigate()
    const {backButton} = useTelegram()
    const [comulativeAmount, setComulativeAmount] = useState(0)
    const [accTransactions, setAccTransactions] = useState([])

    /*
    * Обработчик кнопки Назад
    **/
    useEffect(() => {
        backButton.show()
        backButton.onClick(() => {
            navigate('/loyalty')
        })
        return () => {
            backButton.offClick(() => {
                navigate('/loyalty')
            })
        }
    }, [backButton])



    useEffect(() => {
        let amount = props.userData.accumulated_value || 0
        setComulativeAmount(amount)

        const allTrans = props.userData.bonus_transactions
        if (!_isEmpty(allTrans)) {
            const accTrans = _filter(allTrans, t => t.username === null)
            console.log(accTrans);
            setAccTransactions(accTrans)

        }

    }, [props.userData])

    const goBack = () => {
        navigate('/')
    }


    return(
        <ResponsiveContainer direction='column' padding='20px 20px 0px 20px'>

            <Flex align='center' justify='space-between'>
                <NSBackButton onClick={goBack}>{translate('0010', lang)}</NSBackButton>
                <NSHelpButton />
            </Flex>

            <Title alignself='center' mt='40px' mb='34px'>Накопительная программа</Title>

            <Text aligntext='start'>Накопительная программа:</Text>
            <GradientContainer padding='50px 20px'>
                <Flex direction='column' align='center'>
                    <GoldText>{comulativeAmount}$</GoldText>
                    <Text>Ваш балланс</Text>
                </Flex>
            </GradientContainer>

            <Title mt='34px' alignself='start'>История начислений</Title>
            <TableDataNS transactions={accTransactions}/>

            <CustomTextArea rows={8} style={{opacity: "0.6"}} value={translate('0100', lang)} readOnly />

        </ResponsiveContainer>
    )
}