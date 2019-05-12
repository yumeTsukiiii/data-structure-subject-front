<template>
    <v-layout column align-center>
        <v-layout column align-start>
            <v-layout row justify-space-between align-space-between>
                <v-tooltip bottom>
                    <v-btn slot="activator" color="primary"
                        flat icon small top @click="settingsDialog = true">
                        <v-icon>settings</v-icon>
                    </v-btn>
                    <span>排序设置</span>
                </v-tooltip>
                <v-tooltip right>
                    <v-text-field
                            slot="activator"
                            v-model="keyword"
                            append-icon="search"
                            label="搜索"
                            @click:append="searchScenicSpot"
                            placeholder="输入关键字"
                            clearable
                    ></v-text-field>
                    <span>关键字可能包含在景点名称或简介中</span>
                </v-tooltip>
            </v-layout>
            <v-data-table
                    :headers="headers"
                    :items="points"
                    class="elevation-1"
                    :loading="tableLoad">
                <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.popularity }}</td>
                    <td>{{ props.item.hasRestArea?'有':'无' }}</td>
                    <td>{{ props.item.hasToilet?'有':'无' }}</td>
                    <td>
                        <v-btn icon flat color="primary" @click="showIntro(props.item)"><v-icon>book</v-icon></v-btn>
                        <v-btn icon flat color="red" @click="deleteSpot(props.item)"><v-icon>delete</v-icon></v-btn>
                    </td>
                </template>
            </v-data-table>
        </v-layout>
        <v-dialog v-model="settingsDialog" persistent max-width="468px">
            <v-card>
                <v-card-title>排序设置</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-layout column wrap>
                            <v-switch
                                    label="排序开关"
                                    v-model="sortSwitch"
                            ></v-switch>
                            <v-radio-group v-model="radioGroup" :disabled="!sortSwitch">
                                <v-radio
                                        v-for="n in 2"
                                        :key="n - 1"
                                        :label="sortMode[n - 1]"
                                        :value="n - 1"
                                ></v-radio>
                            </v-radio-group>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="confirmSettings">关闭</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar
                v-model="requestBack"
                :color="requestColor"
                :timeout="2000">
            {{requestMessage}}
            <v-btn dark flat @click="requestBack = false">关闭</v-btn>
        </v-snackbar>
        <v-dialog fullscreen v-model="introDialog" hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="introDialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>景点详情</v-toolbar-title>
                </v-toolbar>
                <v-card-title primary-title>
                    <span class="headline">景点名称：{{currentSpot == null ?'': currentSpot.name}}</span>
                </v-card-title>
                <v-card-text>
                    <v-list>
                        <v-subheader>邻接景点</v-subheader>
                        <template v-for="(item,index) in currentSpot == null ? [] : currentSpot.adjacency">
                            <v-list-tile :key="index">
                                <v-list-tile-content>
                                    <v-list-tile-title>名称：{{item.name}}</v-list-tile-title>
                                    <v-list-tile-sub-title>距离：{{item.weight}}</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </template>
                    </v-list>
                    <span class="headline">景点简介</span>
                    <div class="body-2">{{currentSpot == null ? '' : currentSpot.intro}}</div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "ScenicManagePage",
        data: () => {
            return {
                requestBack: false,
                requestColor: '',
                requestMessage: '',
                keyword: '',
                headers:[
                    { text: '名称', value: 'name', sortable: false },
                    { text: '欢迎度', value: 'popularity', sortable: false },
                    { text: '有无休息区', value: 'hasRestArea', sortable: false },
                    { text: '有无公厕', value: 'hasToilet', sortable: false },
                    { text: '操作', value: 'action', sortable: false, align: 'center'}
                ],
                points: [],
                sortMode: [
                    '按欢迎度排序',
                    '按邻接景点排序'
                ],
                settingsDialog: false,
                introDialog: false,
                sortSwitch: true,
                radioGroup: 0,
                tableLoad: false,
                currentSpot: null
            }
        },
        methods: {
            searchScenicSpot() {
                if (this.keyword === '' || this.keyword === null) {
                    return
                }
                this.tableLoad = true;
                axios.post("http://127.0.0.1:8081/user/searchScenic", {
                    keyword: this.keyword
                }).then((res) => {
                    if (res.data.status === 'ok') {
                        this.points = res.data.data;
                        if (this.sortSwitch) {
                            this.sortScenicSpot()
                        } else {
                            this.tableLoad = false
                        }
                    } else {
                        this.tableLoad = false
                    }
                }).catch(() => {
                    this.requestBack = true;
                    this.requestMessage = '服务器暂时无法处理您的请求';
                    this.requestColor = 'error';
                    this.tableLoad = false
                })
            },
            confirmSettings() {
                this.settingsDialog = false;
                if (this.sortSwitch) {
                    this.sortScenicSpot()
                }
            },
            sortScenicSpot() {
                axios.post("http://127.0.0.1:8081/user/sortScenic", {
                    scenicModels: this.points,
                    condition: this.radioGroup === 0 ? 'Popularity': 'Adjacency'
                }).then((res) => {
                    if (res.data.status === 'ok') {
                        this.points = res.data.data;
                    }
                    this.tableLoad = false
                }).catch(() => {
                    this.requestBack = true;
                    this.requestMessage = '服务器暂时无法处理您的请求';
                    this.requestColor = 'error';
                    this.tableLoad = false;
                })
            },
            showIntro(spot) {
                this.introDialog = true;
                this.currentSpot = spot
            },
            deleteSpot(spot) {
                axios.post("http://127.0.0.1:8081/user/removeScenic", {
                    name: spot.name
                }).then((res) => {
                    if (res.data.status === 'ok') {
                        this.requestBack = true;
                        this.requestMessage = '删除成功';
                        this.requestColor = 'success';
                        this.points.splice(this.points.indexOf(spot), 1);
                        this.tableLoad = false;
                    }
                    this.tableLoad = false
                }).catch(() => {
                    this.requestBack = true;
                    this.requestMessage = '服务器暂时无法处理您的请求';
                    this.requestColor = 'error';
                    this.tableLoad = false;
                })
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>