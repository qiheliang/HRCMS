<template>
	<div class="invitation-wrapper">
		<!-- search 搜索框 start -->
		<el-input size="medium" placeholder="请输入内容" suffix-icon="el-icon-search" v-model="search"></el-input>
		<el-button type="primary" @click="onSubmit">查询</el-button>
		<!-- search 搜索框 end -->
		<!-- table 表格信息 start -->
		<div class="table">
			<el-table :data="infomationData" style="width: 100%">
				<el-table-column prop="office" label="分公司"></el-table-column>
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="sex" label="性别"></el-table-column>
				<el-table-column prop="age" label="年龄"></el-table-column>
				<el-table-column prop="record" label="学历"></el-table-column>
				<el-table-column prop="phone" label="联系电话"></el-table-column>
				<el-table-column prop="resume" label="简历来源"></el-table-column>
				<el-table-column prop="source" label="来源方式"></el-table-column>
				<el-table-column prop="interviewerDate" label="预约面试日期/时间"></el-table-column>
				<el-table-column prop="interviewer" label="面试官"></el-table-column>
				<el-table-column prop="result" label="面试结果"></el-table-column>
				<el-table-column prop="inductionDate" label="通知入职日期"></el-table-column>
				<el-table-column prop="explanation" label="未入职情况跟进说明"></el-table-column>
				<el-table-column prop="reference" label="推荐人"></el-table-column>
			</el-table>
		</div>
		<!-- table 表格信息 end -->
	</div>
</template>

<script>
export default {
 name: 'invitation',
 data () {
	return {
		/**
		 * 搜索输入框输入值
		 */
		search: '',
		/**
		 * 邀约信息表格数据
		 */
		infomationData: [
			{
				office: '深圳总部',
				name: '罗枳珊',
				sex: '女',
				age: '23',
				record: '本科',
				phone: '12345678912',
				resume: '内部推荐',
				source: '内部推荐',
				interviewerDate: '2020年7月23日',
				interviewer: '业务主管',
				result: '合格',
				inductionDate: '2020年7月27日',
				explanation: '无',
				reference: '李穆雯'
			}
		]
	}
 }
}
</script>

<style lang="scss" scoped>
@import "./invitation.scss";
</style>
