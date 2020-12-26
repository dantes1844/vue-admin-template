<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="searchForm"
      label-width="100px"
      label-position="left"
      :size="controlSize"
      :inline="true" >
      <el-form-item label="名称">
        <el-input v-model="searchForm.name" />
      </el-form-item>
      <el-form-item label="区域">
        <el-select v-model="searchForm.region" placeholder="请选择">
          <el-option label="北京" value="beijing" />
          <el-option label="上海" value="shanghai" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-col>
          <el-date-picker
          v-model="searchForm.date1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="布尔值">
        <el-switch v-model="searchForm.delivery" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="searchForm.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="searchForm.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="20">
          <el-form-item>
                  <el-button
                      type="primary"
                      :size="controlSize"
                      icon="el-icon-search"
                      @click="onSubmit">查询</el-button>
                  <el-button
                      :size="controlSize"
                      @click="onCancel">取消</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
            <el-button
                type="primary"
                :size="controlSize"
                icon="el-icon-circle-plus-outline"
                @click="handleCreate">新增</el-button>
        </el-col>
        <el-col :span="2">
            <router-link class="pan-btn light-blue-btn" to="/example/import">
              <el-button
                type="primary"
                :size="controlSize"
                icon="el-icon-upload2">导入</el-button>
            </router-link>
        </el-col>
      </el-row>

    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          {{ scope.row.emailAddress }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="姓" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.surname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            :size="controlSize"
            icon="el-icon-edit"
            @click="handleUpdate(row)">编辑</el-button>
          <el-button
            icon="el-icon-delete"
            v-if="row.status != 'deleted'"
            :size="controlSize"
            type="danger"
            @click="handleDelete(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="userDto"
        :size="controlSize"
        label-position="right"
        label-width="120px"
        :inline=true>
        <el-form-item label="用户名" prop="userName">
           <el-input v-model="userDto.userName" type="text" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="emailAddress">
          <el-input v-model="userDto.emailAddress" type="text" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="姓" prop="surname">
          <el-input v-model="userDto.surname" type="text" placeholder="姓" />
        </el-form-item>
        <el-form-item label="名" prop="name">
          <el-input v-model="userDto.name" type="text" placeholder="名" />
        </el-form-item>
        <el-form-item label="激活">
          <el-switch v-model="userDto.isActive" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :size="controlSize"
          @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          :size="controlSize"
          @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getArticleList } from "@/api/table";
import Pagination from "@/components/Pagination";
import { createUser, getUserList,deleteUser } from '@/api/user'
import { MessageBox, Message } from 'element-ui'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      total: 0,
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      searchForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      userDto: {
        id: undefined,
        userName: '',
        name: '',
        surname: '',
        emailAddress: '',
        isActive: false
      },
      dialogStatus: '',
      statusOptions: ['published', 'draft', 'deleted'],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        emailAddress: [{ required: true, message: '邮箱必须填写', trigger: 'blur' }],
        userName: [{ required: true, message: '用户名必须填写', trigger: 'blur' }],
        surname: [{ required: true, message: '姓必须填写', trigger: 'blur' }],
        name: [{ required: true, message: '名必须填写', trigger: 'blur' }]
      },
    };
  },
  created() {
    this.getList();
  },
  computed:{
    controlSize(){
          return this.$store.state.settings.controlSize;
        }
  },
  methods: {
    getList() {
      this.listLoading = true;
      getUserList(this.listQuery).then(response => {
        var result = response.data.result;
        this.list = result.items;
        (this.listLoading = false), (this.total = result.totalCount);
      });
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('user.index.vue',this.userDto);
            createUser(this.userDto).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
       MessageBox.confirm('确定删除当前用户吗?', '删除确认', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(row.id).then(() => {
            this.getList();
          })
        })

    },
    onSubmit() {
      this.getList();
    },
    onCancel() {
      this.resetTemp();
    }
  }
};
</script>
