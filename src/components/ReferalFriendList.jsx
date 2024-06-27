import styled from "styled-components"
import Title from "./styledComponent/Title"
import Flex from "./styledComponent/Flex"
import Text from "./styledComponent/Text"
import _isEmpty from "lodash/isEmpty";
import {useState} from "react";

const TableItem = styled.li`
    span {
        background: transparent;
        color: #E4E4F0;
    }
`

const StyledTableDataNS = styled.ul`
    
    display: flex;
    flex-direction: column;
    width: 100%;
    
    & ul {
        margin: 0;
        padding: 18px 20px 0px 20px;
        background-color: #1C1C1E;
        text-align: center;
        overflow: hidden;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
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

export default function ReferalFriendList({friends}, props) {
    const [isColapsed, setIsColapsed] = useState(false)
    return <StyledTableDataNS {...props}>
        <ul className="table" style={{height: isColapsed ? "max-content": "72px"}}>
            {
                !_isEmpty(friends)
                    ? friends.map((friend, index) => <TableItem key={index}>
                        <div className="divider"></div>
                        <Flex align='center' justify='space-between' padding='8px 22px 8px 22px'>
                            <Text >{friend.level} уровень</Text>
                            <Text>{friend.username}</Text>
                        </Flex>
                    </TableItem>)

                    : <Text>У вас пока нет никого в команде</Text>
            }
        </ul>
        <button className='tableBtn' style={{background: isColapsed && "#7A7A7A" }} onClick={() => setIsColapsed(!isColapsed)} type='button'>{isColapsed ? "Свернуть" : "Развернуть"}</button>

    </StyledTableDataNS>
}