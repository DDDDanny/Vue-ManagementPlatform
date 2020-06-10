<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索与添加区 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userList" style="width: 100%" border stripe >
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名" width="180"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        {{ scope.row }}
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[15, 20, 50, 100]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            // 获取用户列表参数的对象
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 15
                },
                userList: [],
                total: 0
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const { data: res} = await this.$http.get('users', { params: this.queryInfo })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户列表失败')
                }
                this.userList = res.data.users
                this.total = res.data.total
                console.log(res)
            },
            // 监听pageSize改变的事件
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            // 监听当前页面页码值改变的事件
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getUserList()

            },
            async userStateChanged(userInfo) {
                const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                if (res.meta.status !== 200){
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error('更新用户状态失败')
                }
                this.$message.success('更新用户状态成功！')
            }
        }
    }
</script>

<style scoped>

</style>
