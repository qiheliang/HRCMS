<template>
  <div class="zzl-main">
    <div class="zzl-main-top" :class="{'changeLeft': shrinkage}">
      <top-nav></top-nav>
    </div>
    <div class="zzl-main-left" :class="{'changeWidth': shrinkage}">
      <left-nav></left-nav>
    </div>
    <div class="zzl-main-right" :class="{'changeLeft': shrinkage}">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
import topNav from './top/topNav'
import leftNav from './left/leftNav'
// import {eChart} from '../../static/js/echarts'
export default {
  name: 'frame',
  components: {
    topNav,
    leftNav
  },
  mounted () {
    if (window.sessionStorage.getItem('status') !== '1') {
      this.$router.push({ name: 'login' }) 
    }
    window.onresize = () => {
      // if (window.innerWidth < 1350) {
      //   this.$store.commit('setShrinkage', true)
      // } else {
      //   this.$store.commit('setShrinkage', false)
      // }
      // for (let i in eChart.myChartArray) {
      //   eChart.myChartArray[i].resize()
      // }
    }
  },
  computed: {
    shrinkage () {
      return this.$store.state.shrinkage
    }
  }
}
</script>

<style lang="scss" scoped>
.changeLeft{
  left: 66px;
}
.changeWidth{
  width: 66px;
}
/*@media screen and (min-width: 0px) and (max-width: 1300px) {*/
  /*.main .main-right {*/
    /*left: 0;*/
  /*}*/
  /*.main .main-left {*/
    /*opacity: 0;*/
  /*}*/
  /*.main .changeZIndex{*/
    /*z-index: 100;*/
    /*opacity: .9 !important;*/
  /*}*/
/*}*/
</style>
