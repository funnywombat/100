import React, { Fragment, useEffect } from "react"
import { Route, Routes, Link, useNavigate } from "react-router-dom"
import { commonTextUa, changeTextUa, procedureTextUa, commonTextRu, changeTextRu, procedureTextRu } from "../common/faqTexts"
import { useTelegram } from '../hooks/useTelegram'
import { useSelector } from "react-redux"
import { translate } from '../translater/translater'
import Flex from "./styledComponent/Flex"
import FaqTemplate from "./FaqTemplate"
import styled from "styled-components"
import NSBackButton from "./newStyledComponents/NSBackButton";
import NSHelpButton from "./newStyledComponents/NSHelpButton";
import ResponsiveContainer from "./styledComponent/ResponsiveContainer"

const StyledLink = styled(Link)`
    padding: 2px 3px 2px 3px;
    background-color: transparent;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    width: auto;
    border-radius: 5px;
`

const Faq = (props) => {

    const {backButton} = useTelegram()
    const navigate = useNavigate()
    const lang = useSelector(state => state.order.lang)



    /*
    * Обработчик кнопки Назад
    **/
    useEffect(() => {
        backButton.show()
        backButton.onClick(() => {navigate('/')})
        return () => {
            backButton.offClick(() => {navigate('/')})
        }
    }, [backButton])

    useEffect(() => {
        navigate('1')
    }, [])

    function goToMain() {
        navigate('/')
    }


    return <ResponsiveContainer direction='column' padding='40px 20px 20px 20px'>
        <Flex align='center' justify='space-between' mt='34px'>
            <NSBackButton onClick={goToMain}>{translate('0010', lang)}</NSBackButton>
            <NSHelpButton/>
        </Flex>
        <Flex justify='space-around' mt='34px'>
            <StyledLink to={'/faq/1'}>{translate('0067', lang)}</StyledLink>
            <StyledLink to={'/faq/2'}>{translate('0068', lang)}</StyledLink>
            <StyledLink to={'/faq/3'}>{translate('0069', lang)}</StyledLink>
        </Flex>
        
        <Routes>
            <Route path='1' element={<FaqTemplate text={lang === 'ua' ? commonTextUa(props.data) : commonTextRu(props.data)}    />} />
            <Route path='2' element={<FaqTemplate text={lang === 'ua' ? changeTextUa(props.data) : changeTextRu(props.data)}/>} />
            <Route path='3' element={<FaqTemplate text={lang === 'ua' ? procedureTextUa(props.data) : procedureTextRu(props.data)} />} />
        </Routes>
        
    </ResponsiveContainer>
}

export default Faq