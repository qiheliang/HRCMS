<template>
  <div class="zzl-nav">
    <div class="zzl-nav-title">
      <p v-show="!shrinkage" class="zzl-nav-companyName">深巨元</p>
      <p v-show="!shrinkage" class="zzl-nav-system small"><i></i>人事管理系统<i></i></p>
      <img src="../../../static/img/logo.png" alt="" :class="{'sm' : shrinkage}">
    </div>
    <ul class="zzl-nav-list">
      <el-menu class="navigation-menu" :unique-opened="true" :default-active="routeName" @open="handleOpen" @close="handleClose" :collapse="shrinkage"
        background-color="#001529"
        text-color="#a5afb8"
        active-text-color="#07c29e">
        <el-menu-item index="index" key="index" @click="navClick({Id: 'index', Children: []})">
          <i class="zzl_icons zion-home" style="font-size:18px;color:#fff;"></i>
          <span slot="title" class="li-text">首页</span>
        </el-menu-item>
        <el-menu-item index="authorization" key="authorization" @click="navClick({Id: 'authorization', Children: []})">
          <i class="zzl_icons zion-setting" style="font-size:18px;color:#fff;"></i>
          <span slot="title" class="li-text">权限管理</span>
        </el-menu-item>
        <el-menu-item index="invitation" key="invitation" @click="navClick({Id: 'invitation', Children: []})">
          <i class="zzl_icons zion-setting" style="font-size:18px;color:#fff;"></i>
          <span slot="title" class="li-text">邀约管理</span>
        </el-menu-item>
        <!--<template v-for="item in navList">-->
          <!--<el-menu-item v-if="item.IsFolder" :index="item.Id" :key="item.Id" @click="navClick(item)">-->
            <!--<i :class="'zzl_icons ' + item.IconClass" style="font-size:18px;color:#fff;"></i>-->
            <!--<span slot="title" class="li-text-active">{{item.Title}}</span>-->
          <!--</el-menu-item>-->
          <!--<el-submenu v-else :index="item.Id" :key="item.Id" popper-class="popper-menu">-->
            <!--<template slot="title">-->
              <!--<i :class="'zzl_icons ' + item.IconClass" style="font-size:18px;color:#fff;"></i>-->
              <!--<span slot="title" class="li-text">{{item.Title}}</span>-->
            <!--</template>-->
            <!--<el-menu-item-group>-->
              <!--<el-menu-item v-for="it in item.Children" :index="it.Id" :key="it.Id" @click="navClick(it)">{{it.Title}}</el-menu-item>-->
            <!--</el-menu-item-group>-->
          <!--</el-submenu>-->
        <!--</template>-->
      </el-menu>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'leftNav',
  data () {
    return {
      routeName: 'index',
      navList: [],
    }
  },
  computed: {
    shrinkage () {
      return this.$store.state.shrinkage
    }
  },
  methods: {
    // 判断某个值是否存在于某个数组
    judgeExist (val, list) {
      for (let item of list) {
        if (item === val) {
          return true
        }
      }
      return false
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    navClick (_item) {
      // console.log(key)
      // console.log(this.routeName)
      // this.routeName = key
      // this.routeName = 'severanceManage'
      this.$router.push({ name: _item.Id })
      // setTimeout ( () => {
      //   console.log(this.$route.name)
      // }, 0)
      // this.$router.push({ name: _item })
      // this.routeName = _item
      // sessionStorage.setItem('navigation', JSON.stringify(_item))
      // this.saveDataInSess()
      this.routeName = _item.Id
      sessionStorage.setItem('navigation', JSON.stringify(_item.Children))
      this.saveDataInSess()
    },
    routeChange (to, from) {
      // this.routeName = to.name
      this.saveDataInSess()
    },
    saveDataInSess () {
      sessionStorage.setItem('routeName', this.routeName)
    },
    async getNavList () {
      const res = await this.zzlHttp.post(this.zzlApi.getNav)
      if (res.code === 0) {
        for (let item of res.data.main_navigation) {
          if (item.Id === "integrityManage") {
            this.navList = item.Children;
          }
        }
      }
    }
  },
  async mounted () {
    if (window.sessionStorage.getItem('status') !== '1') {
      return
    }
    const CURRENT_ROUTERS = ['batchAudit', 'headAudit', 'importData', 'personInfo'];
    if (CURRENT_ROUTERS.includes(sessionStorage.getItem('routeName'))) {
      this.routeName = sessionStorage.getItem('lastIndex')
    } else if (sessionStorage.getItem('routeName')) {
      this.routeName = sessionStorage.getItem('routeName')
    } else {
      this.routeName = 'prersonFlow'
    }
    // 获取导航
    await this.getNavList();
  },
  watch: {
    $route: 'routeChange',
    '$store.state.routerName' () {
      if (this.$store.state.routerName !== '') {
        this.routeName = this.$store.state.routerName
        this.$store.commit('setRouterName', '')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.zzl-nav{
  position: relative;
  .zzl-nav-title{
    padding-left: 66px;
    height: 68px;
    width: 210px;
    .small{
      color: #a5afb8;
    }
    p{
      color: #fff;
    }
    .zzl-nav-companyName{
      padding: 20px 0 10px;
      font-size: 20px;
      line-height: 22px;
      font-weight: bold;
      letter-spacing: 2px;
      // 修改
      text-align: center;
    }
    .zzl-nav-system{
      padding: 0;
      letter-spacing: 2px;
      margin-left: -3px;
      // 修改
      text-align: center;
      i{
        display: inline-block;
        width: 3px;
        height: 1px;
        background-color: #fff;
        vertical-align: 4px;
        margin: 0 5px;
        color: #a5afb8;
      }
    }
    img{
      position: absolute;
      top: 20px;
      left: 25px;
      z-index: 100;
      width: 41px;
    }
    img.sm{
      width: 41px;
    }
  }
  .zzl-nav-list {
    // 修改
    padding: 15px 10px 15px 10px;
    li {
      border-radius: 3px;
      margin: 10px 0px;
      cursor: pointer;
      color: #adb5bd;
      font-size: 14px;
    }
    .li-text{
      display: inline-block;
      margin-left: 10px;
      font-size: 14px;
      color: #FFFFFF;
    }
  }
  .redFork{
    text-align: right;
  }
}
</style>
