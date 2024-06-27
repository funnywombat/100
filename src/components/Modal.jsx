import { useState } from "react"
import Flex from "./styledComponent/Flex"
import Text from "./styledComponent/Text"
import styled from "styled-components"
import CustomInput from "./styledComponent/CustomInput"
import CustomDropdown from "./styledComponent/Dropdown"
import InputThumb from "./styledComponent/InputThumb"
import GroupLeftText from "./styledComponent/GroupLeftText"
import CashGroup from "./styledComponent/CashGroup"
import LineLong from "./styledComponent/LineLong"
import Notiflix from "notiflix"
import ButtonSilverGold from "./styledComponent/ButtonSilverGold"
import { useSelector } from "react-redux"
import { createBonusOrder } from "../api/api"

const ModalWrapper = styled.div`
    display: ${props => props.active ? "flex" : "none"};
    position: absolute;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.9);
`

const ModalContent = styled.div`
    display: flex; 
    border-radius: 10px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    height: 40%;
    width: 90%;
    background-color: ${props => props.theme === true ? '#ffffff' : '#1c1c1e'};
`


export default function Modal(props) {

    const theme = useSelector(state => state.order.theme)
    const lang = useSelector(state => state.order.lang)

    const [wallet, setWallet] = useState("")
    const [transferNetwork, setTransferNetwork] = useState("TRC")


    const onSubmit = async () => {

        if (!wallet) {
            return Notiflix.Notify.warning("Укажите адрес кошелька")
        }

        
        let result = await createBonusOrder(wallet, transferNetwork)
        console.log(result)

        
        setWallet("")
        Notiflix.Notify.success("Запрос на вывод бонусных средств успешно отправлен")
        props.onClose()
    }

    return(
        <ModalWrapper {...props} onClick={props.onClose}>
            <ModalContent onClick={event => event.stopPropagation()} theme={theme}>
                <Text style={{width: "90%"}}>
                    Укажите реквизиты для начисления
                </Text>

                <CashGroup>
                    <InputThumb>

                        <GroupLeftText>Кошелек</GroupLeftText>

                        <CustomInput 
                            type='text' 
                            value={wallet}
                            onChange={e => setWallet(e.target.value)}
                        />
                    </InputThumb>

                    <LineLong />

                    <InputThumb>

                        <GroupLeftText>Сеть перевода</GroupLeftText>
                        
                        <CustomDropdown 
                            options={["TRC", "ERC"]} 
                            selected={transferNetwork}
                            setSelected={setTransferNetwork} 
                            value={transferNetwork}
                        /> 

                    </InputThumb>
                </CashGroup>
                

                <Flex justify="space-around">
                    <ButtonSilverGold width="40%" onClick={onSubmit}>Ок</ButtonSilverGold>
                    <ButtonSilverGold width="40%" onClick={props.onClose}>Отмена</ButtonSilverGold>
                </Flex>
            </ModalContent>
        </ModalWrapper>
    )
}