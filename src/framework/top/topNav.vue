<template>
  <div class="topNavBox clearfix">
    <div class="fl shrinkage" @click="changeShrinkageEnter">
      <i class="zzl_icons zion-menu"></i>
    </div>
    <div class="fr">
      <user-head-image></user-head-image>
    </div>
    <!--<div class="fr">-->
      <!--<el-tooltip effect="light" content="使用手册下载" placement="top">-->
        <!--<a href="../../../static/template/使用手册.txt" download=""><i class="zzl_icons zion-choice"></i></a>-->
      <!--</el-tooltip>-->
    <!--</div>-->
  </div>
</template>

<script>
import userHeadImage from './userHeadImage'
export default {
  name: 'topNav',
  components: { userHeadImage },
  methods: {
    changeShrinkageEnter () {
      this.$store.commit('setShrinkage', !this.$store.state.shrinkage)
    }
  }
}
</script>

<style scoped lang="scss">
.topNavBox {
  border-bottom: 1px solid #e6e6e6;
  .shrinkage{
    padding: 15px 0 0 20px;
    cursor: pointer;
    border-right: 1px solid hsla(0,0%,100%,.15);
    border-radius: 4px;
    transition: all .2s ease-in-out;
    i{
      display: inline-block;
      font-size: 18px;
      color: #868e96;
      transition: all .5s;
    }
    i:hover{
      transform: rotate(360deg);
    }
  }
  a{
    padding: 15px 20px 0 0;
    display: block;
  }
}
</style>
