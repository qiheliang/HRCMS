<template>
  <div class="pageBox pageBox-role zzl-container">
    <div class="topSwitch">
      <div class="titleButton clearfix zzl-title">
        <span class="fl" @click="switchModule('moduleTwo')" :class="{'active': isModule === 'moduleTwo'}"><i class="zzl_icons zion-edit"></i>角色管理</span>
        <span class="fl" @click="switchModule('moduleThree')" :class="{'active': isModule === 'moduleThree'}"><i class="zzl_icons zion-manage"></i>导航管理</span>
      </div>
    </div>
    <div class="contents moduleTwo" v-show="isModule === 'moduleTwo'">
      <div class="topSearch clearfix">
        <div class="search fl" style="width: 282px;">
          <el-input @keyup.enter.native="searchRole" type="text" placeholder="角色名回车搜索" suffix-icon="el-icon-search" v-model="kw"></el-input>
        </div>
        <div class="search fl">
          <button class="zzl-btn zzl-success" @click="searchRole">查询</button>
        </div>
        <div class="search fr" style="padding-right: 0">
          <button class="zzl-btn zzl-primary" @click.prevent="addRole">
            <i class="zzl_icons zion-add"></i><span class="icon-left">添加角色</span>
          </button>
        </div>
      </div>
      <div class="tableList">
        <el-table
          :data="roleTableData"
          stripe
          border>
          <el-table-column
            prop="Name"
            label="角色名"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="padding:0 10px;" v-html="scope.row.Name"></div>
            </template>
          </el-table-column>
          <el-table-column
            prop="RoleDescription"
            label="角色描述"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="padding:0 10px;" v-html="scope.row.RoleDescription"></div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            min-width="50">
            <template slot-scope="scope">
              <div>
                <i class="zzl_icons zion-write" @click="roleHandleCommonEdit(scope.row, scope.$index)" title="编辑"></i>
                <i class="zzl_icons zion-delete" @click="roleHandleCommonDelete(scope.row, scope.$index)" title="删除"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="roleSizeChange"
          @current-change="roleCurrentChange"
          :current-page="roleCurrentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="rolePageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="roleTotal">
        </el-pagination>
      </div>
    </div>
    <div class="contents moduleThree"  v-show="isModule === 'moduleThree'">
      <div class="topSearch clearfix">
        <div class="search fr" style="padding-right: 0">
          <button class="zzl-btn zzl-primary" @click.prevent="addNavTreeNode(navTreeData.data)">
            <i class="zzl_icons zion-add"></i><span class="icon-left">添加导航</span>
          </button>
        </div>
      </div>
      <div class="navTreeContent">
        <div class="treeLeft">
          <div class="title zzl-title">
            导航列表
          </div>
          <div class="content">
            <el-tree
              :data="navTreeData.data"
              node-key="id"
              ref="navTree"
              draggable
              @node-drop="handleDrop"
              @node-click="navNodeClick"
              :props="navDefaultProps">
            <span class="custom-tree-node clearfix" slot-scope="{ node, data }">
              <span class="fl">{{ node.label }}</span>
              <span class="fr">
                <el-button
                  type="text"
                  size="mini"
                  @click.stop="() => addNavTreeNode(data)">
                  添加
                </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click.stop="() => updateData(data)">
                    修改
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click.stop="() => remove(node, data)">
                  删除
                </el-button>
              </span>
            </span>
            </el-tree>
          </div>
        </div>
        <div class="treeRight">
          <div class="title zzl-title">
            导航内容
          </div>
          <div class="content">
            <el-form label-position="left" :rules="navFormRules" ref="navForm" :model="navForm" label-width="80px">
              <el-form-item prop="superior" label="上级">
                <el-input v-model="navForm.superior" placeholder="上级" disabled></el-input>
              </el-form-item>
              <el-form-item prop="idNumber" label="ID">
                <el-input v-model="navForm.idNumber" placeholder="ID" :disabled="disabledForm"></el-input>
              </el-form-item>
              <el-form-item prop="name" label="名称">
                <el-input v-model="navForm.name" placeholder="名称" :disabled="disabledForm"></el-input>
              </el-form-item>
              <el-form-item prop="url" label="URL">
                <el-input v-model="navForm.url" placeholder="URL" :disabled="disabledForm"></el-input>
              </el-form-item>
              <el-form-item prop="ActionType" label="URL">
                <el-radio-group v-model="navForm.ActionType">
                  <el-radio label="extlink">外部链接</el-radio>
                  <el-radio label="route">内部路由</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="name" label="图标">
                <el-input @click.native="selectIcon" readonly v-model="navForm.icon" placeholder="图标" :disabled="disabledForm">
                  <el-tooltip slot="append" class="item" effect="dark" content="选择图标" placement="top">
                    <el-button icon="zzl_icons zion-task" @click.native="selectIcon"></el-button>
                  </el-tooltip>
                </el-input>
              </el-form-item>
              <el-form-item v-show="!disabledForm">
                <div style="text-align: center;">
                  <button class="zzl-btn" @click.prevent="cancelAll">
                    取消
                  </button>
                  <button  class="zzl-btn zzl-success" @click.prevent="confirmAll('navForm')">
                    确认
                  </button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <!--添加修改role的模态框-->
    <section>
      <el-dialog
        :visible.sync="roleModal"
        append-to-body
        width="590px"
        top="15vh"
        custom-class="commentDialog"
        :before-close="closeRoleModal"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false">
        <div class="addOrUpdate">
          <div class="zzl-title title clearfix">
            <span class="fl clearfix showInline">{{roleUpdateOrAddNum === 1 ? '添加角色' : '修改角色'}}</span><span class="fr" @click="closeRoleModal"><i class="zzl_icons zion-close"></i></span>
          </div>
          <div class="formBox">
            <el-form :model="roleForm"  label-position="top" ref="roleForm" :rules="roleRules" label-width="100px">
              <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="inputItem">
                    <el-form-item prop="Name" label="角色名称:">
                      <el-input size="medium" v-model="roleForm.Name" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <span class="smTip">
                      （角色名为必填项，不能为空）
                    </span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="inputItem">
                    <el-form-item prop="RoleDescription" label="角色描述:">
                      <el-input type="textarea" size="medium" v-model="roleForm.RoleDescription"  placeholder="请输入备注"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="inputItem">
                    <el-form-item prop="name" label="权限控制">
                      <div class="authorizationBox">
                        <el-tree
                          :key="'tree' + new Date().getTime()"
                          :data="treeData"
                          show-checkbox
                          node-key="id"
                          ref="tree"
                          :default-checked-keys="defaultChecked"
                          :props="defaultProps"
                          @check="treeChange">
                        </el-tree>
                      </div>
                    </el-form-item>
                    <!--<span class="selectAll" @click="selectAll">全选权限</span>-->
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="operation clearfix">
            <button class="zzl-btn zzl-success fr" @click.prevent="addOrUpdateRole('roleForm')">
              提交
            </button>
            <button class="zzl-btn fr" @click.prevent="reset('roleForm')">
              重置
            </button>
          </div>
        </div>
      </el-dialog>
    </section>
    <!--icon选择-->
    <section>
      <el-dialog
        :visible.sync="iconModal"
        append-to-body
        width="80%"
        top="5vh"
        custom-class="commentDialog"
        :before-close="closeRoleModal"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false">
        <div class="iconBox">
          <div class="zzl-title title clearfix">
            <span class="fl showInline">图标列表</span>
            <span class="fr"><i @click="closeIconModel" class="zzl_icons zion-close"></i></span>
          </div>
          <ul class="icon-list">
            <li v-for="(item, index) in $store.state.iconList" :key="'iconList' + index" @click="iconClick(item, index)" :class="{'active' : iconNum === index}"><span><i class="zzl_icons" :class="item"></i><span class="icon-name">{{item}}</span></span></li>
          </ul>
          <div class="operation clearfix">
            <button class="zzl-btn zzl-success fr" @click.prevent="confirmIcon">确认</button>
            <button class="zzl-btn fr" @click.prevent="closeIconModel">取消</button>
          </div>
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>
import hashes from '../../../static/js/hashes.min'
export default {
  name: 'authorization',
  data () {
    return {
      kw: '', //搜索值
      companyProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      }, // 机构配置参数
      companyList: [], // 机构列表
      isModule: 'moduleTwo',
      userTableData: [
        {
          name: '1'
        }
      ], // table的data
      roleTableData: [
        {
          name: '1'
        }
      ], // table的data
      userTotal: 0, // 一共多少条
      roleTotal: 0, // 一共多少条
      userPageSize: 10, // 每页多少条
      rolePageSize: 10, // 每页多少条
      userCurrentPage: 1, // 当前页码
      roleCurrentPage: 1, // 当前页码
      userModal: false, // 添加修改User的模态框
      userUpdateOrAddNum: -1, // 添加是1，修改是2
      roleModal: false, // 添加修改Role的模态框
      roleUpdateOrAddNum: -1, // 添加是1，修改是2
      userForm: {
        nickName: '',
        roles: '',
        userName: '',
        emailAddr: '',
        mobileNumber: '',
        newPwd: '',
        reNewPwd: '',
        description: '',
        company: [],
        instid: '',
        companytype_right: ''
      }, // 用户的form
      companyTypList: [], // 机构分类
      roleForm: {
        Name: '',
        RoleDescription: ''
      }, // 角色的form
      roleRules: {
        Name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        RoleDescription: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
      }, // 角色的form规则
      roleOptions: [], // 角色选择的选项
      treeData:  [{
        id: 'systemPermissions',
        label: '系统权限',
        type: 'permissions',
        children: []
      }, {
        id: '$NAV$_',
        label: '系统导航',
        children: [],
        type: 'nav'
      }],
      rightdefArr: [],
      navdefArr: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      navDefaultProps: {
        id: 'Id',
        children: 'Children',
        label: 'Title'
      },
      userId: '', // 修改的ID
      roleId: '',
      defaultChecked: [], // 默认选中
      permissionsParams: [], // 权限参数
      navTreeData: {
        data: [],
        navname: 'main',
        title: '主菜单'
      }, // 导航管理
      navForm: {
        superior: '',
        idNumber: '',
        name: '',
        icon: '',
        url: '',
        ActionType: ''
      }, // 导航的form
      navFormRules: {
        idNumber: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }, // 导航的form的规则
      disabledForm: true, // 禁用表单
      iconModal: false, // icon模态框
      confirmIconValue: '', // 当前选择的icon
      iconNum: -1, // icon的下标
      parentData: [],
      addOrUpdateNum: -1,
      byNum: 1, // 0 降序 1 升序
      sortBasis: 7, // 排序依据
      isFind: false, //
      parentsId: '',
      rcmdArr: [],
      isInArr: false,
      isChange: false,
    }
  },
  methods: {
    // 拖拽节点
    handleDrop () {
      this.updateNav()
    },
    // 排序
    changeTableSort (column, prop, order) {
      if (column.order === 'ascending') {
        this.byNum = 0
      } else {
        this.byNum = 1
      }
      switch (column.prop) {
        case 'Name':
          this.sortBasis = 1;
          break;
        case 'Mobile':
          this.sortBasis = 3;
          break;
        case 'Roles':
          this.sortBasis = 4;
          break;
        case 'Status':
          this.sortBasis = 5;
          break;
        case 'CreatedUser':
          this.sortBasis = 6;
          break;
        case 'CreatedTime':
          this.sortBasis = 7;
          break;
      }
      this.getUserTableData()
    },
    // 删除导航
    async remove(node, data) {
      this.$confirm('您正在执行删除操作', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const parent = node.parent;
        const children = parent.data.Children || parent.data;
        const index = children.findIndex(d => d.Id === data.Id);
        children.splice(index, 1);
        await this.updateNav()
      }).catch(() => {})
    },
    // 修改数据
    updateData (_data) {
      this.addOrUpdateNum = 2;
      this.disabledForm = false;
      this.parentData = _data;
      this.selectNavNode(_data)
    },
    // 确定
    confirmAll (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.addOrUpdateNum === 1) {
            // let obj = {
            //   Title: this.navForm.name,
            //   Id: this.navForm.idNumber,
            //   IconClass: this.navForm.icon,
            //   Action: this.navForm.url,
            //   IsFolder: false,
            //   Children: []
            // };
            // this.navTreeData[0].data.push(obj);
            const newChild = { Id: this.navForm.idNumber, Title: this.navForm.name, Children: [], IsFolder: false, Action: this.navForm.url, IconClass: this.navForm.icon, ActionType: this.navForm.ActionType };
            if (this.parentData.Children) {
              this.parentData.Children.push(newChild);
            } else {
              this.parentData.push(newChild);
            }
          } else {
            this.parentData.Title = this.navForm.name;
            this.parentData.Id = this.navForm.idNumber;
            this.parentData.IconClass = this.navForm.icon;
            this.parentData.Action = this.navForm.url;
            this.parentData.ActionType = this.navForm.ActionType;
          }
          await this.updateNav()
        }
      })
    },
    // 修改导航
    async updateNav () {
      const res = await this.zzlHttp.post(this.zzlApi.updateNav, this.navTreeData);
      if (res.code === 0) {
        this.disabledForm = true;
        this.selectNavNode({});
        this.$message.success('操作成功');
      } else {
        await this.getNavTreeManage();
        this.$message.error('操作失败');
      }
    },
    // 取消
    cancelAll () {
      this.disabledForm = true;
      this.selectNavNode({})
    },
    // icon点击
    iconClick (_data, _num) {
      this.confirmIconValue = _data;
      this.iconNum = _num;
    },
    // 确认选择图标
    confirmIcon () {
      if (this.confirmIconValue !== '') {
        this.navForm.icon = this.confirmIconValue;
        this.iconModal = false
      } else {
        this.$message.warning('请选择一个图标')
      }
    },
    // 关闭图标模态款
    closeIconModel () {
      this.iconModal = false
    },
    // 选择图标
    selectIcon () {
      if (!this.disabledForm) {
        this.iconNum = -1;
        this.iconModal = true
      } else {
        this.$message.warning('请先点击添加或修改')
      }
    },
    // 添加导航
    addNavTreeNode (_data) {
      this.addOrUpdateNum = 1;
      this.parentData = _data;
      this.disabledForm = false;
      this.selectNavNode({})
    },
    // navTree点击改变展示数据
    navNodeClick (data, Node) {
      this.disabledForm = true;
      this.selectNavNode(data, Node)
    },
    // 获取导航管理导航
    async getNavTreeManage () {
      const res = await this.zzlHttp.post(this.zzlApi.getNavTreeManage)
      if (res.code === 0) {
        this.navTreeData.data = res.data;
      }
    },
    // 树权限改变
    async treeChange (data, checked) {
      this.isChange = true;
      this.permissionsParams = [];
      let bool = false;
      for (let i in checked.checkedNodes) {
        if (checked.checkedNodes[i].type === 'permissions') {
          bool = true;
          let num = checked.checkedNodes[i].id.indexOf(',');
          if (num !== -1) {
            let arr = JSON.parse(JSON.stringify(checked.halfCheckedNodes));
            if (this.zzlFormat.isEmptyArray(arr)) {
              if (arr[0].id === 'systemPermissions') {
                arr.splice(0, 1)
              }
            }
            await this.checkArray(arr, checked.checkedNodes[i].id);
            if (!this.isFind) {
              if (this.permissionsParams[this.permissionsParams.length - 1].rights === '') {
                this.permissionsParams[this.permissionsParams.length - 1].rights = checked.checkedNodes[i].id.substring(0, num)
              } else {
                this.permissionsParams[this.permissionsParams.length - 1].rights = this.permissionsParams[this.permissionsParams.length - 1].rights + ',' + checked.checkedNodes[i].id.substring(0, num)
              }
            } else {
              let bool3 = await this.checkIsInArray(this.permissionsParams, this.parentsId);
              if (bool3 !== -1) {
                this.permissionsParams[bool3].rights = this.permissionsParams[bool3].rights + ',' + checked.checkedNodes[i].id.substring(0, num)
              } else {
                this.permissionsParams.push({id: this.parentsId, rights: checked.checkedNodes[i].id.substring(0, num)})
              }
            }
            this.isFind = false;
          } else {
            this.permissionsParams.push({id: checked.checkedNodes[i].id, rights: ''})
          }
        } else {
          let arr2 = JSON.parse(JSON.stringify(checked.halfCheckedNodes));
          if (this.zzlFormat.isEmptyArray(arr2)) {
            if (arr2[0].id === '$NAV$_') {
              arr2.splice(0, 1)
            }
            for (let l in arr2) {
              await this.checkIsInArrId(this.permissionsParams,'$NAV$_' + arr2[l].id)
              if (!this.isInArr) {
                this.permissionsParams.push({id: '$NAV$_' + arr2[l].id, rights: 'P'})
              }
              this.isInArr = false;
            }
          }
          this.permissionsParams.push({id: '$NAV$_' + checked.checkedNodes[i].id, rights: 'A'})
        }
      }
      if (bool) {
        this.permissionsParams.unshift({'id' : '_root_', 'rights' : 'P'})
      }
      console.log(this.permissionsParams)
    },
    checkIsInArrId (_array, _id) {
      for (let i in _array) {
        if(_array[i].id === _id) {
          this.isInArr = true;
          return;
        }
      }
    },
    checkIsInArray (_array, _id) {
      for (let i in _array) {
        if (_array[i].id === _id) {
          return i
        }
      }
      return -1
    },
    checkArray (_array, _id) {
      for (let i in _array) {
        if (_array[i].id === _id) {
          this.isFind = true;
        } else if (this.zzlFormat.isEmptyArray(_array[i].children)) {
          if (!this.isFind) {
            this.parentsId = _array[i].id;
            this.checkArray(_array[i].children , _id, this.parentsId, this.isFind);
          }
        }
      }
      if (this.isFind) {
        return {parentsId: this.parentsId, isFind: this.isFind};
      } else {
        return {parentsId: this.parentsId, isFind: this.isFind};
      }
    },
    // 添加或修改角色
    addOrUpdateRole (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.roleUpdateOrAddNum === 1) {
            let params = {
              roleName: this.roleForm.Name,
              roleDesc: this.roleForm.RoleDescription,
              rights: this.zzlFormat.isEmptyArray(this.permissionsParams) ? this.permissionsParams : defaultChecked
            };
            // let fd = new FormData();
            // fd.append('roleName', this.roleForm.Name);
            // fd.append('roleDesc', this.roleForm.RoleDescription);
            // fd.append('rights', JSON.stringify(this.permissionsParams));
            const res = await this.zzlHttp.post(this.zzlApi.addRole, params);
            if (res.code === 200) {
              await this.getRoleTableData();
              this.$refs['roleForm'].resetFields();
              this.roleModal = false;
              this.$message.success('添加成功')
            } else {
              this.roleTableData.push(this.roleForm);
              this.$message.error('添加失败')
            }
          } else if (this.isChange) {
            let params = {
              id: this.roleId,
              roleName: this.roleForm.Name,
              roleDesc: this.roleForm.RoleDescription,
              rights: this.permissionsParams
            };
            const res = await this.zzlHttp.post(this.zzlApi.updateRole, params);
            if (res.code === 200) {
              await this.getRoleTableData();
              this.$refs['roleForm'].resetFields();
              this.roleModal = false;
              this.isChange = false;
              this.$message.success('修改成功')
            } else {
              this.$message.error('修改失败')
            }
          } else {
            this.isChange = false;
            this.roleModal = false;
          }
        }
      })
    },
    // 重置
    reset (_refName) {
      if (_refName === 'roleForm') {
        setTimeout(() => {
          this.$refs.tree.setCheckedNodes([]);
        })
      }
      this.$refs[_refName].resetFields();
    },
    // 全选权限
    selectAll () {
      this.$refs.tree.setCheckedNodes(this.treeData)
    },
    // 关闭模态框
    closeRoleModal () {
      this.$refs['roleForm'].resetFields();
      this.roleModal = false;
      this.$refs.tree.setCheckedNodes([]);
    },
    findbykey(arr, key) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == key) {
          return arr[i].id+" "+ arr[i].name;
        } else {
          if (arr[i].children)
            return findbykey(arr[i].children, key);
        }
      }
    },
    // 添加
    async addRole () {
      this.defaultChecked = [];
      await this.getNavTree();
      this.roleModal = true;
      setTimeout(() => {
        this.$refs['roleForm'].resetFields();
      },0)
      this.roleUpdateOrAddNum = 1;
    },
    // 修改
    async roleHandleCommonEdit (_data, _num) {
      await this.getNavTree();
      await this.getRolePermission(_data.Name);
      this.roleModal = true;
      this.roleUpdateOrAddNum = 2;
      this.roleId = _data.ID
      setTimeout(() => {
        this.$refs['roleForm'].resetFields();
        this.roleForm.Name = _data.Name;
        this.roleForm.RoleDescription = _data.RoleDescription;
      }, 0)
    },
    // 删除
    async roleHandleCommonDelete (_data, _num) {
      this.$confirm('您正在执行删除操作', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.zzlHttp.post(this.zzlApi.delRole + '/' + _data.ID);
        if (res.code === 200) {
          this.roleTableData.splice(_num, 1);
          this.roleTotal = this.roleTotal - 1;
          this.$message.success('删除成功')
        } else {
          // this.roleTableData.splice(_num, 1)
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    // 切换module
    async switchModule (moduleName) {
      this.isModule = moduleName;
      this.disabledForm = true;
      switch (this.isModule) {
        case 'moduleOne':
          await this.getUserTableData();
          break;
        case 'moduleTwo':
          await this.getRoleTableData();
          break;
        case 'moduleThree':
          await this.getNavTreeManage();
          if (this.zzlFormat.isEmptyArray(this.navTreeData.data)) {
            await this.selectNavNode(this.navTreeData.data[0])
          }
          break;
      }
    },
    // 右边内容显示数据
    selectNavNode (data, Node = null) {
      if (Node === null) {
        this.navForm.superior = '系统菜单';
      } else if (Node.parent.data.Title) {
        this.navForm.superior = Node.parent.data.Title;
      } else {
        this.navForm.superior = '系统菜单';
      }
      this.navForm.name = data.Title;
      this.navForm.idNumber = data.Id;
      this.navForm.icon = data.IconClass;
      this.navForm.url = data.Action;
      this.navForm.ActionType = data.ActionType;
    },
    // 页码改变
    roleCurrentChange (val) {
      this.roleCurrentPage = val;
      this.getRoleTableData();
    },
    // 每页多少条改变
    roleSizeChange (val) {
      this.roleCurrentPage = 1;
      this.rolePageSize = val;
      this.getRoleTableData();
    },
    // 搜索角色
    async searchRole () {
      this.roleCurrentPage = 1
      await this.getRoleTableData()
    },
    // 获取表格数据
    async getRoleTableData () {
      const loading = this.$loading({
        lock: true,
        text: "系统正在努力加载,请耐心等待",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = {
        pageNum: this.roleCurrentPage,
        pageSize: this.rolePageSize,
        kw: this.kw
      };
      const res = await this.zzlHttp.post(this.zzlApi.getRoleTableData, params);
      if (res.code === 0) {
        this.roleTotal = res.data.count || 0;
        this.roleTableData = res.data.list || []
      } else {
        this.roleTotal = 0;
        this.roleTableData = []
      }
      loading.close();
    },
    // // 获取导航
    // async getNav () {
    //   const res = await this.zzlHttp.post(this.zzlApi.getNav);
    //   if (res.code === 0) {
    //   }
    // },
    // 获取角色列表
    async getRole () {
      const res = await this.zzlHttp.post(this.zzlApi.getRole);
      if (res.code === 0) {
        this.roleOptions = res.data
      }
    },
    // 获取导航树
    async getNavTree () {
      const res = await this.zzlHttp.post(this.zzlApi.getNavTree);
      if (res.code === 200) {
        let arr = [];
        await this.processData(res.data.rightdef.Items, arr);
        this.treeData[0].children = arr;
        let arrNav = [];
        await this.processNavData(res.data.navdef, arrNav)
        this.treeData[1].children = arrNav;
      }
    },
    // 递归系统导航数据
    processNavData (_data, arr) {
      for (let i in _data) {
        let obj = {
          label: _data[i].Title,
          id: _data[i].Id,
          children: [],
          IconClass: _data[i].IconClass,
          type: 'nav'
        };
        arr.push(obj)
        if (_data[i].Children && _data[i].Children.length > 0) {
          this.processNavData(_data[i].Children, arr[i].children)
        }
      }
      return arr
    },
    // 递归系统权限数据
    processData (_data, arr, _index = 0) {
      for (let i in _data) {
        if (this.zzlFormat.isEmptyArray(_data[i].Items)) {
          let obj = {
            label: _data[i].Title,
            id: _data[i].RightName,
            children: [],
            RightTypes: _data[i].RightTypes,
            type: 'permissions'
          };
          arr.push(obj)
          this.processData(_data[i].Items, arr, i)
        } else {
          if (_data[i].RightTypes !== '') {
            let obj = {
              label: _data[i].Title,
              id: _data[i].RightName,
              children: [],
              RightTypes: _data[i].RightTypes,
              type: 'permissions'
            };
            arr[_index].children.push(obj);
            let childrenLength = arr[_index].children.length - 1;
            let RightTypes = _data[i].RightTypes.split(',');
            if (RightTypes[0] !== '') {
              for (let j in RightTypes) {
                if (RightTypes[j] === 'P') {
                  let obj = {
                    label: '允许',
                    id: 'P' + ',' + new Date().getTime(),
                    RightTypes: '',
                    children: [],
                    type: 'permissions'
                  }
                  arr[_index].children[childrenLength].children.push(obj)
                } else if (RightTypes[j] === 'R') {
                  let obj = {
                    label: '查询',
                    id: 'R' + ',' + Math.random(),
                    RightTypes: '',
                    children: [],
                    type: 'permissions'
                  }
                  arr[_index].children[childrenLength].children.push(obj)
                } else if (RightTypes[j] === 'C') {
                  let obj = {
                    label: '添加',
                    id: 'C' + ',' + Math.random(),
                    RightTypes: '',
                    children: [],
                    type: 'permissions'
                  }
                  arr[_index].children[childrenLength].children.push(obj)
                } else if (RightTypes[j] === 'M') {
                  let obj = {
                    label: '修改',
                    id: 'M' + ',' + Math.random(),
                    RightTypes: '',
                    children: [],
                    type: 'permissions'
                  }
                  arr[_index].children[childrenLength].children.push(obj)
                } else if (RightTypes[j] === 'D') {
                  let obj = {
                    label: '删除',
                    id: 'D' + ',' + Math.random(),
                    RightTypes: '',
                    children: [],
                    type: 'permissions'
                  }
                  arr[_index].children[childrenLength].children.push(obj)
                }
              }
            }
          }
        }
      }
      return arr
    },
    // 获取角色权限
    async getRolePermission (_name) {
      const res = await this.zzlHttp.post(this.zzlApi.getRolePermission, {id: _name});
      if (res.code === 200) {
        this.defaultChecked = [];
        for (let k in res.data.nav) {
          if (res.data.nav[k].item['@rights'] !== 'P') {
            this.defaultChecked.push(res.data.nav[k].item['@id'])
          }
        }
        for (let i in res.data.normal) {
          if (res.data.normal[i].item['@rights'] === 'R,C,M,D' || (res.data.normal[i].item['@id'] === 'adminuserapi' && res.data.normal[i].item['@rights'] === 'R' || res.data.normal[i].item['@rights'] === 'P')) {
            this.defaultChecked.push(res.data.normal[i].item['@id'])
          } else {
            await this.findRCMD(this.treeData[0].children, res.data.normal[i].item['@id'])
            let rcmdArr = res.data.normal[i].item['@rights'].split(',');
            for (let j in rcmdArr) {
              switch (rcmdArr[j]) {
                case 'R':
                  this.defaultChecked.push(this.rcmdArr[0].id)
                  break;
                case 'C':
                  this.defaultChecked.push(this.rcmdArr[1].id)
                  break;
                case 'M':
                  this.defaultChecked.push(this.rcmdArr[2].id)
                  break;
                case 'D':
                  this.defaultChecked.push(this.rcmdArr[3].id)
                  break;
              }

            }
          }
        }
      }
    },
    findRCMD (_arr, _id) {
      for (let m = 0; m < _arr.length; m++) {
        if (_arr[m].id === _id) {
          this.rcmdArr = _arr[m].children
          return;
        } else {
          this.findRCMD(_arr[m].children, _id)
        }
      }
    }
  },
  async mounted () {
    if (window.sessionStorage.getItem('status') === '1') {
      const loading = this.$loading({
        lock: true,
        text: "系统正在努力加载,请耐心等待",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      switch (this.isModule) {
        case 'moduleTwo':
          await this.getRoleTableData();
          break;
        case 'moduleThree':
          this.disabledForm = true;
          await this.getNavTreeManage();
          await this.selectNavNode(this.navTreeData.data[0]);
          break;
      }
      loading.close();
    }
  }
}
</script>

<style scoped lang="scss">
  .iconBox{
    .operation{
      button{
        margin: 10px 10px 10px 0;
      }
    }
    .title{
      padding: 14px 18px;
      background-color: #f8f8f8;
      border-bottom: solid 1px #e6e6e6;
      margin-bottom: 28px;
      i{
        font-size: 12px;
      }
    }
    ul{
      overflow: hidden;
      list-style: none;
      padding: 0;
      margin: 0 28px;
      border: 1px solid #eaeefb;
      border-radius: 4px;
      li{
        float: left;
        width: 12.5%;
        text-align: center;
        height: 120px;
        line-height: 120px;
        color: #666;
        font-size: 13px;
        transition: color .15s linear;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
        margin-right: -1px;
        margin-bottom: -1px;
        cursor: pointer;
        span{
          display: inline-block;
          line-height: normal;
          vertical-align: middle;
          font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
          color: #99a9bf;
          i{
            display: block;
            font-size: 32px;
            margin-bottom: 15px;
            color: #606266;
          }
        }
        .icon-name{
          display: inline-block;
          padding: 0 3px;
          height: 1em;
          color: #606266;
        }
      }
      li:hover, li:focus{
        color: #fff;
        background-color: #6adac5;
        border-color: #07c29e;
        i{
          color: #fff;
        }
        .icon-name{
          color: #fff;
        }
      }
      li.active{
        color: #fff;
        background-color: #6adac5;
        border-color: #07c29e;
        i{
          color: #fff;
        }
        .icon-name{
          color: #fff;
        }
      }
    }
  }
  .inputItem{
    position: relative;
    padding-right: 12px;
    .authorizationBox{
      width: 100%;
      height: 285px;
      padding: 8px 12px;
      overflow: auto;
      border: solid 1px #e6e6e6;
    }
    span.smTip{
      position: absolute;
      top: 11px;
      left: 74px;
      font-size: 12px;
      color: #bcc0c4;
    }
    span.selectAll{
      position: absolute;
      top: 11px;
      right: 12px;
      font-size: 12px;
      text-decoration: underline;
      color: #07c29e;
      cursor: pointer;
    }
  }
  .addOrUpdate {
    .title {
      padding: 13px 20px 12px;
      background-color: #f8f8f8;
      border-bottom: solid 1px #e6e6e6;
      font-size: 14px;
      font-weight: bold;
      line-height: 14px;
      color: #45494d;
      i{
        font-size: 12px;
      }
      i:hover {
        color: #07c29e;
        cursor: pointer;
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
  }
  .margin21{
    margin-top: 21px;
  }
  .pageBox{
    .titleButton{
      padding: 12px 17px 0;
      border-bottom: 1px solid #e6e6e6;
      margin-bottom: 12px;
      line-height: 23px;
      color: #07c29e;
      span{
        padding: 0 8px 6px;
        border-bottom: 3px solid transparent;
        margin-right: 20px;
        color: #555a5e;
        cursor: pointer;
        i{
          font-size: 16px;
          margin-right: 8px;
        }
      }
      span.active{
        color: #07c29e;
        border-bottom-color: #07c29e;
      }
    }
    .contents{
      padding: 0 12px 12px;
      min-height: calc(100vh - 131px);
      .tableList{
        overflow: auto;
        i {
          font-size: 16px;
          margin-right: 28px;
          &:last-child{
            margin-right: 0;
          }
          &:hover {
            color: #07c29e;
          }
        }
      }
    }
    .moduleThree{
      .navTreeContent{
        position: relative;
        .treeLeft {
          width: 380px;
          height: calc(100vh - 246px);
          overflow: auto;
          border: solid 1px #e6e6e6;
          border-radius: 3px;
          .title{
            padding: 12px 18px;
            background-color: #f8f8f8;
            border-bottom: solid 1px #e6e6e6;
          }
          .content{
            padding: 10px;
          }
          .custom-tree-node{
            width: 100%;
            line-height: 28px;
          }
          &::-webkit-scrollbar {
            width: 4px;
          }
          &::-webkit-scrollbar-button {
          }
          &::-webkit-scrollbar-track {
            background-color: #f1f1f1;
          }
          &::-webkit-scrollbar-track-piece {
            background-color: #f1f1f1;
            -webkit-border-radius: 10px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: #ccc;
            border: solid 1px #f1f1f1;
            border-radius: 10px;
          }
          &::-webkit-scrollbar-corner {
            background-color: #f1f1f1;
          }
          &::-webkit-resizer {
            background-repeat: no-repeat;
            background-position: bottom right;
          }
          &::-webkit-scrollbar-thumb:hover {
            background-color: #323c48;
          }
        }
        .treeRight{
          position: absolute;
          left: 390px;
          top: 0;
          right: 0;
          bottom: 0;
          overflow: auto;
          border: solid 1px #e6e6e6;
          border-radius: 3px;
          .title{
            padding: 12px 18px;
            background-color: #f8f8f8;
            border-bottom: solid 1px #e6e6e6;
          }
          .content{
            padding: 10px 40px;
          }
          &::-webkit-scrollbar {
            width: 4px;
          }
          &::-webkit-scrollbar-button {
          }
          &::-webkit-scrollbar-track {
            background-color: #f1f1f1;
          }
          &::-webkit-scrollbar-track-piece {
            background-color: #f1f1f1;
            -webkit-border-radius: 10px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: #ccc;
            border: solid 1px #f1f1f1;
            border-radius: 10px;
          }
          &::-webkit-scrollbar-corner {
            background-color: #f1f1f1;
          }
          &::-webkit-resizer {
            background-repeat: no-repeat;
            background-position: bottom right;
          }
          &::-webkit-scrollbar-thumb:hover {
            background-color: #323c48;
          }
        }
      }
    }
  }
</style>
