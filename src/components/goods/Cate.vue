<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCatDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false"
                        index-text="#" :show-index="true" border>
                <!-- 是否删除 -->
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateInfoByID(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
                           :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCatDialogVisible" width="50%" @close="addCateDialogClose">
            <el-form :model="addCatForm" :rules="addCatFormRules" ref="addCatFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCatForm.cat_name"></el-input>
                </el-form-item>
                <!-- options: 用来指定数据源 -->
                <!-- props: 用来指定配置对象 -->
                <el-form-item label="父级分类：" >
                    <el-cascader v-model="selectedKey" :options="parentCateList" :props="cascaderProps"
                                 @change="parentCateChanged" clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCatDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑分类对话框 -->
        <el-dialog title="编辑分类" :visible.sync="editCatDialogVisible" width="50%">
            <el-form :model="editCatForm" :rules="editCatFormRules" ref="editCatFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="editCatForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCatDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCateInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 商品分类数据列表，默认为空
                cateList: [],
                // 总数据条数
                total: 0,
                // 查询条件
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                // 为Table指定列的定义
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name',
                    },
                    {
                        label: '是否有效',
                        // 表示将当前列定义为模板列
                        type: 'template',
                        // 表示当前列使用的模板名称
                        template: 'isOk',
                    },
                    {
                        label: '排序',
                        // 表示将当前列定义为模板列
                        type: 'template',
                        // 表示当前列使用的模板名称
                        template: 'order',
                    },
                    {
                        label: '操作',
                        // 表示将当前列定义为模板列
                        type: 'template',
                        // 表示当前列使用的模板名称
                        template: 'opt',
                    },
                ],
                // 控制添加分类对话框的显示与隐藏
                addCatDialogVisible: false,
                // 控制添加分类对话框的显示与隐藏
                editCatDialogVisible: false,
                // 添加分类的表单数据对象
                addCatForm: {
                    cat_name: '',
                    cat_pid: 0,
                    cat_level: 0
                },
                // 添加表单的验证规则对象
                addCatFormRules: {
                    cat_name: [
                        {
                            required: true, message: '请输入分类名称', trigger: 'blur'
                        }
                    ]
                },
                // 父级分类列表
                parentCateList: [],
                // 指定级联选择器的配置对象
                cascaderProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    checkStrictly: true
                },
                // 选中的父级分类的ID数
                selectedKey: [],
                // 编辑分类的表单数据对象
                editCatForm: {},
                // 编辑表单的验证规则对象
                editCatFormRules: {
                    cat_name: [
                        {
                            required: true, message: '请输入分类名称', trigger: 'blur'
                        }
                    ]
                },
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            // 获取列表数据
            async getCateList() {
                const {data: res} = await this.$http.get('categories', { params: this.queryInfo})
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品数据失败')
                }
                // console.log(res.data.result)
                this.cateList = res.data.result
                this.total = res.data.total
            },
            // 监听 pageSize 改变
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            // 监听 pageNum 改变
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },
            // 获取父级分类的数据列表
            async getParentCatList() {
                const {data: res} = await this.$http.get('categories', {params: {type: 2}})
                if (res.meta.status !== 200) {
                    return this.$message.error('获取父级分类数据失败')
                }
                // console.log(res.data)
                this.parentCateList = res.data
            },
            // 点击按钮，展示添加分类对话框
            showAddCatDialog() {
                this.getParentCatList()
                this.addCatDialogVisible = true
            },
            // 选中项发生变化触发
            parentCateChanged() {
                if (this.selectedKey.length > 0) {
                    this.addCatForm.cat_pid = this.selectedKey[this.selectedKey.length - 1]
                    this.addCatForm.cat_level = this.selectedKey.length
                }
                else {
                    this.addCatForm.cat_pid = 0
                    this.addCatForm.cat_level = 0
                }
            },
            // 点击按钮添加新分类
            addCate() {
                this.$refs.addCatFormRef.validate(async valid => {
                    if (!valid) return
                    const {data: res} = await this.$http.post('categories', this.addCatForm)
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加分类失败！')
                    }
                    this.$message.success('添加分类成功！')
                    this.getCateList()
                    this.addCatDialogVisible = false
                })
            },
            // 监听对话框的关闭事件，重置表单数据
            addCateDialogClose() {
                this.$refs.addCatFormRef.resetFields()
                this.selectedKey = []
                this.addCatForm.cat_level = 0
                this.addCatForm.cat_pid = 0
            },
            // 点击编辑按钮，展示编辑分类对话框
            async showEditCateDialog(id) {
                const {data: res} = await this.$http.get('categories/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('获取分类信息失败！')
                }
                this.editCatForm = res.data
                this.editCatDialogVisible = true
            },
            // 修改分类信息并提交
            editCateInfo() {
                this.$refs.editCatFormRef.validate(async valid => {
                    if (!valid) return
                    const {data: res} = await this.$http.put(
                        'categories/' + this.editCatForm.cat_id, {cat_name: this.editCatForm.cat_name}
                        )
                    if (res.meta.status !== 200) {
                        return this.$message.error('更新分类信息失败!')
                    }
                    this.$message.success('更新分类信息成功!')
                    this.editCatDialogVisible = false
                    this.getCateList()
                })
            },
            // 删除分类信息并提交
            async removeCateInfoByID(id) {
                const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已经取消删除')
                }
                const {data: res} = await this.$http.delete('categories/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除失败！')
                }
                this.$message.success('删除成功！')
                this.getCateList()
            }
        }
    }
</script>

<style scoped lang="less">
    .treeTable {
        margin-top: 15px;
    }
    .el-cascader {
        width: 100%;
    }
    .el-cascader-panel {
        height: 500px;
    }
</style>
