import React, {useCallback, useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {useNavigate} from "react-router"
import {useClipboard} from "use-clipboard-copy"
import {translate} from "../translater/translater"

import _isEmpty from "lodash/isEmpty"
import _filter from "lodash/filter"
import Notiflix from "notiflix"

import Flex from "./styledComponent/Flex"
import Text from "./styledComponent/Text"
import Title from "./styledComponent/Title"
import GoldText from "./styledComponent/TextGold"
import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import GradientContainer from "./newStyledComponents/GradientContainer";
import TableDataNS from "./newStyledComponents/TableDataNS";
import MenuItemShort from "./newStyledComponents/MenuItemShort";
import {useTelegram} from "../hooks/useTelegram";
import ReferalFriendList from "./ReferalFriendList";
import ResponsiveContainer from "./styledComponent/ResponsiveContainer"

export default function Referal(props) {

    const lang = useSelector(state => state.order.lang)
    const navigate = useNavigate()
    const clipboard = useClipboard()


    const [refLink, setRefLink] = useState("")
    const [bonusBallance, setBonusBallance] = useState(0)
    const [myFriends, setMyFriends] = useState([])
    const [refTransactions, setRefTransactions] = useState([])
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
            navigate('/loyalty')
        })
        return () => {
            backButton.offClick(() => {
                navigate('/loyalty')
            })
        }
    }, [backButton])


    useEffect(() => {

        let friends = []
        let amount = props.userData.referral_amount || 0

        setBonusBallance(amount)

        if (props.userData.referral_id) {
            let link = `https://t.me/pros100k_bot/pros100k_app?startapp=${props.userData.referral_id}`
            setRefLink(link)
        }

        if (!_isEmpty(props.userData.level1_users)) {

            for (let user of props.userData.level1_users) {
                friends.push({
                    level: 1,
                    username: user
                })
            }
        }

        if (!_isEmpty(props.userData.level2_users)) {
            for (let user of props.userData.level2_users) {
                friends.push({
                    level: 2,
                    username: user
                })
            }
        }

        const allTrans = props.userData.bonus_transactions

        if (!_isEmpty(allTrans)) {
            const refTrans = _filter(allTrans, t => t.username !== null)
            setRefTransactions(refTrans)
        }

        console.log(friends);

        if (!_isEmpty(friends)) {
            setMyFriends(friends)
        }

    }, [props.userData])


    const copy = useCallback(
        () => {

            if (refLink) {
                clipboard.copy(JSON.stringify(refLink))
                const message = translate('0060', lang)
                Notiflix.Notify.success(message)
            }

        }, [clipboard]
    );

    const share = useCallback(
        () => {

            window.open(`https://t.me/share/url?url=t.me/pros100k_bot/pros100k_app?startapp=${props.userData.referral_id}`)

        }, []
    );

    return (

        <ResponsiveContainer direction='column' padding='50px 20px 10px 20px'>
            <Flex align='center' justify='space-between'>
                <NSBackButton onClick={goBack}>{translate('0010', lang)}</NSBackButton>
                <NSHelpButton/>
            </Flex>

            <Title alignself='center' mt='34px' mb='28px'>Реферальная программа</Title>

            <Text aligntext='start'>Реферальная ссылка:</Text>

            <GradientContainer padding='40px 20px 20px 20px'>
                <Flex direction='column' align='center'>
                    <GoldText>{bonusBallance}$</GoldText>
                    <Text width='100%' mt='24px'>{props.userData.referral_id && props.userData.referral_id}</Text>

                    <Flex mt='10px' style={{gap:'10px'}}>
                        <MenuItemShort onClick={copy} style={{cursor:"pointer"}} text='Копировать'/>
                        <MenuItemShort onClick={share} style={{cursor:"pointer"}} text='Поделится'/>

                    </Flex>
                </Flex>
            </GradientContainer>

            <Title mt='34px' mb='8px' alignself='start'>Моя команда:</Title>
            <ReferalFriendList friends={myFriends}/>

            <Title mt='34px' alignself='start'>История начислений:</Title>
            <TableDataNS transactions={refTransactions}/>

        </ResponsiveContainer>

    )
}
