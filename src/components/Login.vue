<template>
    <div class="login_container">
        <div class="login_box">
            <!-- Logo区 -->
            <div class="avatar_box">
                <img src="../assets/logo3.png" alt="">
            </div>
            <!-- 输入框区域 -->
            <el-form ref="LoginFormRef" label-width="0px" class="login_form" :model="LoginForm" :rules="LoginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-s-custom" v-model="LoginForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" v-model="LoginForm.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <!-- 按钮组 -->
                <el-form-item class="btn-group">
                    <el-button type="primary" @click="Login">登录</el-button>
                    <el-button type="info" @click="ResetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 这是登录表单的数据绑定对象
                LoginForm: {
                    username: 'admin',
                    password: '123456'
                },
                // 表单验证规则对象
                LoginFormRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            // 点击重置按钮，重置表单数据
            ResetLoginForm() {
                this.$refs.LoginFormRef.resetFields()
            },
            // 点击登录按钮，对表单数据进行预验证
            Login() {
                this.$refs.LoginFormRef.validate(async valid => {
                  if (!valid) return;
                  const {data: result} = await this.$http.post('login', this.LoginForm);
                  if (result.meta.status !== 200) return this.$message.error('登录失败');
                  this.$message.success('登录成功');
                  console.log(result);
                  window.sessionStorage.setItem('token', result.data.token);
                  await this.$router.push('/home')
                })
            }
        }
    }
</script>

<!-- scoped设置样式生效范围，有scoped：只在该组建中生效；没有则全局生效 防止样式污染 -->
<style scoped lang="less">
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        /* 调整box位于页面正中央 */
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50% );
        background-color: #ffffff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eeeeee;
        }
    }

    .btn-group{
        display: flex;
        justify-content: flex-end;
    }

    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>
