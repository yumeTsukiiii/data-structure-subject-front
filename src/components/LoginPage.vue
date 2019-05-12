<template>
    <v-app light :style="{height: screenHeight + 'px', overflowY: 'hidden'}">
        <v-content :class="{ 'o-main-content': isPC }">
            <v-container>
                <v-layout align-center column>
                    <v-flex>
                        <div style="margin-top: 64px;" class="display-1">景区管理系统</div>
                    </v-flex>
                    <div class="login-block">
                        <v-flex>
                            <v-text-field v-model="userId" label="用户名"></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="password" label="密码" :type="showPassword ? 'text' : 'password'"
                                          :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                                          @click:append="showPassword = !showPassword"></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-btn color="primary" round block @click="login">登录</v-btn>
                        </v-flex>
                    </div>
                </v-layout>
            </v-container>
        </v-content>
        <v-snackbar
                v-model="showLoginBack"
                :color="loginColor"
                :timeout="2000">
            {{loginMessage}}
            <v-btn dark flat @click="showLoginBack = false">关闭</v-btn>
        </v-snackbar>
        <v-dialog v-model="loginDialog" fullscreen>
            <v-layout justify-center align-center style="height: 100%; width: 100%; background-color: #ffffffcc">
                <v-progress-circular
                        indeterminate
                        color="primary"
                ></v-progress-circular>
            </v-layout>
        </v-dialog>
    </v-app>
</template>

<script>
    import CryptoJS from 'crypto-js'
    import axios from 'axios'

    export default {
        name: "LoginPage",
        data: () => {
            return {
                screenHeight: 0,
                isPC: true,
                userId: "",
                password: "",
                showLoginBack: false,
                loginMessage: "",
                loginColor: "",
                showPassword: false,
                loginDialog: false
            }
        },
        mounted() {
            this.screenHeight = window.innerHeight;
            window.onresize = () => {
                this.screenHeight = window.innerHeight;
            }
        },
        methods: {
            login() {
                this.loginDialog = true;
                axios.post("http://127.0.0.1:8081/login", {
                    userId: this.userId,
                    password: this.encryptByDES(this.password)
                }).then((res) => {
                    this.loginDialog = false;
                    if (res.data.status === 'ok') {
                        this.$store.commit('setToken', res.data.data.token);
                        this.$store.commit('setName', res.data.data.name);
                        this.$router.replace("/main")
                    } else {
                        this.showLoginBack = true;
                        this.loginMessage = "用户不存在或密码错误";
                        this.loginColor = "error"
                    }
                }).catch(() => {
                    this.loginDialog = false;
                    this.showLoginBack = true;
                    this.loginMessage = "服务器暂时无法处理您的请求";
                    this.loginColor = "error"
                })
            },
            encryptByDES(message){
                const keyHex = CryptoJS.enc.Utf8.parse(this.$store.state.key);
                const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return encrypted.toString();
            }
        }
    }
</script>

<style scoped>
    .o-main-content{
        height: 100%;
        background-image: url("../assets/background.jpg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
        overflow-y: hidden;
    }

    .display-1{
        color: #ffffffcc !important;
    }

    .login-block{
        margin-top: 64px;background-color: #ffffffaa;padding: 64px
    }

</style>