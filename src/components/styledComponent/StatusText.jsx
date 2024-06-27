import React from "react"
import styled from "styled-components"
import { useSelector } from "react-redux"
import { statusTypeNames } from "../../common/enums"

const StyledText = styled.span`
    color: #7A7A7A;
    font-size: 1.125em;
    font-weight: 500;
    text-align: end;

`

const StatusText = (props) => {
    const theme = useSelector(state => state.order.theme)
    return <StyledText {...props} theme={theme}/>
}

export default StatusText;