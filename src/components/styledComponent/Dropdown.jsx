import styled from "styled-components"
import { useState } from "react"
import {ReactComponent as Filter } from "../../images/newStyle/arrowRightWhite.svg"
import { useClickAway } from "@uidotdev/usehooks";
import { useSelector } from "react-redux"


const Dropdown = styled.div`
    position: relative;
    background: transparent;
`

const DropdownButton = styled.button`
    
    position: relative;
    border: 2px solid #3F3F3F;
    border-radius: 12px;
    background: transparent;
    color: #E4E4F0;
    padding: 5px 15px;
    font-size: 1.25em;
    min-width: 220px;
    
`

const DropdownContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const DropdownContent = styled.ul`
    
    position: absolute;
    top: 110%;
    right: 10px;
    padding: 12px;
    max-height: 300px;
    width: max-content;
    overflow-y: auto;
    scrollbar-width: thin;
    border: 2px solid #3F3F3F;
    



    background-color: inherit;
    box-shadow: 3px 3px 10px 6px rgba(0, 0, 0, 0.06);
    border-radius: 5px;
    font-weight: 500;
    font-size: 1.12em;
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
    font-size: 1.25em;
    cursor: pointer;
    transition: all 0.2s;
    

    &:hover {
        border-radius: 5px;
        font-size: 15px;
    }
    
`

const IconThumb = styled.div`
    
    position: absolute;
    right: 15px;
    top: 1em;
    display: inline-flex;
    margin-left: 8px;
    fill: #fff;
    align-items: flex-end;
    //position: absolute;
    //top: -1px;
    //right: 0;
`




const CustomDropdown = ({options, selected, value, setSelected, ...props}) => {

    let [isActive, setIsActive] = useState(false)
    let theme = useSelector(state => state.order.theme)

    const ref = useClickAway(() => {
        setIsActive(false);
    });

    return <Dropdown {...props} theme={theme}>
        <DropdownButton  type='button' onClick={() => setIsActive(!isActive)}>{selected ? selected : value}
        <IconThumb>
            <Filter height='15' width='15' />
        </IconThumb>
        </DropdownButton>

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

    </Dropdown>
}


export default CustomDropdown
