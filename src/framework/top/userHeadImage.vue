<template>
  <div class="top-nav-info clearfix">
    <span class="fr" @click="signOut"><i class="zzl_icons zion-out"></i></span>
    <div class="dropDownMenu fr">
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="zzl_icons zion-user"></i>
          <span class="userName">Hi, {{whoIsUser}}</span><i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><div @click="updatePassWord" class="dropDownItem"><i class="zzl_icons zion-edit"></i>&nbsp;修改密码</div></el-dropdown-item>
          <el-dropdown-item><div @click="signOut" class="dropDownItem"><i class="zzl_icons zion-out"></i>&nbsp;退出</div></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      append-to-body
      width="400px"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="updatePassWordModal"
      :show-close="false">
      <div class="model">
        <div class="title clearfix">
          <span class="fl zzl-title">修改密码</span><i class="zzl_icons zion-close fr" @click="closeTemplateDialog"></i>
        </div>
        <el-form label-width="80px"  label-position="left" :model="form" :rules="rules" ref="form" class="form-list">
          <el-form-item label="旧密码：" prop="oldPassWord">
            <el-input @blur="veridate(0)" v-model="form.oldPassWord"></el-input>
          </el-form-item>
          <el-form-item label="新密码：" prop="newPassWord1">
            <el-input @blur="veridate(1)" v-model="form.newPassWord1"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer clearfix">
         <button class="zzl-btn zzl-success fr" style="margin-right: 8px" @click="confirm">确定</button>
         <button class="zzl-btn fr" style="margin-right: 12px" @click="closeTemplateDialog">取消</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import hashes from '../../../static/js/hashes.min';
export default {
  name: 'userHeadImage',
  data () {
    return {
      showDown: true,
      whoIsUser: '管理员',
      logoUrl: '',
      dialogShow: false, // 弹出框控制
      form: {
        oldPassWord: '',
        newPassWord1: '',
        newPassWord2: '',
      }, // 表单数据
      rules: {
        oldPassWord: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        newPassWord1: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      formArr: ['oldPassWord', 'newPassWord1']
    }
  },
  computed: {},
  methods: {
    // 验证
    veridate (_num) {
      let reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
      if (this.form[this.formArr[_num]] === '') {
        return
      }
      if (!reg.test(this.form[this.formArr[_num]])) {
        this.form[this.formArr[_num]] = this.form[this.formArr[_num]].replace(/[^\d.]/g,'')
        this.$message.warning('必须同时包含数字和字母，不包含其它字符')
      }
    },
    // 关闭弹框
    closeTemplateDialog () {
      this.dialogShow = false
      this.form = {
        oldPassWord: '',
        newPassWord1: '',
        newPassWord2: '',
      }
    },
    signOut () {
      sessionStorage.clear()
      this.$router.push({ name: 'login' })
    },
    // 修改密码
    updatePassWord () {
      this.dialogShow = true
    },
    // 确认提交
    confirm () {
      this.$refs['addForm'].validate(async (valid) =>{
        if (valid) {
          this.form.oldPassWord = new hashes.MD5().hex(
            this.form.oldPassWord + '_zzlfe25ec32c2d65'
          );
          this.form.newPassWord1 = new hashes.MD5().hex(
            this.from.newPassWord1 + '_zzlfe25ec32c2d65'
          );
          const res = await this.zzlHttp.post(this.zzlApi.veridate, this.form);
          if (res.code === 0) {
            this.$message.success('修改成功')
            this.dialogShow = false
          }
        }
      });
    }
  },
  async mounted () {
    if (window.sessionStorage.getItem('status') === '1') {
      this.whoIsUser = window.sessionStorage.getItem('whoIsUser')
    }
  }
}
</script>

<style scoped lang="scss">
.dropDownItem {
  padding: 0 20px;
  min-width: 120px;
  font-size: 14px;
}
.el-dropdown-menu__item {
  padding: 0 0;
}
.top-nav-info {
  float: right;
  padding-right: 30px;
  span{
    i.zion-out{
      margin: 15px 0 0 15px;
      padding: 0 0 0 23px;
      font-size: 17px;
      font-weight: normal;
      display: inline-block;
      border-left: 1px solid #e3e8ec;
      cursor: pointer;
    }
    i:hover{
      color: #000;
    }
  }
  .dropDownMenu {
    line-height: 50px;
    color: #868e96;
    cursor: pointer;
    i.zion-out {
      margin-right: 16px;
    }
    span.userName {
      font-size: 14px;
      font-weight: normal;
      color: #868e96;
    }
    i.el-icon--right {
      color: #868e96;
    }
  }
}
.model{
  .title{
    padding: 12px 20px 12px;
    border-radius: 3px 3px 0 0;
    font-weight: bold;
    background-color: #f8f8f8;
    border-bottom: 1px solid #e6e6e6;
    i{
      cursor: pointer;
      font-size: 12px;
      font-weight: lighter;
      &:hover{
        color: #07c29e;
      }
    }
  }
  .form-list{
    padding: 20px;
  }
}
@media screen and (min-width: 0px) and (max-width: 1024px) {
  .topInfo .top-left-logo i {
    display: none;
  }
  .topInfo .top-left-logo i.smScreen {
    display: inline-block;
    cursor: pointer;
  }
  .topInfo .top-left-logo p:nth-of-type(1) {
    border: 0;
  }
}
@media screen and (min-width: 0px) and (max-width: 430px) {
  .topInfo .top-nav-info .dropDownMenu span.el-dropdown-link {
    display: none;
  }
  .topInfo .top-nav-info {
    padding-right: 10px;
  }
}
</style>
