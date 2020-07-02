<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible=true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTabData" border stripe>
                        <!-- 展开列 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable>{{ item }}</el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                        ref="saveTagInput" size="small"
                                        @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column label="#" type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsByID(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible=true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTabData" border stripe>
                        <!-- 展开列 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable>{{ item }}</el-tag>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column label="#" type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsByID(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数的弹框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addRuleFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑参数的弹框 -->
        <el-dialog :title="'编辑' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editRuleFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data()  {
            return {
                // 商品分类列表
                cateList: [],
                // 级联选择框的配置对象
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 级联选择框的双向绑定到的数组
                selectedCateKeys: [],
                activeName: 'many',
                // 动态参数数据
                manyTabData: [],
                // 静态属性数据
                onlyTabData: [],
                // 控制添加对话框的显示与隐藏
                addDialogVisible: false,
                // 添加参数的表单对象
                addForm: {
                    attr_name: ''
                },
                // 添加表单的验证规则对象
                addFormRules: {
                    attr_name: [
                        { required: true, message: '请输入参数名称', trigger: 'blur' }
                    ]
                },
                // 控制编辑对话框的显示与隐藏
                editDialogVisible: false,
                // 编辑参数表单对象
                editForm: {},
                // 编辑表单的验证规则对象
                editFormRules: {
                    attr_name: [
                        { required: true, message: '请输入参数名称', trigger: 'blur' }
                    ]
                },
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            // 获取所有商品分类
            async getCateList() {
                const {data: res} = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败！')
                }
                this.cateList = res.data
                // console.log(this.cateList)
            },
            // 级联选择框中选项变化会触发这个函数
            handleChange() {
                this.getParamsData()
            },
            // Tab页签点击事件处理函数
            handleTabClick() {
                this.getParamsData()
            },
            // 获取参数列表数据
            async getParamsData() {
                // 根据所选的分类ID和当前所处的面板获取对应的参数
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: { sel: this.activeName}
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取列表数据失败！')
                }
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                    // 控制文本框的显示与隐藏
                    item.inputVisible = false
                    // 文本框输入的值
                    item.inputValue = ''
                 })
                console.log(res.data)
                if (this.activeName === 'many') {
                    this.manyTabData = res.data
                }else {
                    this.onlyTabData = res.data
                }
            },
            // 监听对话框的关闭事件
            addDialogClosed() {
                this.$refs.addRuleFormRef.resetFields()
            },
            // 点击按钮添加参数
            addParams() {
                this.$refs.addRuleFormRef.validate(async valid => {
                    if (!valid) return
                    const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加参数失败！')
                    }
                    this.$message.success('添加参数成功！')
                    this.addDialogVisible = false
                    this.getParamsData()
                })
            },
            // 监听编辑对话框的关闭事件
            editDialogClosed(){
                this.$refs.editRuleFormRef.resetFields()
            },
            // 展示编辑信息对话框
            async showEditDialog(id) {
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
                    params: {attr_sel: this.activeName}
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数信息失败！')
                }
                this.editForm = res.data
                this.editDialogVisible = true
            },
            // 点击按钮提交编辑信息
            editParams() {
                this.$refs.editRuleFormRef.validate(async valid => {
                    if (!valid) return
                    const {data: res}  = await this.$http.put(
                        `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                        {
                            attr_name: this.editForm.attr_name,
                            attr_sel: this.activeName
                        }
                    )
                    if (res.meta.status !== 200) {
                        return this.$message.error('参数更新失败！')
                    }
                    this.$message.success('参数更新成功')
                    this.getParamsData()
                    this.editDialogVisible = false

                })
            },
            // 点击删除按钮，删除参数信息
            async removeParamsByID(id) {
                const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已经取消删除')
                }
                const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除失败！')
                }
                this.$message.success('删除成功！')
                this.getParamsData()
            },
            // 文本框失去焦点或按下Enter都会触发
            handleInputConfirm() {
                console.log('ok')
            },
            showInput(row) {
                row.inputVisible = true
            }
        },
        computed: {
            // 如果按钮被禁用返回true，启用返回false
            isBtnDisable() {
                return this.selectedCateKeys.length !== 3;
            },
            // 当前选中的三级分类的ID
            cateId() {
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2]
                }
                return null
            },
            // 动态计算弹框标题文本
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                }else {
                    return '静态属性'
                }
            }
        }

    }
</script>

<style scoped lang="less">
    .cat_opt {
        margin: 15px 0;
    }
    .el-tag {
        margin: 10px;
    }
    .input-new-tag {
        width: 120px;
    }
</style>
