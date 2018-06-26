<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="header">
            <img src="../../images/login-logo.png">
        </div>
        <div class="background">
            <img src="../../images/login-bg.jpg"/>
        </div>
        <div class="login-con">
            <Card :bordered="false">
                <div class="form-con">
                    <Form ref="form" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">忘记密码?</p>
                </div>
            </Card>
        </div>
        <div class="footer">
            <div class="copyright">Copyright©2016 杭州求是同创网络科技有限公司 浙ICP备16003350号-2</div>
            <div>
                <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011002011357"
                   style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img
                        src="http://test.weimaipay.com:8070/unioncheck/portal/img/beian.png">浙公网安备 33011002011357号</a>
            </div>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import ajax from '@/api/login';


    // let RSA = require('@/libs/RSA');

    console.log('jse')
    // console.log(this.a)
    export default {
        data () {
            return {
                form: {
                    userName: 'admin',
                    password: ''
                },
                rules: {
                    userName: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        created () {
            this.getToken();

        },
        methods: {
            getToken () {
                ajax.getToken({
                    _: new Date().getTime()
                }).then(response => {
                    if (!response.success == true) {
                        this.$Notice.open({
                            title: '登陆验证错误',
                            desc: response.msg ? response.msg : '获取用户认证错误'
                        });
                        return;
                    }
                    let modulus = response.data.modulus;
                    let exponent = response.data.exponent;
                    console.log('laile---')
                    console.log(response.data.modulus)
                    console.log(response.data.exponent)
                    console.log('a-----')
                    console.log(this.$JE)
                    let jse = new this.$JE.JSEncrypt()
                    jse.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8ygMKjJLSUpnfXqt8lRSAdDxA
HWKi9GbTFkCbAjkRCR6VUakxxXLXHQUtPCizKcvNpuYqZ5bO8LEgpY7SL3JEdEI9
OuMnZ6ToeHPfcHeS+EgN0oYmdQ49RB5wZkcBEFk80OBEAM6VhnE0IuHGkU5ko9oP
Hq3boEQ3Ej6r3T+UhQIDAQAB
-----END PUBLIC KEY-----`)
                    // let jse = new this.a.JSEncrypt(response.data.modulus)
                    // console.log(jse)
                    console.log(jse.encrypt(response.data.modulus))
                    console.log('jse')

                    // console.log(RSA.getKeyPair(exponent, '', modulus));
                    console.log('laile---')

                }).catch(() => {
                });
            },
            handleSubmit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        ajax.login({
                            login_name: this.form.userName,
                            login_pwd:  this.form.password
                        }).then(response => {
                            if (!response.success == true) {
                                this.$Notice.open({
                                    title: '登陆出错',
                                    desc: response.msg ? response.msg : '登陆出错'
                                });
                                return;
                            }

                            Cookies.set('user', this.form.userName);
                            Cookies.set('password', this.form.password);
                            this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                            if (this.form.userName === 'admin') {
                                Cookies.set('access', 0);
                            } else {
                                Cookies.set('access', 1);
                            }
                            this.$router.push({
                                name: 'home_index'
                            });
                        }).catch((err) => {
                            // console.log(err)
                            this.$Message.error(err ? err : '未成功请求接口');
                        });

                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .header {
        background-color: white;
        position: relative;
        width: 100%;
        height: 80px;
        left: 0px;
        top: 0px;
        img {
            display: inline-block;
            vertical-align: middle;
            height: 45px;
            margin-left: 20px;
            margin-top: 15px;
        }
    }

    .login {
        width: 100%;
        height: 100%;
        position: relative;
        &-con {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 340px;
            transform: translate(-50%,-60%);
            background-color: rgba(0, 0, 0, 0.5);
            .ivu-card {
                background-color: transparent;
                padding-left: 30px;
                padding-right: 30px;
                padding-top: 20px;
            }
            &-header {
                font-size: 16px;
                font-weight: 300;
                text-align: center;
                padding: 30px 0;
            }
            .form-con {
                padding: 10px 0 0;
            }
            .login-tip {
                font-size: 10px;
                text-align: left;
                color: #c3c3c3;
            }
        }
    }

    .footer {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px;
        padding: 10px 20px;
        background: none repeat scroll 0 0 white;
        border-top: 1px solid #e7eaec;
        text-align: center;
        .copyright {
            margin-top: 20px;
            & + div {
                width: 300px;
                margin: 0 auto;
                padding: 15px 0;
                img {
                    display: inline-block;
                    vertical-align: middle;
                }
            }
        }
    }
    .background {
        position: fixed;
        width: 100%;
        height: 100%;
        img {
            display: inline-block;
            height: 100%;
            width: 100%;
        }
    }
</style>
