<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
            <!-- 步骤条组件 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- Tab组件 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs :tab-position="'left'" style="margin: 50px" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader :options="cateList" :props="cateProps" v-model="addForm.goods_cat"
                                    @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in this.onlyTabData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action 表示图片要上传的Api地址 -->
                        <el-upload :action="this.uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                                   list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce"/>
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="this.previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        data() {
            return {
                activeIndex: '0',
                // 添加商品的表单数据对象
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat: [],
                    pics: [],
                    goods_introduce: '',
                    attrs: []
                },
                addFormRules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' }
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' }
                    ],
                    goods_cat: [
                        { required: true, message: '请选择商品分类', trigger: 'blur' }
                    ],
                },
                cateList: [],
                cateProps: {
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                manyTabData: [],
                onlyTabData: [],
                uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                // 图片上传组件的请求头
                headerObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                previewPath: '',
                previewVisible: false
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList() {
                const {data: res} = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取分类信息失败！')
                }
                this.cateList = res.data
            },
            // 级联选择器选中变化，会触发这个函数
            handleChange() {
                console.log('hah')
            },
            beforeTabLeave(activeName, oldActiveName) {
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error('请选择商品分类')
                    return false
                }
            },
            async tabClick() {
                if (this.activeIndex === '1') {
                    const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,
                        {
                            params: {sel: 'many'}
                        })
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取动态参数失败！')
                    }
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
                    })
                    this.manyTabData = res.data
                }else if (this.activeIndex === '2') {
                    const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,
                        {
                            params: {sel: 'only'}
                        })
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取静态属性失败！')
                    }
                    this.onlyTabData = res.data
                }
            },
            // 处理图片预览效果
            handlePreview(file) {
                this.previewPath = file.response.data.url
                this.previewVisible = true
            },
            // 处理移除图片的操作
            handleRemove(file) {
                const filePath = file.response.data.tmp_path
                const i = this.addForm.pics.findIndex(x => x.pic ===  filePath)
                this.addForm.pics.splice(i, 1)
            },
            // 监听图片上传成功的事件
            handleSuccess(response) {
                const pic = {pic: response.data.tmp_path}
                this.addForm.pics.push(pic)
                console.log(this.addForm.pics)
            },
            // 点击按钮，添加商品
            addGoods() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) {
                        return this.$message.error('请填写必要的表单项！')
                    }
                    // 执行添加的业务逻辑
                    // 深拷贝  lodash 处理good_cat
                    const form = _.cloneDeep(this.addForm)
                    form.goods_cat = form.goods_cat.join(',')
                    // 处理动态参数
                    this.manyTabData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(',')
                        }
                        this.addForm.attrs.push(newInfo)
                    })
                    // 处理静态属性
                    this.onlyTabData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        }
                        this.addForm.attrs.push(newInfo)
                    })
                    form.attrs = this.addForm.attrs
                    // 发起添加商品的请求
                    const {data: res} = await this.$http.post('goods', form)
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加商品失败！')
                    }
                    this.$message.success('添加商品成功！')
                    await this.$router.push(`/goods`)
                })
            }
        },
        computed: {
            cateId() {
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }else {
                    return null
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }
    .previewImg {
        width: 100%;
    }
    .btnAdd {
        margin-top: 15px;
    }
</style>
