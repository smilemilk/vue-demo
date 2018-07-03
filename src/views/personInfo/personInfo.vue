<template>
    <div>
        <Card class="margin-bottom-10 userLoginForm">
            <div>
                <Row>
                    <Col span="12" :xs="24" :sm="12" :md="12" :lg="12">
                        <span>最后登陆时间：{{this.userForm.lastLoginDatetime ? this.userForm.lastLoginDatetime : '——'}}</span>
                    </Col>
                    <Col span="12" :xs="24" :sm="12" :md="12" :lg="12">
                        <span>最后登陆IP：{{this.userForm.registerIp ? this.userForm.registerIp : '——'}}</span>
                        <Button type="text" size="small" @click="showIPHistory" class="emFont">
                            修改密码
                        </Button>
                    </Col>
                </Row>
            </div>
        </Card>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                商户信息
            </p>
            <div>
                <Form
                    ref="userForm"
                    :model="userForm"
                    :label-width="100"
                    label-position="right"
                    class="userForm"
                >
                    <FormItem label="商户名：" prop="nameFormat">
                        <span>
                            {{userForm.nameFormat}}
                        </span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;{{userForm.nameRealStatus=== true ? '已实名' : '未实名'}}</span>
                    </FormItem>
                    <FormItem label="商户号：">
                        <span>{{userForm.merchantId ? userForm.merchantId : '——'}}</span>
                    </FormItem>
                    <FormItem label="微脉号：">
                        <span>{{ userForm.weMayId ? userForm.weMayId : '——'}}</span>
                    </FormItem>
                    <FormItem label="登陆密码：">
                        <Tooltip content="点击修改密码" placement="right">
                            <Button type="text" size="small" @click="showEditPassword" class="emFont">
                                修改密码
                            </Button>
                        </Tooltip>
                    </FormItem>
                    <FormItem label="类型：">
                        <span>商户用户</span>
                    </FormItem>
                    <FormItem label="证件号：">
                        <span>{{ userForm.idcard ? userForm.idcard : '——'}}</span>
                    </FormItem>
                    <FormItem label="手机号：">
                        <span>{{ userForm.mobile ? userForm.mobile : '——'}}</span>
                    </FormItem>
                    <FormItem label="邮箱地址：">
                        <span>{{ userForm.email ? userForm.email : '——'}}</span>
                    </FormItem>
                    <FormItem label="地址：">
                        <span>{{ userForm.userAddress ? userForm.userAddress : '——'}}</span>
                    </FormItem>
                    <FormItem label="创建时间：">
                        <span>{{ userForm.registerDatetime ? userForm.registerDatetime : '——'}}</span>
                    </FormItem>
                    <div>
                        <Row>
                            <Col span="12" :xs="24" :sm="12" :md="12" :lg="12">
                                <Tooltip content="暂未开通此功能" placement="bottom">
                                    <Button type="text" style="width: 100px;"
                                            disabled
                                    >取消</Button>
                                </Tooltip>
                                <Tooltip content="暂未开通此功能" placement="bottom">
                                    <Button type="primary" style="width: 100px;"
                                            :loading="save_loading"
                                            disabled
                                    >保存</Button>
                                </Tooltip>
                            </Col>
                            <Col span="12" :xs="24" :sm="12" :md="12" :lg="12" class="tipText">
                                提醒：暂未开放自助修改，如需修改信息请联系您的运营负责人
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
        </Card>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header">修改密码</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right"
                  :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码"></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符"></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text"
                        @click="cancelEditPass('editPasswordForm')"
                >取消</Button>
                <Button type="primary"
                        :loading="savePassLoading"
                        @click="saveEditPass('editPasswordForm')"
                >保存</Button>
            </div>
        </Modal>
        <Modal v-model="ipModal" :closable='true' :footer='false' :mask-closable=false :width="420">
            <h3 slot="header">历史记录</h3>
            <Table
                    ref="table"
                    :columns="columnIp"
                    :data="ipList"
                    :height="tableHeight"
                    highlight-row
                    :show-header="false"
            ></Table>
            <Page :total="total"
                  size="small"
                  show-elevator
                  class="margin-top-10"
                  @on-change="handleCurrentPageChange"></Page>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>

