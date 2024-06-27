import axios from "axios"
import { exchangeTypeNames, statusTypeNames } from "../common/enums"
const tg = window.Telegram.WebApp

const instance = axios.create({
    baseURL: 'https://api.pros100k.com',
})

const initData = tg?.initData
const authData = `Bearer ${initData}`



/**
 * Авторизация
 */
export const auth = async () => {

    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };

    let data = await instance.post('/api/post/auth/', {}, {headers: headers})
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error.message)
            return []
        })

    return data
}



/**
 * Получение всех пар
 */
export const getAllPairs = async () => {


    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };

    let data = await instance.post('/api/post/get-all-pairs/', {}, {headers: headers})
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error.message)
            return []
        })

    return data
}


/**
 * Получение списка Банков
 */
export const getBankNames = async () => {

    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };

    let data = await instance.post('/api/post/get-bank-list/', {}, {headers: headers})
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error.message)
            return []
        })

    return data
}


/**
 * создание заявки
 * @param {Object} order
 */
export const createOrder = async (order)  =>  {

    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };


    let data = await instance.post('/api/post/create-new-order/', {...order}, {headers: headers})
        .then(response => {
            return response
        })
        .catch(error => {
            console.log(error)
            return []
        })


    return data

}


/**
 * создание перестановки
 * @param {Object} order
 */
export const createTransfer = async (order)  =>  {

    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };


    let data = await instance.post('/api/post/create-new-transfer/', {...order}, {headers: headers})
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error)
            return []
        })


    return data

}


/**
 * Получение заявки по пользователю
 * @param {Object} user
 */
export const getOrderByUser = async (userId)  =>  {

    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };

    const body = {
        "order_filter": "user_id",
        "order_query": {
          "user_id": userId
        }
    }


    let data = await instance.post('/api/post/load-order/', body, {headers: headers})
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error)
            return []
        })


    return data

}


/**
 * Получение заявки по пользователю
 * @param {Object} order
 */
export const getOrderById = async (orderId)  =>  {

    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };

    const body = {
        "order_filter": "order_id",
        "order_query": {
          "order_id": orderId
        }
    }

    let data = await instance.post('/api/post/load-order/', body, {headers: headers})
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error.message)
            return []
        })

    return data
}


/**
 * Обновление статуса заявки
 * @param {Object} order
 */
export const setOrderStatus = async (orderId, status)  =>  {


    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };



    const body = {
        "order_id":  orderId,
        "update_info": {
            "status": status
        }
    }

    await instance.post('/api/post/update-order/', body, {headers: headers})
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        console.log(error)
        return []
    })

}


/**
 * Обновление статуса заявки
 * @param {Object} order
 */
export const calculatePrice = async (currency, fiatCurrency, orderType, amount, country, city, calcType)  =>  {

    let result = 0;

    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };

    const amountByType = calcType === 1 ? "amount_1" : "amount_2"
    const amountToReturn = calcType === 1 ? "amount_2" : "amount_1"

    const body = {
        "currency_1": currency,
        "currency_2": fiatCurrency,
        "exchange_type": exchangeTypeNames.cash,
        "order_type": orderType,
        [amountByType]: amount,
        "country": country,
        "city": city
      }


    await instance.post('/api/post/calculate-price/', body, {headers: headers})
    .then(response => {
        result = response.data["calculated_price"] || amount
    })
    .catch(error => {
        console.log(error)
        return []
    })

    return result

}



/**
 * Обновление статуса заявки
 * @param {Object} order
 */
export const calculateBankPrice = async (currency, fiatCurrency, orderType, amount, calcType)  =>  {

    let result = 0;

    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };

    const amountByType = calcType === 1 ? "amount_1" : "amount_2"
    const amountToReturn = calcType === 1 ? "amount_2" : "amount_1"

    const body = {
        "currency_1": currency,
        "currency_2": fiatCurrency,
        "exchange_type": exchangeTypeNames.banking,
        "order_type": orderType,
        [amountByType]: amount,
      }


    await instance.post('/api/post/calculate-price/', body, {headers: headers})
    .then(response => {
        result = response.data["calculated_price"] || amount
    })
    .catch(error => {
        console.log(error)
        return []
    })

    return result

}


/**
 * Обновление статуса заявки
 * @param {Object} order
 */
export const calculateTransferPrice = async (currency, calcType, amount, country, city)  =>  {

    let result = 0;

    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };

    const amountByType = calcType === 1 ? "amount_1" : "amount_2"
    const amountToReturn = calcType === 1 ? "amount_2" : "amount_1"

    const body = {
        "currency": currency,
        "exchange_type": exchangeTypeNames.cash,
        [amountByType]: amount,
        "country": country,
        "city": city
      }

    await instance.post('/api/post/calculate-price/', body, {headers: headers})
    .then(response => {
        console.log(response)
        result = response.data["calculated_price"] || amount
    })
    .catch(error => {
        console.log(error)
        return []
    })

    return amount

}


/**
 * Отправка в админку что юзер оплатил
 * @param {Object} order
 */
export const setUserIsPaid = async (orderId)  =>  {


    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };



    const body = {
        "order_id": orderId,
        "update_info": {
          "status": statusTypeNames.UserPaid
        }
      }

    await instance.post('/api/post/update-order/', body, {headers: headers})
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        console.log(error)
        return []
    })

}



export async function fetchTgInfo () {

    const url = `https://api-dev.pro100k.pro/info/tg_channel_info/`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Ошибка при загрузке данных');
        }


        const blob = await response.blob();
        const blobString = await blob.text()
        const parsedBlob = JSON.parse(blobString)
        return parsedBlob

    } catch (error) {
        console.error('Ошибка:', error);
    }
};


/**
 * Создание заявки на вывод бонуса
 * @param {Object} order
 */
export async function createBonusOrder(walletAdress, network) {

    const request = {
        "exchange_type": "bonus",
        "bonus_withdraw": true,
        "requisites": {
            "chain_network": network,
            "wallet_address": walletAdress
        }
    }

    const headers = {
        'Authorization': authData,
        'Content-Type': 'application/json'
    };


    let data = await instance.post('/api/post/create-new-order/', request, {headers: headers})
        .then(response => {
            return response
        })
        .catch(error => {
            console.log(error)
            return []
        })


    return data



} 


