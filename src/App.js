import {useEffect, useState} from 'react'
import {useTelegram} from './hooks/useTelegram'
import {useDispatch} from 'react-redux'
import {Route, Routes, Navigate} from 'react-router-dom'
import {changeTheme} from './store/orderSlice'

import Payment from './components/Payment'
import Main from './components/Main'
import CashForm from './components/CashForm'
import Order from './components/Order'
import Permutations from './components/Permutations'
import CardForm from './components/CardForm'
import CheckOrder from './components/CheckOrder'
import Faq from './components/Faq'
import AdressPage from './components/AdressPage'
import Referal from './components/Referal'
import ComulativeProgram from './components/ComulativeProgram'
import LoyaltyProgram from './components/LoyaltyProgram'
import {auth} from './api/api'
import OrderList from "./components/OrdersList";
import {exchangeTypeNames, orderTypeNames, statusTypeNames} from "./common/enums";
import Settings from './components/Settings'

function App() {

    const {tg, user, langCode} = useTelegram();
    const dispatch = useDispatch()

    let [order, setOrder] = useState({})
    let [orderByCard, setOrderByCard] = useState({})
    let [perm, setPerm] = useState({})
    let [userData, setUserData] = useState([])
    let [userOrders, setUserOrders] = useState({})


    const [multiData, setMultiData] = useState({})
    let username = user ? user.username : '-'


    /*
     * Изменение темы в зависимости от темы телеграма
     *
     **/
    function checkThemeChange(scheme) {
        if (scheme && (scheme === 'light')) {
            dispatch(changeTheme(false))
        } else {
            dispatch(changeTheme(false))
        }


    }

    function filteringOrders(filter) {

        if (!userOrders) return

        let filteredOrders = []

        if (filter === "Отменён") {
            filteredOrders = userOrders.filter(o => o.status === statusTypeNames.OrderCancelled)
        } else if (filter === "Выполнен") {
            filteredOrders = userOrders.filter(o => o.status === statusTypeNames.OrderComplete)
        } else if (filter === "Активные") {
            filteredOrders = userOrders.filter(o => o.status !== statusTypeNames.OrderCancelled && o.status !== statusTypeNames.OrderComplete)
        } else if (filter === "Наличные") {

        } else if (filter === "Банковский") {

        }


        return filteredOrders;
    }

    function filteringByType(filter) {
        if (!userOrders) return

        let filteredOrders = []

        if (filter === "Трансфер") {
            filteredOrders = userOrders.filter(o => o.exchange_type === exchangeTypeNames.transfer)
        } else if (filter === "Продажа") {
            filteredOrders = userOrders.filter(o => o.order_type === orderTypeNames.sell)
        } else {
            filteredOrders = userOrders.filter(o => o.order_type === orderTypeNames.buy)
        }
        return filteredOrders;
    }

    function filteringByKind(filter) {
        if (!userOrders) return

        let filteredOrders = []

        if (filter === "Банковский") {
            filteredOrders = userOrders.filter(o => o.exchange_type === exchangeTypeNames.banking)
        } else {
            filteredOrders = userOrders.filter(o => o.exchange_type === exchangeTypeNames.cash)
        }


        return filteredOrders;
    }


    async function getUserOrders() {
        const data = await auth()
        if (data) {
            setUserData({...data})

            setUserOrders(data.user_orders)
        }
    }

    useEffect(() => {
        getUserOrders()
    }, [])

    useEffect(() => {
        let timer = setInterval(() => {
            getUserOrders()
        }, 4000)
        return () => {
            clearInterval(timer)
        }
    }, [])


    useEffect(() => {
        const data = {
            support_url: "t.me/tezzt2024"
        }
        setMultiData(data)
    }, [])


    useEffect(() => {
        tg.ready()
        tg.expand()

    }, [tg])


    return (
        <Routes>
            <Route index element={<Main order={order} setOrder={setOrder} multiData={multiData}/>}/>

            <Route
                path={'/form'}
                element={<CashForm
                    user={username}
                    order={order}
                    setOrder={setOrder}
                    multiData={multiData}/>}
            />

            <Route
                path={'/check'}
                element={<CheckOrder order={order}
                                     setOrder={setOrder}/>}
            />

            <Route
                path={'/formByCard'}
                element={<CardForm
                    user={username}
                    order={orderByCard}
                    payType='bank'
                    setOrder={setOrderByCard}
                    multiData={multiData}/>}
            />
            <Route
                path={'/settings'}
                element={<Settings/>}
            />

            <Route
                path={'/checkByCard'}
                element={<CheckOrder
                    order={orderByCard}
                    setOrder={setOrderByCard}/>}
            />

            <Route
                path={'/permutations'}
                element={<Permutations
                    user={username}
                    order={perm}
                    setOrder={setPerm}
                    multiData={multiData}/>}
            />

            <Route
                path={'/checkPerm'}
                element={<CheckOrder order={perm} setOrder={setPerm}/>}
            />

            <Route
                path={'/order/:order_id'}
                element={<Order/>}
            />

            <Route
                path={'/payment/:order_id'}
                element={<Payment/>}
            />

            <Route
                path={'/payment_buy/:order_id'}
                element={<AdressPage/>}
            />

            <Route
                path={'/faq/*'}
                element={<Faq
                    data={multiData}/>}
            />


            <Route
                path={'/loyalty'}
                element={<LoyaltyProgram multiData={multiData} user={user} userData={userData}/>}

            />

            <Route
                path={'/comulative'}
                element={<ComulativeProgram multiData={multiData} user={user} userData={userData}/>}

            />


            <Route
                path={'/referal'}
                element={<Referal
                    multiData={multiData}
                    user={user}
                    userData={userData}
                />}
            />


            <Route

                path={'/orderList'}
                element={
                    <OrderList
                        orders={userOrders}
                        getUserOrders={getUserOrders}
                        filteringOrders={filteringOrders}
                        filteringByType={filteringByType}
                        filteringByKind={filteringByKind}
                    />}
            />

            <Route
                path={'*'}
                element={< Navigate to='/'/>}
            />
        </Routes>
    );
}

export default App;
