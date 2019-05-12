<template>
    <v-layout column align-center>
        <div class="headline">景区模拟图如下所示，可对景区进行如下操作</div>
        <v-layout>
            <v-btn flat color="primary" @click="navigateToManage">景点删除</v-btn>
            <v-btn flat color="primary" @click="insertDialog = true">新增景点</v-btn>
            <v-btn flat color="primary" @click="insertEdgeDialog = true">新增通路</v-btn>
            <v-btn flat color="primary" @click="removeEdgeDialog = true">删除通路</v-btn>
            <v-btn flat color="primary" @click="navigateToManage">景点搜索</v-btn>
            <v-btn flat color="primary" @click="navigateToCalculate">计算通路</v-btn>
        </v-layout>
        <canvas ref="canvasTable" width="600" height="500"></canvas>
        <v-snackbar
                v-model="initBack"
                :color="initColor"
                :timeout="2000">
            {{initMessage}}
            <v-btn dark flat @click="initBack = false">关闭</v-btn>
        </v-snackbar>
        <v-dialog v-model="insertDialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">新增景点</span>
                </v-card-title>
                <v-card-text>
                    <v-form v-model="valid" ref="insertFrom">
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            v-model="insertSpot.name"
                                            label="景点名称" required :rules="rules.nameRules"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            v-model="insertSpot.x"
                                            label="坐标x" type="number" required :rules="rules.numberRules"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            v-model="insertSpot.y"
                                            label="坐标y" type="number" required :rules="rules.popularityRules"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            v-model="insertSpot.popularity"
                                            label="欢迎度" type="number" required :rules="rules.popularityRules"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-select
                                            v-model="insertSpot.hasRestArea"
                                            :items="['有', '无']"
                                            label="有无休息区"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-select
                                            v-model="insertSpot.hasToilet"
                                            :items="['有', '无']"
                                            label="有无厕所"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12>
                                    <v-textarea
                                            :rules="rules.numberRules"
                                            v-model="insertSpot.intro"
                                            label="景点简介"></v-textarea>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="resetForm">取消</v-btn>
                    <v-btn color="blue darken-1" flat @click="insertScenicSpot" :disabled="!valid">添加</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="insertEdgeDialog" persistent max-width="600px" >
            <v-card>
                <v-card-title>
                    <span class="headline">新增通路</span>
                </v-card-title>
                <v-card-text>
                    <v-form v-model="edgeValid" ref="insertEdgeFrom">
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md4>
                                    <v-select
                                            v-model="insertScenicEdge.first"
                                            :items="points"
                                            item-text="name"
                                            label="景点1"
                                            required
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-select
                                            v-model="insertScenicEdge.second"
                                            :items="points"
                                            item-text="name"
                                            label="景点2"
                                            required
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            required
                                            type="number"
                                            label="权重"
                                            :rules="rules.weightRules"
                                            v-model="insertScenicEdge.weight">

                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="resetEdgeForm">取消</v-btn>
                    <v-btn color="blue darken-1" flat @click="insertEdge" :disabled="!edgeValid">添加</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="removeEdgeDialog" max-width="600px" persistent>
            <v-card>
                <v-card-title>
                    <span class="headline">删除通路</span>
                </v-card-title>
                <v-card-text>
                    <v-layout column align-center>
                        <v-select :items="points" v-model="removeEdge.first" label="景点1" item-text="name"></v-select>
                        <v-select :items="points" v-model="removeEdge.second" label="景点2" item-text="name"></v-select>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="removeEdgeDialog = false">取消</v-btn>
                    <v-btn color="blue darken-1" flat @click="removeScenicEdge">删除</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'ScenicGraphPage',
        data: () => {
            return {
                valid: false,
                edgeValid: false,
                context: null,
                cycleRadius: 24,
                xOffset: -16,
                yOffset: 4,
                points: [],
                initBack: false,
                initColor: '',
                initMessage: '',
                insertDialog: false,
                insertEdgeDialog: false,
                removeEdgeDialog: false,
                insertSpot: {
                    x: '',
                    y: '',
                    name: '',
                    popularity: '',
                    hasRestArea: '无',
                    hasToilet: '无',
                    intro: '',
                    adjacency: []
                },
                insertScenicEdge: {
                    first: '',
                    second: '',
                    weight: ''
                },
                removeEdge: {
                    first: '',
                    second: ''
                },
                rules: {
                    nameRules: [
                        v => !!v || '景点名称不能为空'
                    ],
                    numberRules: [
                        v => !!v || '该选项不能为空'
                    ],
                    popularityRules: [
                        v => !!v || '欢迎度不能为空',
                        v => v <= 10 || '欢迎度必须小于等于10且大于等于0',
                        v => v >= 0 || '欢迎度必须小于等于10且大于等于0'
                    ],
                    weightRules: [
                        v => !!v || '权值不能为空',
                        v => v >= 0 || '权值必须大于等于0'
                    ]
                }
            }
        },
        methods: {
            initGraph() {
                axios.defaults.headers['Authorization'] = `Bearer ${this.$store.state.token}`;
                axios.post("http://localhost:8081/init").then((res) => {
                    if (res.data.status === 'ok') {
                        this.context.save();
                        this.context.setTransform(1, 0, 0, 1, 0, 0);
                        this.context.clearRect(0, 0, 600, 500);
                        this.context.restore();
                        this.points = res.data.data;
                        this.init();
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
            mapToPxLocation(x, y) {
                return {
                    x: (x + 1) * 80,
                    y: (y + 1) * 60
                }
            },
            drawCycle(point) {
                this.context.beginPath();
                this.context.arc(point.x, point.y, this.cycleRadius, 0, 2*Math.PI);
                this.context.stroke();
                this.context.closePath();
                this.context.fillText(point.name, point.x + this.xOffset, point.y + this.yOffset)
            },
            drawLine(start, end) {
                this.context.moveTo(start.x, start.y);
                this.context.lineTo(end.x, end.y);
                this.context.stroke();
                let x = parseInt(Math.abs(start.x + end.x)/2);
                let y = parseInt(Math.abs(start.y + end.y)/2);
                this.context.fillText(end.weight, x, y)
            },
            init() {
                if (this.points.constructor === Array ) {
                    this.points.forEach((item) => {
                        let location = this.mapToPxLocation(item.x, item.y);
                        item.x = location.x;
                        item.y = location.y;
                        this.drawCycle(item);
                    });
                    this.points.forEach((item) => {
                        if (item.adjacency !== undefined) {
                            if (item.adjacency.constructor === Array) {
                                item.adjacency.forEach((aItem) => {
                                    let aLoc = this.mapToPxLocation(aItem.x, aItem.y);
                                    aItem.x = aLoc.x;
                                    aItem.y = aLoc.y;
                                    this.drawLine(item, aItem)
                                })
                            }
                        }
                    })
                }
            },
            insertScenicSpot() {
                let spot = this.insertSpot;
                spot.x = parseInt(spot.x);
                spot.y = parseInt(spot.y);
                spot.popularity = parseFloat(spot.popularity);
                spot.hasRestArea = spot.hasRestArea === '有';
                spot.hasToilet = spot.hasToilet === '有';
                axios.post("http://localhost:8081/user/insertScenicSpot", {
                    model: spot
                }).then((res) => {
                    if (res.data.status === 'ok') {
                        this.initBack = true;
                        this.initColor = 'success';
                        this.initMessage = '添加成功';
                        this.insertDialog = false;
                        this.resetForm();
                        this.initGraph()
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
            insertEdge() {
                let edge = this.insertScenicEdge;
                edge.weight = parseFloat(edge.weight);
                edge.first = this.points.find((item) => { return item.name === edge.first });
                edge.second = this.points.find((item) => { return item.name === edge.second });
                if (!!edge.first && !!edge.second) {
                    if (edge.first === edge.second) {
                        this.initBack = true;
                        this.initColor = 'error';
                        this.initMessage = '输入景点不能相同';
                        return
                    }
                } else {
                    this.initBack = true;
                    this.initColor = 'error';
                    this.initMessage = '输入景点不能为空';
                    return
                }
                axios.post("http://localhost:8081/user/insertScenicEdge", {
                    first: edge.first,
                    second: edge.second,
                    weight: edge.weight
                }).then((res) => {
                    if (res.data.status === 'ok') {
                        this.initBack = true;
                        this.initColor = 'success';
                        this.initMessage = '添加成功';
                        this.insertDialog = false;
                        this.resetEdgeForm();
                        this.initGraph()
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
            removeScenicEdge() {
                let edge = this.removeEdge;
                edge.first = this.points.find((item) => { return item.name === edge.first });
                edge.second = this.points.find((item) => { return item.name === edge.second });
                axios.post("http://localhost:8081/user/removeScenicEdge", {
                    first: edge.first,
                    second: edge.second
                }).then((res) => {
                    if (res.data.status === 'ok') {
                        this.initBack = true;
                        this.initColor = 'success';
                        this.initMessage = '删除成功';
                        this.removeEdgeDialog = false;
                        this.initGraph()
                    } else {
                        this.initBack = true;
                        this.initColor = 'error';
                        this.initMessage = '景点或者通路不存在'
                    }
                }).catch(() => {
                    this.initBack = true;
                    this.initColor = 'error';
                    this.initMessage = '服务器暂时无法处理您的请求'
                });
            },
            resetForm() {
                this.insertDialog = false;
                // this.$refs.insertForm.reset()
            },
            resetEdgeForm() {
                this.insertEdgeDialog = false;
                // this.$refs.insertEdgeFrom.reset()
            },
            navigateToManage() {
                this.$router.replace("/scenic-manage")
            },
            navigateToCalculate() {
                this.$router.replace('/path-calculate')
            }
        },
        mounted() {
            this.context = this.$refs.canvasTable.getContext('2d');
            this.context.fillStyle = "red";
            this.context.strokeStyle = "dodgerblue";
            this.context.font = "12px sans-serif";
            this.initGraph()
        }
    }
</script>

<style scoped>

</style>