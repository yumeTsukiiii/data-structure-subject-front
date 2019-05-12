<template>
    <v-app light>
        <v-navigation-drawer app v-model="drawer" :dark="isPC" :light="!isPC">
            <v-list dense class="pt-0">
                <v-list-tile
                        v-for="(item,index) in items"
                        :key="item.title"
                        @click="navigateTo(index)">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content >
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>

                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app color="primary" fixed dark>
            <v-toolbar-side-icon @click="toggleDrawer"></v-toolbar-side-icon>
            <v-toolbar-title>景区管理系统</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-content>
            <v-container>
                <router-view></router-view>
            </v-container>
        </v-content>
        <v-snackbar
                v-model="showLoginBack"
                :color="loginColor"
                :timeout="2000">
            {{loginMessage}}
            <v-btn dark flat @click="showLoginBack = false">关闭</v-btn>
        </v-snackbar>
        <v-dialog v-model="loginDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">系统提示</v-card-title>
                <v-card-text>请先登录！</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click="notLogin">去登录</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
    export default {
        name: "MainPage",
        data: () => {
            return {
                showLoginBack: false,
                loginMessage: "",
                loginColor: "",
                loginDialog: false,
                drawer: true,
                isPC: true,
                items: [
                    { title: "景区分布图", icon: "photo" },
                    { title: "景点搜索", icon: "person" },
                    { title: "停车场监视", icon: "local_parking" },
                    { title: "路径计算", icon: "navigation" },
                    { title: "退出系统", icon: "home" },
                ]
            }
        },
        mounted () {
            this.isPC = window.innerWidth > 768;
            if (this.$store.state.token == null) {
                this.loginDialog = true;
            } else {
                this.showLoginBack = true;
                this.loginMessage = "登录成功";
                this.loginColor = "success"
            }
            window.onresize = () => {
                this.isPC = window.innerWidth > 768;
            };
            this.navigateTo(0)
        },
        methods: {
            notLogin() {
                this.loginDialog = false;
                this.$router.replace("/")
            },
            toggleDrawer() {
                if (!this.isPC) {
                    this.drawer = !this.drawer
                }
            },
            navigateTo(index) {
                switch (index) {
                    case 0:
                        this.$router.replace("/scenic-graph");
                        break;
                    case 1:
                        this.$router.replace("/scenic-manage");
                        break;
                    case 2:
                        this.$router.replace("/parking-watch");
                        break;
                    case 3:
                        this.$router.replace("/path-calculate");
                        break;
                    case 4:
                        this.$store.commit('clear');
                        this.$router.replace("/");
                        break;
                }
            }
        }

    }
</script>

<style scoped>

</style>