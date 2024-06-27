

export const exchangeTypeNames = {
    "banking": "BANKING",
    "cash": "CASH",
    "transfer": "TRANSFER",
    "all": "ALL",
}

export const orderTypeNames = {
    "buy": "BUY",
    "sell": "SELL",
}

export const priceTypeNames = {
    "static": "STATIC",
    "live": "LIVE",
}

export const statusTypeNames = {
    OrderInitiated: "ORDER_INITIATED",
    OrderAccepted: "ORDER_ACCEPTED",
    PaymentPending: "PAYMENT_PENDING",
    UserPaid: "USER_PAID",
    PaymentVerified: "PAYMENT_VERIFIED",
    InEscrow: "IN_ESCROW",
    OrderComplete: "ORDER_COMPLETE",
    OrderCancelled: "ORDER_CANCELLED",
    OrderFailed: "ORDER_FAILED",
    OrderExpired: "ORDER_EXPIRED",
}

export const filterTypes = {
    'active': "ACTIVE", 
    'finished': "FINISHED"
}


export const exchangeTypes = [
    'Наличные', 
    'Безналичные',
    'Трансфер',
    'Все',
]



const valuesToTranslate = [
    {value: statusTypeNames.OrderInitiated, label: "Ожидает подтверждение менеджера"},
    {value: statusTypeNames.OrderAccepted, label: "Принят"},
    {value: statusTypeNames.PaymentPending, label: "Ожидание оплаты"},
    {value: statusTypeNames.UserPaid, label: "Проверка оплаты"},
    {value: statusTypeNames.PaymentVerified, label: "Средства переведены пользователю"},
    {value: statusTypeNames.InEscrow, label: "Оплата подтверждена"},
    {value: statusTypeNames.OrderComplete, label: "Выполнен"},
    {value: statusTypeNames.OrderCancelled, label: "Отменен"},
]


export const transferNetworkNames  = {
    "TRC": "TRC",
    "ERC": "ERC",
    "BTC": "BTC",
    "BEP": "BEP",
    "TON": "TON",
    "SOL": "SOL",


}



/*
* Статусы заявок
*/
export const orderStatuses = [
    {value: statusTypeNames.OrderInitiated, label: "Ожидает подтверждение менеджера"},
    {value: statusTypeNames.OrderAccepted, label: "Принят"},
    {value: statusTypeNames.PaymentPending, label: "Ожидание оплаты"},
    {value: statusTypeNames.UserPaid, label: "Проверка оплаты"},
    {value: statusTypeNames.PaymentVerified, label: "Оплата подтверждена"},
    {value: statusTypeNames.InEscrow, label: "Средства переведены пользователю"},
    {value: statusTypeNames.OrderComplete, label: "Выполнен"},
    {value: statusTypeNames.OrderCancelled, label: "Отменен"},
]




export const translate = (val) => {

    for (let row of valuesToTranslate) {

        if (val === row.label) {
           return row.value
        }   
    }
    
}


export const valueTranslate = (val) => {

    for (let row of valuesToTranslate) {

        if (val === row.value) {
           return row.label
        }   
    }
    
}