import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from './components/LoginPage'
import MainPage from './components/MainPage'
import ScenicGraphPage from './components/sub-main/ScenicGraphPage'
import ScenicManagePage from './components/sub-main/ScenicManagePage'
import ParkingWatchPage from './components/sub-main/ParkingWatchPage'
import PathCalculatePage from "./components/sub-main/PathCalculatePage";

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'LoginPage',
            component: LoginPage
        },
        {
            path: '/main',
            name: 'MainPage',
            component: MainPage,
            children: [
                {
                    path: '/scenic-graph',
                    component: ScenicGraphPage,
                    name: 'ScenicGraphPage'
                },
                {
                    path: '/scenic-manage',
                    component: ScenicManagePage,
                    name : 'ScenicManagePage'
                },
                {
                    path: '/parking-watch',
                    component: ParkingWatchPage,
                    name: 'ParkingWatchPage'
                },
                {
                    path: '/path-calculate',
                    component: PathCalculatePage,
                    name: 'PathCalculatePage',
                    prop: true
                }
            ]
        }
    ]
})