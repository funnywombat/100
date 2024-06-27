import styled from "styled-components"
import Text from "../styledComponent/Text"
import DividerMiniNS from "./DividerMiniNS";
import CustomInput from "../styledComponent/CustomInput";
import React from "react";

const StyledDoubleMenuItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-radius: 12px;
    border: 2px solid #3F3F3F;
    padding: 19px 9px;
    width: calc(50% - 10px);
    background-color: #1C1C1E;
`

const DoubleMenuItemWithInput = (props) => {
    return <StyledDoubleMenuItem {...props}>
        <Text>{props.text1}</Text>
        <DividerMiniNS />
        <CustomInput
            type='number'
            autoComplete={'off'}
            onInput={props.onInput}
            onBlur={props.onBlur}
            name={props.name}
            value={props.value}
            onChange={onChange}
            onScroll={e => e.preventDefault()}
        />

    </StyledDoubleMenuItem>
}

export default DoubleMenuItemWithInput