<script>
    import ajax from '@/api/login';
    import {modPassword, ipHistory} from '../../api/person';
    import {parseTime} from '../../filters';
    import RSA from '@/libs/RSANode';
    import Cookies from 'js-cookie';

    export default {
        name: 'ownspace_index',
        data () {
            const validePhone = (rule, value, callback) => {
                var re = /^1[0-9]{10}$/;
                if (!re.test(value)) {
                    callback(new Error('请输入正确格式的手机号'));
                } else {
                    callback();
                }
            };
            const valideRePassword = (rule, value, callback) => {
                if (value !== this.editPasswordForm.newPass) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                keyPair: '',
                userForm: {},
                editPasswordForm: {
                    oldPass: '',
                    newPass: '',
                    rePass: ''
                },
                editPasswordModal: false,
                savePassLoading: false,
                save_loading: false,
                oldPassError: '',
                ipModal: false,
                ipList: [],
                columnIp: [],
                tableHeight: 300,
                historyList: {
                    page: 0
                },
                total: 0,
                passwordValidate: {
                    oldPass: [
                        {required: true, message: '请输入原密码', trigger: 'blur'}
                    ],
                    newPass: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, message: '请至少输入6个字符', trigger: 'blur'},
                        {max: 32, message: '最多输入32个字符', trigger: 'blur'}
                    ],
                    rePass: [
                        {required: true, message: '请再次输入新密码', trigger: 'blur'},
                        {validator: valideRePassword, trigger: 'blur'}
                    ]
                }
            };
        },
        created() {
            this.getUser();
            this.getToken();
        },
        methods: {
            getUser() {
                ajax.getUser({}).then(response => {
                   if (response.success === true) {
                        this.userForm = response.data || {};
                        if (response.data && response.data.merchantRealName) {
                            this.userForm.nameFormat = response.data.merchantRealName;
                            this.userForm.nameRealStatus = true;
                        } else {
                            this.userForm.nameFormat = response.data.merchantName || '';
                            this.userForm.nameRealStatus = false;
                        }
                        if (response.data && response.data.registerDatetime) {
                            this.userForm.registerDatetime = parseTime(response.data.registerDatetime);
                        }
                        this.userForm = {...this.userForm,
                            nameFormat: this.userForm.nameFormat,
                            nameRealStatus: this.userForm.nameRealStatus,
                            registerDatetime: this.userForm.registerDatetime,
                            lastLoginDatetime: parseTime(response.data.lastLoginDatetime) || ''
                        };
                   } else {
                       this.$Message.error({
                           content: response.msg ? response.msg : '商户信息未成功获取',
                           duration: 2,
                           closable: true
                       });
                   }
                }).catch(() => {
                    this.$Message.error({
                        content: '商户信息接口未成功请求',
                        duration: 2,
                        closable: true
                    });
                });
            },
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
                    let res = response.data;
                    const keyPair = RSA.getKeyPair(
                        res.exponent, '', res.modulus
                    );
                    this.keyPair = keyPair;
                }).catch(() => {
                });
            },
            showEditPassword () {
                this.editPasswordModal = true;
            },
            cancelEditPass(formName) {
                if (this.$refs[formName]) {
                    this.$refs[formName].resetFields();
                }
                this.editPasswordModal = false;
            },
            saveEditPass (formName) {
                this.$refs['editPasswordForm'].validate((valid) => {
                    if (valid=== true) {
                        modPassword(
                            {oldPwd: RSA.encryptedString(this.keyPair, this.editPasswordForm.oldPass),
                            newPwd: RSA.encryptedString(this.keyPair, this.editPasswordForm.newPass)}
                        ).then(response => {
                            if (response.success === true) {
                                this.$Message.success({
                                    content: response.msg ? response.msg : '修改密码成功，请重新登陆',
                                    duration: 2,
                                    closable: true
                                });
                                this.editPasswordModal = false;
                                Cookies.remove('user');
                                Cookies.remove('password');
                                Cookies.remove('access');
                                localStorage.clear();
                                this.$router.push({
                                    name: 'login'
                                });
                            } else {
                                this.$Message.error({
                                    content: response.msg ? '修改失败！' + response.msg : '修改失败,旧密码输入错误！',
                                    duration: 2,
                                    closable: true
                                });
                            }
                            this.savePassLoading = true;
                            if (this.$refs[formName]) {
                                this.$refs[formName].resetFields();
                            }
                        }).catch(() => {
                            this.$Message.error({
                                content: '修改密码接口未成功',
                                duration: 2,
                                closable: true
                            });
                        });
                    }
                });
            },
            showIPHistory() {
                this.ipHistoryList();
                this.ipModal = true;
            },
            ipHistoryList() {
                ipHistory(
                    {
                        start: this.historyList.page,
                        limit: 10,
                        login_date_start: this.getLastOneDay(30),
                        login_date_end: this.getLastOneDay(0)
                    }
                ).then(response => {
                    if (response.success === true) {
                        if (response.data.items) {
                            this.ipList = response.data.items;
                            this.columnIp=[{
                                key: 'loginDatetime',
                                width: 200,
                                align: 'center'
                            }, {
                                key: 'loginIp',
                                align: 'left',
                                render: (h, params) => {
                                    return h('div', '登陆IP：' + params.row.loginIp);
                                }
                            }];
                            this.total = response.data.pages;
                        } else {
                            this.ipList = [];
                        }
                    }

                }).catch(()=>{
                    this.$Message.error({
                        content: 'IP历史登陆记录接口未成功请求',
                        duration: 2,
                        closable: true
                    });
                });
            },
            handleCurrentPageChange(val) {
                this.historyList.page = val;
                this.ipHistoryList();
            },
            getLastOneDay (days) {
                var today=new Date();

                    var lastOneDay_milliseconds = today.getTime() - 1000 * 60 * 60 * 24 * days;
                    var lastOneDay = new Date();
                    lastOneDay.setTime(lastOneDay_milliseconds);
                    var strYear = lastOneDay.getFullYear();
                    var strDay = lastOneDay.getDate();
                    if (strDay < 10) {
                        strDay = "0" + strDay;
                    }
                    var strMonth = lastOneDay.getMonth() + 1;
                    if (strMonth < 10) {
                        strMonth = "0" + strMonth;
                    }
                    var lastOneDay = strYear + "-" + strMonth + "-" + strDay;
                    return lastOneDay;
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "../../styles/common";
    .userLoginForm {
        span {
            font-size: 12px;
            &:nth-child(2) {
                display: inline-block;
                padding-left: 30px;
            }
        }
    }

    .userForm {
        .ivu-form-item {
            margin-bottom: 8px;
        }
    }

    .emFont {
        color: @mainThemeBlue;
    }

    .own-space {
        &-btn-box {
            margin-bottom: 10px;
            button {
                padding-left: 0;
                span {
                    color: #2D8CF0;
                    transition: all .2s;
                }
                span:hover {
                    color: #0C25F1;
                    transition: all .2s;
                }
            }
        }
        &-tra {
            width: 10px;
            height: 10px;
            transform: rotate(45deg);
            position: absolute;
            top: 50%;
            margin-top: -6px;
            left: -3px;
            box-shadow: 0 0 2px 3px rgba(0, 0, 0, .1);
            background-color: white;
            z-index: 100;
        }
        &-input-identifycode-con {
            position: absolute;
            width: 200px;
            height: 100px;
            right: -220px;
            top: 50%;
            margin-top: -50px;
            border-radius: 4px;
            box-shadow: 0 0 2px 3px rgba(0, 0, 0, .1);
        }
    }
    .tipText {
        color: @fontColorLight;
        margin-top: 15px;
        padding-left: 30px;
        font-size: 12px;
    }


    @media screen and (max-height: 786px){
        .userForm {
            .ivu-form-item {
                margin-bottom: 2px;
            }
        }
    }
</style>
