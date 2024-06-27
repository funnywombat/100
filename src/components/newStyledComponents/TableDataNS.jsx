import styled from "styled-components"
import Title from "../styledComponent/Title"
import Flex from "../styledComponent/Flex"
import Text from "../styledComponent/Text"
import { useState } from "react"


const TableItem = styled.li`
    span {
        background: transparent;
        color: #E4E4F0;
    }
`


const StyledTableDataNS = styled.span`
    
    display: flex;
    flex-direction: column;
    width: 100%;
    
    & ul {
        margin: 0;
        padding: 0;
        background-color: #1C1C1E;
        text-align: center;
        overflow: hidden;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }
    
    & .table {
        display: flex;
        flex-direction: column;
        padding: 18px 20px 0px 20px;    
        border: 2px solid #363636;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        border-bottom: none;
        font-size: 1.3em;
    }
    
    & .divider {
        height: 3px;
        width: 100%;
        background-color: #363636;
    }
    
    & .tableBtn {
        height: 48px;
        font-size: 1.3em;
        text-align: center;
        background: linear-gradient(135deg, #DCBA41, #766423);
        color: #E4E4F0;
        border: none;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
`

export default function TableDataNS(props) {
    const [isColapsed, setIsColapsed] = useState(false)

    return <StyledTableDataNS {...props}>
        <Title mb='8px' alignself='start'>{props.title}</Title>
        <ul className="table" style={{height: isColapsed ? "max-content": "72px"}}>
            {
                props.transactions.length ? props.transactions.map((t, index) => <TableItem key={index}>
                    <div className="divider"></div>
                    <Flex align='center' justify='space-between' padding='8px 22px 8px 22px'>
                        <Text >{t.timestamp}</Text>
                        <Text color='#7A7A7A'>Начислено {t.operation_value}$</Text>
                    </Flex>
                </TableItem>)
                    : <Text >У вас пока нет транзакций</Text>
            }

        </ul>
        <button className='tableBtn' style={{background: isColapsed && "#7A7A7A" }} onClick={() => setIsColapsed(!isColapsed)} type='button'>{isColapsed ? "Свернуть" : "Развернуть"}</button>

    </StyledTableDataNS>
}