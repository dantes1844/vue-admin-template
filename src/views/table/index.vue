<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      label-position="left"
      :size="controlSize"
      :inline="true" >
      <el-form-item label="名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="区域">
        <el-select v-model="form.region" placeholder="请选择">
          <el-option label="北京" value="beijing" />
          <el-option label="上海" value="shanghai" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-col>
          <el-date-picker
          v-model="form.date1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="布尔值">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-col :span="24">
        <el-form-item>
                <el-button
                    type="primary"
                    :size="controlSize"
                    @click="onSubmit">查询</el-button>
                <el-button
                    :size="controlSize"
                    @click="onCancel">取消</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="Status"
        width="110"
        align="center">
        <template slot-scope="scope">
          <el-tag
          :size="controlSize"
          :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="Display_time"
        width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            :size="controlSize"
            @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.status != 'published'"
            :size="controlSize"
            type="success"
            @click="handleModifyStatus(row, 'published')">发布</el-button>
          <el-button
            v-if="row.status != 'draft'"
            :size="controlSize"
            @click="handleModifyStatus(row, 'draft')">下架</el-button>
          <el-button
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
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getArticleList } from "@/api/table";
import Pagination from "@/components/Pagination";

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
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
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
      getArticleList(this.listQuery).then(response => {
        this.list = response.data.items;
        (this.listLoading = false), (this.total = response.data.total);
      });
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    handleDelete(row, index) {
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        duration: 2000
      });
      this.list.splice(index, 1);
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
};
</script>
