import styled from "styled-components"
import { useState } from "react"
import {ReactComponent as Filter } from "../../images/svg/filter.svg"
import { useClickAway } from "@uidotdev/usehooks";
import { useSelector } from "react-redux"


const Dropdown = styled.div`
    position: relative;
    background: transparent;
`

const DropdownButton = styled.button`
    
    border: none;
    margin-right: 20px;
    background: transparent;
    color: #41A8DC;
    font-size: 18px;
    display: flex;
    width: max-content;
    align-items: flex-end;
    justify-content: space-between;

    
`

const DropdownContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const DropdownContent = styled.ul`
    
    position: absolute;
    bottom: 110%;
    right: 10px;
    padding: 10px;
    width: max-content;


    background-color: inherit;
    box-shadow: 3px 3px 10px 6px rgba(0, 0, 0, 0.06);
    border-radius: 5px;
    font-weight: bold;
    z-index: 1;

    &::-webkit-scrollbar {
        width: 7px; /* ширина для вертикального скролла */
        height: 8px; /* высота для горизонтального скролла */
        background-color: #41A8DC;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #143861;
    }

`

const DropdownItem = styled.li`
    padding: 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 17px;
    

    &:hover {
        border-radius: 5px;
        font-size: 15px;
    }
    
`

const IconThumb = styled.div`
    
    display: block;
    position: absolute;
    top: -1px;
    right: 0;
`


const CustomDropdownUp = ({options, selected, value, setSelected, ...props}) => {

    let [isActive, setIsActive] = useState(false)
    const theme = useSelector(state => state.order.theme)
    
    const ref = useClickAway(() => {
        setIsActive(false);
    });

    return <Dropdown {...props} theme={theme}>
        <DropdownButton  type='button' onClick={() => setIsActive(!isActive)}>{selected ? selected : value}</DropdownButton>
        
        <DropdownContainer style={{backgroundColor: theme === true ? '#eeeeee' : '#1c1c1e'}}>
            <DropdownContent ref={ref} style={{display: isActive ? 'block' : 'none', color: theme ? '#1c1c1e' : '#eeeeee'}}>

                {
                    isActive &&  options.map(o => {
                    return <DropdownItem 
                                    key={o}
                                    onClick={() => {
                                        setSelected(o)
                                        setIsActive(false)
                                    }}
                                >
                                    {o}
                                </DropdownItem>
                            

                    })

                }
            </DropdownContent>
        </DropdownContainer>
        <IconThumb>
            <Filter height='15' width='15' />
        </IconThumb>

    </Dropdown>
}


export default CustomDropdownUp
