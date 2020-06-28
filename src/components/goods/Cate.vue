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
                    <el-button type="primary" >添加分类</el-button>
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
                    {{ scope.row }}
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
                           :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </el-card>
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
                ]
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
        }
    }
</script>

<style scoped lang="less">
    .treeTable {
        margin-top: 15px;
    }
</style>
