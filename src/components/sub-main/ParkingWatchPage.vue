<template>
    <v-layout column>
        <div class="headline">停车场容量: 10</div>
        <div class="title">停车场状态:
            <span class="body-2">{{carInfo.length > 0? carInfo[carInfo.length - 1].stopMessage : '加载中'}}</span>
        </div>
        <div class="title">道路状态:
            <span class="body-2">{{carInfo.length > 0? carInfo[carInfo.length - 1].roadMessage : '加载中'}}</span>
        </div>
        <v-timeline>
            <v-timeline-item small v-for="(item, index) in carInfo" :key="index">
                <span slot="opposite">{{item.car}}
                    {{item.action === 'wait' ?
                    '在道路上等待' : item.action === 'in' ?
                    '进入了停车场' : `离开了停车场, 停留了${item.time}s, 花费为${item.count}`}}
                </span>
            </v-timeline-item>
        </v-timeline>
        <v-snackbar
                v-model="initBack"
                :color="initColor"
                :timeout="2000">
            {{initMessage}}
            <v-btn dark flat @click="initBack = false">关闭</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "ParkingWatchPage",
        data: () => {
            return {
                carInfo: [],
                initBack: false,
                initColor: '',
                initMessage: '',
                timeId: ''
            }
        },
        methods: {
            getCarInfo() {
                axios.post("http://localhost:8081/user/carInfo").then((res) => {
                    if (res.data.status === 'ok') {
                        if (res.data.data != null) {
                            if (this.carInfo.length === 10) {
                                this.carInfo.shift();
                            }
                            this.carInfo.push(res.data.data);
                        }
                    } else {
                        this.initBack = true;
                        this.initColor = 'error';
                        this.initMessage = '未知错误';
                    }
                }).catch(() => {
                    clearInterval(this.timeId)
                })
            }
        },
        mounted() {
            this.timeId = setInterval(() => {
                this.getCarInfo()
            }, 900)
        },
        destroyed() {
            clearInterval(this.timeId)
        }
    }
</script>

<style scoped>

</style>