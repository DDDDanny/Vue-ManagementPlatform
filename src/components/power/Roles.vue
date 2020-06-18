<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="roleList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand" label="">
                    <template slot-scope="scope">
                        <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdbottom', i1 === 0 ? 'dbtop':'', 'vcenter']">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二、三级权限 -->
                            <el-col :span="19">
                                <!-- 渲染二权限 -->
                                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 !== 0 ? 'dbtop':'', 'vcenter']">
                                    <el-col :span="6">
                                        <el-tag type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 渲染三权限 -->
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleByID(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色的对话框 -->
        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" :close-on-click-modal="false" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoles" >确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑角色的对话框 -->
        <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" :close-on-click-modal="false" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoles" >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 所有角色列表数据
                roleList: [],
                // 控制添加角色对话框的显示与隐藏
                addDialogVisible: false,
                // 添加角色的表单数据
                addForm: {
                    roleName: '',
                    roleDesc: '',
                },
                // 添加表单的验证规则对象
                addFormRules: {
                    roleName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur'},
                        { min: 3, max: 10, message: '角色名称长度在3-10个字符之间', trigger: 'blur'}
                    ],
                    roleDesc: [
                        { required: true, message: '请输入角色描述', trigger: 'blur'},
                        { max: 30, message: '角色描述长度在30个字符之内', trigger: 'blur'}
                    ],
                },
                // 查询到的角色对象
                editForm: {},
                // 修改表单的验证规则对象
                editFormRules: {
                    roleName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur'},
                        { min: 3, max: 10, message: '角色名称长度在3-10个字符之间', trigger: 'blur'}
                    ],
                    roleDesc: [
                        { required: true, message: '请输入角色描述', trigger: 'blur'},
                        { max: 30, message: '角色描述长度在30个字符之内', trigger: 'blur'}
                    ],
                },
                // 控制添加角色对话框的显示与隐藏
                editDialogVisible: false,
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            async getRolesList() {
                const {data: res} = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    this.$message.error('获取角色列表失败')
                }
                this.roleList = res.data
            },
            // 监听添加角色对话框的关闭事件，清除校验状态
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            addRoles() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    // 发起网络请求
                    const {data: res} = await this.$http.post('roles', this.addForm)
                    if (res.meta.status !== 201) {
                        this.$message.error('添加角色失败！')
                    }
                    this.$message.success('添加角色成功！')
                    this.addDialogVisible = false
                    this.getRolesList()
                })
            },
            // 展示编辑角色的对话框
            async showEditDialog(id) {
                const {data: res} = await this.$http.get('roles/' + id)
                if (res.meta.status !== 200) {
                    this.$message.error('查询角色失败！')
                }
                this.editForm = res.data
                this.editDialogVisible = true
            },
            // 监听编辑角色信息对话框的关闭事件
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            // 编辑角色信息并提交
            editRoles() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                    // 发起网络请求
                    const {data: res} = await this.$http.put('roles/' + this.editForm.roleId, {
                        roleName: this.editForm.roleName,
                        roleDesc: this.editForm.roleDesc,
                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error('更新角色信息失败！')
                    }
                    this.$message.success('更新角色信息成功！')
                    this.editDialogVisible = false
                    this.getRolesList()
                })
            },
            // 删除角色
            async removeRoleByID(id) {
                // 弹框询问是否删除
                const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                // 如果用户取消删除，则返回值为字符串：cancel
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已经取消删除')
                }
                // 如果用户确认删除，则返回值为字符串：confirm
                const {data: res} = await this.$http.delete('roles/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除失败！')
                }
                this.$message.success('删除成功！')
                this.getRolesList()
            }
        }
    }
</script>

<style scoped lang="less">
    .el-tag {
        margin: 7px;
    }
    .dbtop {
        border-top: 1px solid #eee;
    }
    .bdbottom {
        border-bottom: 1px solid #eeeeee;
    }
    .vcenter {
        display: flex;
        align-items: center;
    }

</style>
