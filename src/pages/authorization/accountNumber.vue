<template>
  <div class="zzl-container box">
    <div class="title zzl-title clearfix">
      <span class="fl">
        <i class="zzl_icons zion-people"></i>账号管理
      </span>
    </div>
    <div class="content moduleOne">
      <div class="topSearch clearfix">
        <div class="search fl" style="width: 200px;">
          <p class="zzl-formLabel">昵称</p>
          <el-input @keyup.enter.native="searchData" placeholder="请输入昵称回车查询" v-model="queryData.kw"></el-input>
        </div>
        <div class="search fl" style="width: 200px;">
          <p class="zzl-formLabel">类别</p>
          <el-select @change="searchData" v-model="associationType" placeholder="请选择类别" clearable style="width:100%;">
            <el-option
              v-for="item in associationList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search fl" style="width: 380px;">
          <p class="zzl-formLabel">保险机构:</p>
          <el-cascader
            style="width: 100%;"
            clearable
            :props="$store.state.ourProps"
            :change-on-select="true"
            :show-all-levels="false"
            filterable
            :options="companyList"
            v-model="insuranceInstitute"
            placeholder="请选择机构"
            ref="elCascaders"
            popper-class="selectCompanyEls"
            @focus="toFindSelectCompanyEl2"
            @change="searchData">
          </el-cascader>
        </div>
        <div class="search fl">
          <button class="zzl-btn zzl-success margin21" @click="searchData">查询</button>
        </div>
        <div class="search fr margin21" style="padding-right: 0" v-if="!isProvincialQuery">
          <button class="zzl-btn zzl-primary" @click.prevent="addUserModal">
            <i class="zzl_icons zion-add"></i><span class="icon-left">添加账号</span>
          </button>
        </div>
      </div>
      <div class="tableList">
        <el-table
          :data="userTableData"
          stripe
          border
          @sort-change="changeTableSort">
          <el-table-column
            prop="Nickname"
            label="昵称"
            align="center"
            min-width="120px"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="Name"
            label="账户名"
            align="center"
            min-width="120px"
            show-overflow-tooltip>
          </el-table-column>
          <!--<el-table-column-->
            <!--prop="Email"-->
            <!--label="邮箱"-->
            <!--align="center"-->
            <!--min-width="120px"-->
            <!--sortable="custom"-->
            <!--show-overflow-tooltip>-->
          <!--</el-table-column>-->
          <el-table-column
            prop="Mobile"
            label="手机号"
            align="center"
            min-width="120px"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="角色"
            min-width="160px"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ findRoleDescription(scope.row.Roles) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="Company_Name"
            label="所属机构"
            align="center"
            min-width="240px"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="CreatedTime"
            label="创建时间"
            align="center"
            min-width="120px"
            sortable="custom"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{zzlFormat.getTimeDate(scope.row.CreatedTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="!isProvincialQuery"
            fixed="right"
            label="操作"
            align="center"
            width="160px">
            <template slot-scope="scope">
              <i class="zzl_icons zion-write" @click="userHandleCommonEdit(scope.row, scope.$index)" title="编辑"></i>
              <i v-if="getRoles(scope.row.Roles)" class="zzl_icons zion-delete" @click="userHandleCommonDelete(scope.row, scope.$index)" title="删除"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="userSizeChange"
          @current-change="userCurrentChange"
          :current-page="userCurrentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="userPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userTotal">
        </el-pagination>
      </div>
    </div>
    <!--添加修改User的模态框-->
    <section>
      <el-dialog
        :visible.sync="userModal"
        append-to-body
        width="50%"
        top="15vh"
        custom-class="commentDialog"
        :before-close="closeUserModal"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false">
        <div class="addOrUpdate">
          <div class="title clearfix">
            <span class="fl">{{userUpdateOrAddNum === 1 ? '添加管理用户' : '修改管理用户'}}</span><span class="fr" @click="closeUserModal"><i class="zzl_icons zion-close"></i></span>
          </div>
          <div class="formBox">
            <el-form :model="userForm"  label-position="top" ref="userForm" :rules="userRules" label-width="100px">
              <el-row>
                <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                  <div class="inputItem">
                    <el-form-item prop="nickName" label="昵称">
                      <el-input size="medium" v-model="userForm.nickName" placeholder="请输入昵称"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                  <div class="inputItem">
                    <el-form-item prop="userName" label="账户名">
                      <el-input size="medium" v-model="userForm.userName" placeholder="请输入账户名"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <!--<el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">-->
                  <!--<div class="inputItem">-->
                    <!--<el-form-item prop="emailAddr" label="邮箱">-->
                      <!--<el-input size="medium" v-model="userForm.emailAddr"  placeholder="请输入邮箱"></el-input>-->
                    <!--</el-form-item>-->
                  <!--</div>-->
                <!--</el-col>-->
                <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                  <div class="inputItem">
                    <el-form-item prop="mobileNumber" label="手机">
                      <el-input size="medium" v-model="userForm.mobileNumber"  placeholder="请输入手机号"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <div class="inputItem">
                    <el-form-item prop="newPwd" label="新密码">
                      <el-input size="medium" v-model="userForm.newPwd" type="password"  placeholder="请输入新密码"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <div class="inputItem">
                    <el-form-item prop="reNewPwd" label="重复新密码">
                      <el-input size="medium" v-model="userForm.reNewPwd" type="password"  placeholder="再次输入密码"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="inputItem">
                    <el-form-item label="所属机构" prop="company" class="search2 fl" style="width: 100%;">
                      <!-- <el-select @change="changeCompany" filterable v-model="userForm.instid" placeholder="请选择所属机构" style="width:100%;">
                        <el-option
                          v-for="item in companyList"
                          :key="'com' + item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select> -->
                      <el-cascader
                        key="cascader1"
                        filterable
                        clearable
                        @change="changeCompany"
                        :options="companyList"
                        :props="companyprops"
                        change-on-select
                        :show-all-levels="false"
                        placeholder="请选择所属机构"
                        v-model="userForm.company"
                        ref="elCascader"
                        popper-class="selectCompanyEl"
                        @focus="toFindSelectCompanyEl"
                        style="width:100%;"
                      ></el-cascader>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
                  <div class="inputItem">
                    <el-form-item prop="roles" label="角色选择">
                      <el-select :disabled ="identity !== 1" v-model="userForm.roles" placeholder="请选择角色" style="width: 100%">
                        <el-option
                          v-for="item in roleOptions"
                          :key="item.Name"
                          :label="item.RoleDescription"
                          :value="item.Name">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <!--<el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" v-if="isAssociation">-->
                  <!--<div class="inputItem">-->
                    <!--<el-form-item prop="companytype_right" label="机构分类权限">-->
                      <!--<el-select v-model="userForm.companytype_right" placeholder="请选择机构分类" style="width: 100%">-->
                        <!--<el-option-->
                          <!--v-for="item in companyTypList"-->
                          <!--:key="'use' + item.code"-->
                          <!--:label="item.name"-->
                          <!--:value="item.code">-->
                        <!--</el-option>-->
                      <!--</el-select>-->
                    <!--</el-form-item>-->
                  <!--</div>-->
                <!--</el-col>-->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="inputItem">
                    <el-form-item prop="description" label="备注">
                      <el-input type="textarea" size="medium" v-model="userForm.description"  placeholder="请输入备注"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="operation clearfix">
            <button class="zzl-btn zzl-success fr" @click.prevent="addOrUpdateUser('userForm')">
              提交
            </button>
            <button class="zzl-btn fr" @click.prevent="reset('userForm')">
              重置
            </button>
          </div>
        </div>
      </el-dialog>
    </section>
  </div>
</template>
<script>
import hashes from '../../../static/js/hashes.min'
export default {
  name: "accountNumber",
  data() {
    let rePassWord = (rule, _value, callback) => {
      if (this.userForm.newPwd === this.userForm.reNewPwd) {
        callback();
      } else {
        callback(new Error('两次密码不一致'));
      }
    };
    let validNumber = (rule, value, callback) => {
      if (value.length === 0) {
        this.countValidate = true;
        callback();
      }
      if (value.length !== 0 && (value.length < 5 || value.length > 15)){
        callback(new Error("密码长度为5至15位"));
      }
      let reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
      if (reg.test(value)) {
        this.countValidate = true;
        callback();
      } else {
        callback(new Error("密码必须由字母和数字组成"));
      }
    };
    return {
      companyprops: {
        value: 'id',
        label: 'name',
        children: 'children'
      }, // 区域配置参数
      queryData: {
        kw: ''
      }, // 查询数据
      companyList: [], // 机构列表
      insuranceInstitute: [],
      userTableData: [], // table的data
      userTotal: 0, // 一共多少条
      userPageSize: 20, // 每页多少条
      userCurrentPage: 1, // 当前页码
      userModal: false, // 添加修改User的模态框
      userUpdateOrAddNum: -1, // 添加是1，修改是2
      userForm: {
        nickName: '',
        roles: '',
        userName: '',
        // emailAddr: '',
        mobileNumber: '',
        newPwd: '',
        reNewPwd: '',
        description: '',
        company: [],
        instid: '',
        // companytype_right: ''
      }, // 用户的form
      // companyTypList: [], // 机构分类
      userRules: {
        nickName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '不能为空', trigger: 'blur'},
          { required: true, validator: validNumber, trigger: 'blur'}
        ],
        reNewPwd: [
          { required: true, message: '不能为空', trigger: 'blur'},
          { required: true, trigger: 'blur', validator: rePassWord }
        ],
        roles: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        company: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        instid: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
      }, // 用户的form规则
      roleOptions: [], // 角色选择的选项
      userId: '', // 修改的ID
      sortBasis: 7, // 排序依据
      networkState: true, // 网络状态
      isAssociation: true, // 是否是协会
      associationList: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '公司',
          value: 0
        },
        {
          label: '协会',
          value: 1
        }
      ],
      associationType: '',
      identity: -1,
      identityInfo: {},
      oldCompany: '',
      oldUserName: '',
      order: 'created_time',
      by: 1,
      isProvincialQuery: true, // 是否是查询账号
    };
  },
  methods: {
    getRoles (_role) {
      let arr = JSON.parse(sessionStorage.getItem('role'))
      for (let item of arr) {
        if (item === _role) {
          return false
        }
      }
      return true
    },
    toFindSelectCompanyEl2 () {
      setTimeout(() => {
        document.getElementsByClassName('selectCompanyEls')[0].addEventListener('dblclick', () => {
          this.$refs.elCascaders.handleClickoutside()
        })
      }, 0)
    },
    // 机构改变
    changeCompany () {
     setTimeout(async () => {
       await this.findIdentity(this.companyList, this.userForm.company[this.userForm.company.length - 1]);
       this.userForm.roles = '';
       await this.getRole();
       if (this.identityInfo.association === 1) {
         this.identity = 1;
         this.roleOptions = [{
           Name: "SX",
           RoleDescription: "寿险角色"
         },{
           Name: "CX",
           RoleDescription: "产险角色"
         },{
           Name: "ZJ",
           RoleDescription: "中介角色"
         }]
       } else if (this.identityInfo.district_code === '8644') {
         this.userForm.roles = "province_company";
         this.identity = 2
       } else {
         this.userForm.roles = "municipal_company";
         this.identity = 3
       }
       this.$refs.userForm.clearValidate();
     }, 300)
    },
    async findIdentity (_arr, _id) {
      for (let i in _arr) {
        if (_arr[i].id === _id) {
          this.identityInfo = _arr[i]
        } else if (this.zzlFormat.isEmptyArray(_arr[i].children)) {
          await this.findIdentity(_arr[i].children, _id)
        }
      }
    },
    // 重置
    reset (_refName) {
      this.$refs[_refName].resetFields();
      this.isAssociation = true
      this.userForm = {
        nickName: '',
        roles: '',
        userName: '',
        // emailAddr: '',
        mobileNumber: '',
        newPwd: '',
        reNewPwd: '',
        description: '',
        company: [],
        instId: '',
        // companytype_right: ''
      } // 用户的form
    },
    // 关闭模态框
    closeUserModal () {
      this.$refs['userForm'].resetFields();
      this.userModal = false;
      this.isAssociation = true
      this.userForm = {
        nickName: '',
        roles: '',
        userName: '',
        // emailAddr: '',
        mobileNumber: '',
        newPwd: '',
        reNewPwd: '',
        description: '',
        company: [],
        instid: '',
        // companytype_right: ''
      } // 用户的form
    },
    // 修改
    async userHandleCommonEdit (_data, _num) {
      console.log(_data)
      this.userRules.newPwd[0].required = false;
      this.userRules.reNewPwd[0].required = false;
      let _row = JSON.parse(JSON.stringify(_data));
      this.userId = _row.ID
      this.userUpdateOrAddNum = 2;
      this.userForm.nickName = _row.Nickname;
      this.userForm.userName = _row.Name;
      this.oldCompany = _row.InstId
      this.oldUserName = _row.Name
      this.userForm.mobileNumber = _row.Mobile;
      // this.userForm.emailAddr = _row.Email;
      this.userForm.newPwd = '';
      this.userForm.description = _row.Description;
      // this.userForm.companytype_right = _row.CompanyTypeRight;
      this.userForm.instid = _row.InstId;
      this.getALLL(_row.InstId, this.companyList)
      // await this.changeCompany()
      this.userForm.roles = _row.Roles;
      // let roles = _row.Roles.split(',');
      // for (let item of roles) {
      //   for (let it of this.roleOptions) {
      //     if (it.Name === item) {
      //       this.userForm.roles.push(it.Name)
      //     }
      //   }
      // }
      this.userRules.newPwd[0].required = false;
      this.userRules.reNewPwd[0].required = false
      this.userModal = true;
    },
    // 添加
    async addUserModal () {
      this.userRules.newPwd[0].required = true;
      this.userRules.reNewPwd[0].required = true;
      this.userModal = true;
      this.userUpdateOrAddNum = 1;
    },
    // 添加或修改用户
    addOrUpdateUser (formName) {
      if (!this.networkState) {
        this.$message.warning('网络繁忙')
        return
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let phoneReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
          let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
          if (this.userForm.company.length === 0) {
            this.$message.error('请选择所属机构')
            return
          }
          // if (this.userForm.emailAddr !== '' && !emailReg.test(this.userForm.emailAddr)) {
          //   this.$message.error('邮箱格式不正确')
          // }
          if (this.userForm.mobileNumber !== '' && !phoneReg.test(this.userForm.mobileNumber)) {
            this.$message.error('手机号格式不正确')
          } else if (this.userForm.newPwd.indexOf(this.userForm.reNewPwd) === -1) {
            this.$message.error('两次密码不一致')
          } else if (this.userUpdateOrAddNum === 1) {
            // let roles = '';
            let pwd = new hashes.MD5().hex(this.userForm.newPwd + '_zzlfe25ec32c2d65');
            // for (let i in this.roleOptions) {
            //   if (this.roleOptions[i].Name === this.userForm.roles) {
            //     roles = this.roleOptions[i].Name
            //   }
            // }
            // for (let item of this.userForm.roles) {
            //   for (let it of this.roleOptions) {
            //     if (it.Name === item) {
            //       roles.push(it.Name)
            //     }
            //   }
            // }
            let params = {
              nickName: this.userForm.nickName,
              roles: this.userForm.roles,
              userName: this.userForm.userName,
              emailAddr: '',
              mobileNumber: this.userForm.mobileNumber,
              newPwd: pwd,
              description: this.userForm.description,
              instid: this.userForm.company.length === 0 ? '' : this.userForm.company[this.userForm.company.length - 1]
            };
            const res = await this.zzlHttp.post(this.zzlApi.addUser, params);
            if (res.code === 200) {
              this.$refs['userForm'].resetFields();
              this.userModal = false
              this.userForm = {
                nickName: '',
                roles: '',
                userName: '',
                // emailAddr: '',
                mobileNumber: '',
                newPwd: '',
                reNewPwd: '',
                description: '',
                company: [],
                instId: '',
                // companytype_right: ''
              } // 用户的form
              await this.getUserTableData();
              this.$message.success('添加成功')
            } else {
              // this.userTableData.push(this.userForm)
              this.$message.error('添加失败')
            }
          } else {
            let pwd = '';
            if (this.userForm.newPwd !== '') {
              pwd = new hashes.MD5().hex(this.userForm.newPwd + '_zzlfe25ec32c2d65');
            }
            // for (let item of this.userForm.roles) {
            //   for (let it of this.roleOptions) {
            //     if (it.Name === item) {
            //       roles.push(it.Name)
            //     }
            //   }
            // }
            let params = {
              id: this.userId,
              nickName: this.userForm.nickName,
              roles: this.userForm.roles,
              userName: this.userForm.userName,
              emailAddr: '',
              mobileNumber: this.userForm.mobileNumber,
              newPwd: pwd,
              description: this.userForm.description,
              instid: this.userForm.company.length === 0 ? '' : this.userForm.company[this.userForm.company.length - 1]
            };
            const res = await this.zzlHttp.post(this.zzlApi.updateUser, params);
            if (res.code === 200) {
              if(this.userForm.userName !== this.oldUserName){
                if(this.oldUserName === window.sessionStorage.getItem('whoIsUser')) {
                  this.$message.warning('用户名发生修改，请重新登录')
                  sessionStorage.clear();
                  this.$router.push({ name: 'login' });
                  return;
                }
              }
              if(this.oldCompany !== this.userForm.company[this.userForm.company.length - 1]){
                if(this.oldUserName === window.sessionStorage.getItem('whoIsUser')) {
                  this.$message.warning('所属公司发生修改，请重新登录')
                  sessionStorage.clear();
                  this.$router.push({name: 'login'});
                  return;
                }
              }
              this.$refs['userForm'].resetFields();
              this.userModal = false
              this.userForm = {
                nickName: '',
                roles: '',
                userName: '',
                // emailAddr: '',
                mobileNumber: '',
                newPwd: '',
                reNewPwd: '',
                description: '',
                company: [],
                instid: '',
                // companytype_right: ''
              } // 用户的form
              this.isAssociation = true
              await this.getUserTableData()
              this.$message.success('修改成功')
            } else {
              this.$message.error('修改失败')
            }
          }
        }
      })
    },
    // 页码改变
    userCurrentChange (val) {
      this.userCurrentPage = val;
      this.getUserTableData();
    },
    // 每页多少条改变
    userSizeChange (val) {
      this.userPageSize = val;
      this.searchData()
    },
    // 查询
    async searchData () {
      this.userCurrentPage = 1;
      await this.getUserTableData();
    },
    // 排序
    changeTableSort(column) {
      console.log(11)
      this.order = column.prop;
      this.by = column.order === 'ascending' ? 0 : 1;
      this.getUserTableData();
    },
    // 删除
    async userHandleCommonDelete (_data, _num) {
      this.$confirm('您正在执行删除操作', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.zzlHttp.post(this.zzlApi.delUser + '/' + _data.ID);
        if (res.code === 200) {
          await this.getUserTableData()
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    // 遍历数组
    ergodic (_arr) {
      let judge = function (val, arr) {
        for (let item of arr) {
          if (item.id === val) {
            return false
          }
        }
        return true
      }
      for (let item of _arr) {
        if (item === 8644300100) {
          console.log(item)
        }
        if (judge(item.id, this.companyList)) {
          this.companyList.push(item)
        }
        if (item.children && item.children.length > 0) {
          this.ergodic(item.children)
        }
      }
    },
    findRoleDescription(_val){
      let roledesc="";
      _val.split(",").forEach(element => {
        if(roledesc.length>0)
            roledesc+=",";
        let arr=this.roleOptions.find(function(item){return item.Name===element; });
        roledesc+=(arr?arr.RoleDescription:element);
      });
      return roledesc;
    },
    // 获取表格数据
    async getUserTableData () {
      const loading = this.$loading({
        lock: true,
        text: "系统正在努力加载,请耐心等待",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let companyId = '';
      if (this.zzlFormat.isEmptyArray(this.insuranceInstitute)) {
        companyId = this.insuranceInstitute[this.insuranceInstitute.length - 1]
      }
      let params = {
        pageNum: this.userCurrentPage,
        pageSize: this.userPageSize,
        order: 'created_time',
        by: this.by === undefined ? 1 : this.by,
        kw: this.queryData.kw,
        association: this.associationType,
        company_id: companyId
      };
      const res = await this.zzlHttp.post(this.zzlApi.getUserTableData, params);
      if (res.code === 0) {
        this.userTotal = res.data.count || 0;
        for (let i in res.data.list) {
          res.data.list[i].CreatedTime = res.data.list[i].CreatedTime.replace('T', ' ')
        }
        this.userTableData = res.data.list || []
      } else {
        this.userTotal = 0
        this.userTableData = []
      }
      loading.close();
    },
    // 获取机构分类
    async getCompanyCategoryALL() {
      var typeoptions=[{name: '全部', code: ''},{"code":"CX","name":"产险"},{"code":"SX","name":"寿险"},{"code":"ZJ","name":"中介"}];
      this.companyTypList=typeoptions;
    },
    checkArray (_array, _id) {
      for (let i in _array) {
        if (_array[i].id === _id) {
          return true
        }
      }
      return false
    },
    // 获取机构
    async getCompanyAll() {
      if (this.zzlFormat.isEmptyArray(this.$store.state.selectCompanyOptions)) {
        this.companyList = this.$store.state.selectCompanyOptions;
        if (this.$store.state.instid === '') {
          this.insuranceInstitute = [this.companyList[0].id];
        } else {
          this.insuranceInstitute = [this.$store.state.instid]
        }
        // let str = '';
        // this.recursiveCompanyData(this.companyList, str, this.searchCompanyOptions);
      } else {
        const res = await this.zzlHttp.post(this.zzlApi.getInsuranceInstitute);
        if (res.code === 0) {
          this.companyList = res.data.list || [];
          if (this.zzlFormat.isEmptyArray(this.companyList)) {
            if (res.data.instid !== '') {
              let bool = await this.checkArray(this.companyList, res.data.instid);
              if (bool) {
                this.insuranceInstitute = [res.data.instid]
                this.$store.commit('setInstid', res.data.instid);
              } else {
                this.insuranceInstitute = [this.companyList[0].id]
                this.$store.commit('setInstid', this.companyList[0].id);
              }
            } else {
              this.insuranceInstitute = [this.companyList[0].id];
              this.$store.commit('setInstid', this.companyList[0].id)
            }
          } else {
            this.$message.error('获取机构失败,请刷新或重新登入');
          }
          this.$store.commit('setSelectCompanyOptions', this.companyList);
        } else {
          this.companyList = [];
        }
      }

      // const res = await this.zzlHttp.post(this.zzlApi.getCompanyAll, {instid: window.sessionStorage.getItem('instid')});
      // if (res.code === 0) {
      //   this.companyList = res.data.list || []
      //   // this.ergodic(res.data.list)
      // }
    },
    // 获取角色列表
    async getRole () {
      const res = await this.zzlHttp.post(this.zzlApi.getRole);
      if (res.code === 0) {
        this.roleOptions = []
        let jurisdiction = JSON.parse(sessionStorage.getItem("role"));
        let dictionary=['SX','CX', 'ZJ', 'province_company' , 'municipal_company'];
        for (let item of jurisdiction) {
          if (dictionary.indexOf(item)!== -1) {
            for (let it of res.data) {
              if (item === 'SX' && (['SX', 'municipal_company'].indexOf(it.Name)!=-1)) {
                this.roleOptions.push(it)
              } else if ( item === 'CX' && (['CX', 'municipal_company'].indexOf(it.Name)!=-1)) {
                this.roleOptions.push(it)
              } else if (item === 'ZJ' && (['ZJ', 'municipal_company'].indexOf(it.Name)!=-1)) {
                this.roleOptions.push(it)
              } else if (item === 'province_company' && (['province_company', 'municipal_company'].indexOf(it.Name)!=-1)) {
                this.roleOptions.push(it)
              }
            }
          } else {
            this.roleOptions = res.data
          }
        }
      }
    },
    toFindSelectCompanyEl () {
      setTimeout(() => {
        document.getElementsByClassName('selectCompanyEl')[0].addEventListener('dblclick', () => {
          this.$refs.elCascader.handleClickoutside()
        })
      }, 100)
    },
    // 遍历数组
    getALLL (id, array) {
      let arr = []
      let list = []
      let arr2 = [
        {
          id: 1,
          children: [
            {
              id: 2
            },
            {
              id: 12
            }
          ]
        },
        {
          id: 5,
          children: [
            {
              id: 3
            },
            {
              id: 4,
              children: [
                {
                  id: 6
                }
              ]
            }
          ]
        },
        {
          id: 18
        },
        {
          id: 7,
          children: [
            {
              id: 8
            },
            {
              id: 9,
              children: [
                {
                  id: 10
                }
              ]
            },
            {
              id: 11,
              children: [
                {
                  id: 13
                }
              ]
            },
            {
              id: 19
            }
          ]
        },
        {
          id: 20
        },
        {
          id: 21
        }
      ]
      let a = 0
      let c = 0
      let gett = function (val, arr2 , a) {
        if (arr.length !== 0) {
          return
        }
        if (arr.length === list.length && a === 0) {
          list = []
          arr = []
        }
        for (let i = 0; i < arr2.length;i ++) {
          if (arr.length !== 0) {
            return
          }
          if (arr2[i].id === val) {
            list.push(arr2[i].id)
            arr = list
            return
          }
          if (arr2[i].children && arr2[i].children.length !== 0) {
            list.push(arr2[i].id)
            a = a +1
            if (arr2.length -1 === i){
              c = c + 1
            }
            gett(val, arr2[i].children, a)
          }
          if (arr2.length -1 === i && (!arr2[i].children || arr2[i].children.length == 0)) {
            list.splice(list.length - 1 - c, 1 + c)
            a = a - 1
            c = 0
          }
        }
      }
      gett(id, array, a)
      this.userForm.company = arr
      console.log(arr)
    },
    initializae () {
      let arr = JSON.parse(sessionStorage.getItem('role'))
      this.isProvincialQuery = !arr.some((item) => item.indexOf('query')<0)
    }
  },
  async mounted() {
    if (window.sessionStorage.getItem("status") === "1") {
      const loading = this.$loading({
        lock: true,
        text: "系统正在努力加载,请耐心等待",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      await this.getRole();
      await this.getCompanyAll();
      // 获取tableData
      await this.getUserTableData();
      // await this.getCompanyCategoryALL();
      // 初始化数据
      this.initializae()
      loading.close();
    }
  }
};
</script>

<style scoped lang="scss">
.margin21 {
  margin-top: 21px;
}
.box {
  .content {
    padding: 0 28px 12px;
    min-height: calc(100vh - 118px);
    .tableList {
      i {
        font-size: 16px;
        margin-right: 35px;
        &:last-child {
          margin-right: 0;
        }
      }
      i:hover {
        color: #07c29e;
      }
    }
  }
  .title {
    padding: 12px 17px 0;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 12px;
    color: #07c29e;
    span.fl {
      padding: 0 8px 6px;
      border-bottom: 3px solid #07c29e;
      i {
        font-size: 18px;
        margin-right: 8px;
        vertical-align: -1;
      }
    }
  }
}
.commentDialog {
  .title {
    padding: 12px 20px 12px;
    font-weight: bold;
    background-color: #f8f8f8;
    border-bottom: 1px solid #e6e6e6;
    i {
      cursor: pointer;
      font-size: 12px;
      font-weight: lighter;
      &:hover {
        color: #07c29e;
      }
    }
  }
  .formBox{
    padding: 20px;
  }
  .operation{
    padding: 0 20px 22px;
    button{
      margin-left: 12px;
    }
  }
  .foot {
    padding: 0 28px 20px;
  }
}
.inputItem {
  position: relative;
  padding: 0 8px;
}
</style>
