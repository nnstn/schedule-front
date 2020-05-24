<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 任务管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>任务列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-circle-check" class="handle-del mr10" @click="delAllSelection">
                    批量完成
                </el-button>
                <el-input v-model="query.key" placeholder="任务名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh-left" @click="handleReset">重置</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="openInsert">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="taskName"  label="任务名称"></el-table-column>
                <el-table-column prop="tasker"    label="任务归属"></el-table-column>
                <el-table-column prop="startDate" label="开始时间"></el-table-column>
                <el-table-column prop="endDate"   label="结束时间"></el-table-column>
                <el-table-column prop="taskType"  label="任务类型"></el-table-column>
                <el-table-column label="任务状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.state==3?'success':(scope.row.state==2?'danger':'warning')">
                        {{scope.row.state===3?'完成':(scope.row.state===2?'进行中':'新增')}}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageNo"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 添加任务弹出框 -->
        <el-dialog title="添加任务" :visible.sync="scheduleVisible" width="30%">
            <el-form ref="form" :model="task" label-width="70px">
                <el-form-item label="任务名称">
                    <el-input v-model="task.taskName"></el-input>
                </el-form-item>
                <el-form-item label="任务时间">
                    <el-date-picker class="formitem"
                                    v-model="task.daterange"
                                    value-format="yyyy-MM-dd"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="任务类型">
                    <el-select v-model="task.taskType" placeholder="任务类型" class="formitem">
                        <el-option v-for="item in taskTypes" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否提醒">
                    <el-select v-model="task.noticeType" placeholder="任务提醒" class="formitem">
                        <el-option v-for="item in noticeTypes" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否置顶">
                    <el-select v-model="task.topping" placeholder="任务置顶" class="formitem">
                        <el-option key="false" label="否" value="false"></el-option>
                        <el-option key="true" label="是" value="true"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务状态">
                    <el-select v-model="task.state" placeholder="任务状态" class="formitem">
                        <el-option key="1" label="新增" value="1"></el-option>
                        <el-option key="2" label="处理中" value="2"></el-option>
                        <el-option key="3" label="完成" value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="scheduleVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInsert">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import task from '../../../api/task';

    export default {
        name: 'taskTable',
        data() {
            return {
                taskTypes: [
                    {value: '开发编码', label: '开发编码'},
                    {value: '会议讨论', label: '会议讨论'},
                    {value: '设计相关', label: '设计相关'},
                    {value: '文档编写', label: '文档编写'},
                    {value: 'bug处理', label: 'bug处理'},
                    {value: '环境部署', label: '环境部署'}
                ],
                noticeTypes: [
                    {value: '1', label: '不提醒'},
                    {value: '2', label: '提醒'}
                ],
                query: {
                    key: '',
                    pageNo: 1,
                    pageSize: 10,
                    desc: true,
                    sortBy: "last_update_time"
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                scheduleVisible: false,
                pageTotal: 0,
                form: {},
                task: {},
                id: -1,
                idx: -1,
                rowx: {}
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                task.getall(this.query).then(res => {
                    console.log(res);
                    if (res.flag) {
                        this.tableData = res.data.items;
                        this.pageTotal = res.data.total || 50;
                    } else {
                        this.$message.error(res.message)
                    }

                });
            },
            // 打开新增弹窗
            openInsert() {
                this.task = {
                    taskName:'',         //任务名称
                    taskType: '开发编码', //任务类型：默认为开发任务
                    noticeType: '1',     //任务提醒：默认不提醒
                    topping: "false",    //是否置顶
                    state: "1",          //任务状态
                    startDate:'',        //开始时间
                    endDate:''           //结束时间
                }
                this.scheduleVisible = true;
            },
            // 保存新增日程
            saveInsert() {
                this.task.startDate = this.task.daterange[0];
                this.task.endDate = this.task.daterange[1];
                task.insert(this.task).then(res => {
                    if (res.flag) {
                        this.scheduleVisible = false;
                        this.getData();
                        this.$message.success("新增数据成功");
                    } else {
                        this.$message.error(res.message)
                    }
                });

            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageNo', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                    })
                    .catch(() => {
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.$set(this.tableData, this.idx, this.form);
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.getData();
            },
            // 页面重置
            handleReset() {
                this.$set(this.query,'pageNo' , 1);
                this.getData();
            }
        },
        computed: {
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }

    .formitem {
        width: 100%;
    }
</style>
