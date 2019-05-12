<template>
    <v-form v-model="valid">
        <v-layout column>
            <v-layout>
                <v-select
                        v-model="start"
                        :items="points"
                        item-text="name"
                        label="起点"
                        required
                ></v-select>
                <v-select
                        v-model="end"
                        :items="points"
                        item-text="name"
                        label="终点"
                        required
                        style="margin-left: 16px"
                ></v-select>
            </v-layout>
            <v-layout column align-center>
                <v-layout>
                    <v-btn color="primary" @click="getMinPath">计算最短路径</v-btn>
                    <v-btn color="primary" @click="getMinCyclePath">计算导游路线图</v-btn>
                </v-layout>
            </v-layout>
            <v-layout v-if="result.first.length > 0" column align-center>
                <span class="headline" v-if="result.first.length > 0">计算结果如下, 总距离为：{{result.second}}</span>
                <v-breadcrumbs :items="result.first">
                    <template slot="item" slot-scope="props">
                        <v-tooltip bottom>
                            <div slot="activator">
                                <v-icon>directions_walk</v-icon>
                                {{ props.item.first.name }}
                            </div>
                            <span>{{result.first.length - 1 !== result.first.indexOf(props.item)?
                                `下一步: ${props.item.second.name} 距离: ${props.item.third}`: `终点: ${props.item.first.name}`}}
                            </span>
                        </v-tooltip>
                    </template>
                    <v-icon slot="divider">forward</v-icon>
                </v-breadcrumbs>
            </v-layout>
        </v-layout>
        <v-snackbar
                v-model="initBack"
                :color="initColor"
                :timeout="2000">
            {{initMessage}}
            <v-btn dark flat @click="initBack = false">关闭</v-btn>
        </v-snackbar>
    </v-form>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "PathCalculatePage",
        data: () => {
            return {
                valid: false,
                initBack: false,
                initColor: '',
                initMessage: '',
                points: [],
                start: '',
                end: '',
                result: {
                    first: [],
                    second: 0
                },
            }
        },
        methods: {
            initGraph() {
                axios.post("http://localhost:8081/init").then((res) => {
                    if (res.data.status === 'ok') {
                        this.points = res.data.data;
                    } else {
                        this.initBack = false;
                        this.initColor = 'error';
                        this.initMessage = '未知错误'
                    }
                }).catch(() => {
                    this.initBack = false;
                    this.initColor = 'error';
                    this.initMessage = '服务器暂时无法处理您的请求'
                });
            },
            getMinPath() {
                if (!(!!this.start && !!this.end)) {
                    this.initBack = true;
                    this.initColor = 'error';
                    this.initMessage = '起始点和终点不能为空';
                    return
                }
                if (this.start === this.end) {
                    this.initBack = true;
                    this.initColor = 'error';
                    this.initMessage = '起始点和终点不能相同';
                    return
                }
                axios.post("http://localhost:8081/user/getMinPath", {
                    start: this.start,
                    end: this.end
                }).then((res) => {
                    if (res.data.status === 'ok') {
                        this.result = res.data.data;
                        let last = this.result.first[this.result.first.length - 1].second;
                        this.result.first.push({
                            first: last,
                            second: null,
                            weight: 0
                        })
                    } else {
                        this.initBack = true;
                        this.initColor = 'error';
                        this.initMessage = '未知错误'
                    }
                }).catch(() => {
                    this.initBack = true;
                    this.initColor = 'error';
                    this.initMessage = '服务器暂时无法处理您的请求'
                });
            },
            getMinCyclePath() {
                if (!(!!this.start && !!this.end)) {
                    this.initBack = true;
                    this.initColor = 'error';
                    this.initMessage = '起始点和终点不能为空';
                    return
                }
                axios.post("http://localhost:8081/user/getMinCyclePath", {
                    start: this.start,
                    end: this.end
                }).then((res) => {
                    if (res.data.status === 'ok') {
                        this.result = res.data.data;
                        let last = this.result.first[this.result.first.length - 1].second;
                        this.result.first.push({
                            first: last,
                            second: null,
                            weight: 0
                        })
                    } else {
                        this.initBack = true;
                        this.initColor = 'error';
                        this.initMessage = '未知错误'
                    }
                }).catch(() => {
                    this.initBack = true;
                    this.initColor = 'error';
                    this.initMessage = '服务器暂时无法处理您的请求'
                });
            }
        },
        mounted() {
            this.initGraph()
        }
    }
</script>

<style scoped>

</style>