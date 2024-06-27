import Flex from "./styledComponent/Flex"
import Text from "./styledComponent/Text" 
import styled from "styled-components"
import { useSelector } from "react-redux"
import _isEmpty from "lodash/isEmpty"
import { useEffect, useState } from "react"


const List = styled.ul`
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    background: ${props => props.theme ? '#1c1c1e' : '#ffffff'};
    & li {
        display: flex; 
    }
`


const ReferalTransactions = ({transactions}) => {

    const theme = useSelector(state => state.order.theme)


    return(
        <Flex>

            <List style={{backgroundColor: theme ? '#ffffff' : '#1c1c1e', minHeight: '60px'}}>
            {
                !_isEmpty(transactions) ? transactions.map(trans => 
                    <li key={trans.id}>
                        <Flex justify="space-between">
                            <Text>{trans.timestamp}</Text>
                            <Text>{trans.operation_value}</Text>
                        </Flex>
                    </li>
                )
                
                : <Text>У вас пока нет транзакций</Text>
            }
            </List>
        </Flex>
    )
}

export default ReferalTransactions