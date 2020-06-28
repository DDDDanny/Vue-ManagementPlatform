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

                <!-- 表格区域 -->
                <!-- 分页区域 -->
            </el-row>
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
                }
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
            }
        }
    }
</script>

<style scoped lang="less">

</style>
