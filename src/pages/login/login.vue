<template>
  <div class="login-wrapper">
		<div class="login-content">
			<!-- login header 登录头部 start -->
			<div class="content-header">
				<img class="header-img" src="../../../static/img/logo.jpg" alt="请稍等......">
				<h2 class="header-title">深巨元人事管理系统</h2>
			</div>
			<!-- login header 登录头部 end -->
			<!-- login main 登录主体 start -->
			<div class="content-main">
				<form>
					<!-- username 用户名 start -->
					<el-input id="username" :class="errorNum === 1 ? 'errorInput' : ''" :placeholder="zzlLang.enterOneUserName" v-model="from.username" clearable
						@keyup.enter="submit()" @blur="checkUser"
					></el-input>
					<span class="tip" v-show="errorTextUN !== ''">{{errorTextUN}}</span>
					<!-- username 用户名 end -->
					<!-- password 密码 start -->
					<el-input id="password" class="pw-mar" :class="errorNum === 2 ? 'errorInput' : ''" type="password" :placeholder="zzlLang.enterPassword" v-model="outPassword" clearable
						@keyup.enter="submit()" @blur="checkPassword"
					></el-input>
					<span class="tip" v-show="errorTextPW !== ''">{{errorTextPW}}</span>
					<!-- password 密码 end -->
					<!-- verifycode 验证码 start -->
					<el-input id="verifycode" class="code" :class="errorNum === 3 ? 'errorInput' : ''" :placeholder="zzlLang.enterVerificationCode" v-model="from.verifycode" clearable
						@keyup.enter="submit()" @blur="checkVerifycode"
					></el-input>
					<img class="verifycode" :src="verifyPicSrc" alt="请稍等......">
					<span class="tip" v-show="errorTextVC !== ''">{{errorTextVC}}</span>
					<!-- verifycode 验证码 end -->
					<el-button type="primary" @click="submit">{{zzlLang.login}}</el-button>
				</form>
			</div>
			<!-- login main 登录主体 end -->
		</div>
	</div>
</template>

<script>
import hashes from '../../../static/js/hashes.min'
export default {
	name: 'login',
	data () {
		return {
			/**
			 * 密码输入框
			 */
			outPassword: '',
			/**
			 * 后台生成的验证码
			 */
			verifyPicSrc: '',
			/**
			 * 表单各参数
			 */
			from: {
				// 用户名
				username: '',
				// 密码
				password: '',
				// 验证码
				verifycode: ''
			},
			/**
			 * 检验输入框参数
			 */
			checkFrom: {
				checkUN: false,
				checkPW: false,
				checkVC: false
			},
			/**
			 * 提交错误提示
			 */
			errorTextUN: '',
			errorTextPW: '',
			errorTextVC: '',
			/**
			 * 输入框是否正确输入判断值
			 */
			errorNum: 0,
			/**
			 * 密码加密
			 */
			keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
		}
	},
	methods: {
		/**
		 * 检验用户名是否填写正确
		 */
		async checkUser () {
			if (this.from.username.trim() === '') {
				this.checkFrom.checkUN = false
				this.errorNum = 1
				this.errorTextUN = this.zzlLang.userNameNotEmpty
			} else {
				let errorNum = this.errorNum
				this.errorNum = this.from.username.trim() !== '' ? errorNum : 10
				this.checkFrom.checkUN = true
				this.errorTextUN = ''
			}
		},
		/**
		 * 检验密码是否填写正确
		 */
		checkPassword () {
			if (this.outPassword.trim() === '') {
				this.checkFrom.checkPW = false
				this.errorNum = 2
				this.errorTextPW = this.zzlLang.passwordNotEmpty
			} else {
				let errorNum = this.errorNum
				this.errorNum = this.outPassword.trim() !== '' ? errorNum : 10
				this.checkFrom.checkPW = true
				this.errorTextPW = ''
			}
		},
		/**
		 * 检验验证码是否填写正确
		 */
		checkVerifycode () {
			if (this.from.verifycode.trim() === '') {
				this.checkFrom.checkVC = false
				this.errorNum = 3
				this.errorTextVC = this.zzlLang.verificationCodeNotEmpty
			} else {
				let errorNum = this.errorNum
				this.errorNum = this.from.verifycode.trim() !== '' ? errorNum : 10
				this.checkFrom.checkVC = true
				this.errorTextVC = ''
			}
		},
		/**
		 * 生成验证码
		 */
		verifyPic () {
			this.verifyPicSrc = this.zzlApi.domain + 'manageapi/accountapi/VerifyCodeImg?height=35&width=100&fontsize=20&rnd=' + Math.random()
			// http://192.168.101.221:8914/manageapi/accountapi/VerifyCodeImg?height=35&width=100&fontsize=20&rnd
		},
		/**
		 * 提交登录点击事件
		 */
		async submit () {
			await this.checkUser()
			await this.checkPassword()
			await this.checkVerifycode()
			let vm = this
			if (this.checkFrom.checkUN && this.checkFrom.checkPW) {
				this.encode(vm.outPassword)
				let params = vm.from
				const response = await this.zzlHttp.post(this.zzlApi.login, params)
				if (response.status === 'Success' && response.code === 0) {
					this.$router.push({name: 'frame'})
					this.$message.success(this.zzlLang.user + this.from.username + this.zzlLang.loginSuccess)
					window.sessionStorage.setItem('whoIsUser', this.from.username)
					window.sessionStorage.setItem('status', '1')
					window.sessionStorage.setItem('instid', response.data.instid)
					window.sessionStorage.setItem('role', JSON.stringify(response.data.role))
					if (this.zzlFormat.isEmptyArray(response.data.role)) {
						let role = response.data.role[0]
						window.sessionStorage.setItem('roleName', role === 'SX' ? '寿险' : role === 'CX' ? '产检' : role === 'ZJ' ? '中介' : '销售')
					} else {
						window.sessionStorage.setItem('roleName', '')
					}
				} else if (response.code === 500) {
					alert(this.zzlLang.accountLock)
					this.verifyPic()
					vm.from.verifycode = ''
				} else if (response.code === 501) {
					this.errorNum = 3
					this.errorTextVC = this.zzlLang.verificationCodeError
					this.verifyPic()
					document.getElementById('verifycode').focus()
					vm.from.verifycode = ''
				} else if (response.code === 502) {
					this.errorTextVC = this.zzlLang.userNameOrPasswordError
					this.verifyPic();
					vm.from.verifycode = ''
				}
			}
		},
		/**
		 * 密码加密
		 */
		encode (input) {
			let vm = this;
			var output = ''
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4
			var i = 0
			input = this._utf8_encode(input)
			while (i < input.length) {
				chr1 = input.charCodeAt(i++)
				chr2 = input.charCodeAt(i++)
				chr3 = input.charCodeAt(i++)
				enc1 = chr1 >> 2
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
				enc4 = chr3 & 63
				if (isNaN(chr2)) {
					enc3 = enc4 = 64
				} else if (isNaN(chr3)) {
					enc4 = 64
				}
				output = output + this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) + this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4)
			}
			this.from.password =  output;
		},
		decode (input) {
			var output = ''
			var chr1, chr2, chr3
			var enc1, enc2, enc3, enc4
			var i = 0
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
			while (i < input.length) {
				enc1 =this.keyStr.indexOf(input.charAt(i++))
				enc2 = this.keyStr.indexOf(input.charAt(i++))
				enc3 = this.keyStr.indexOf(input.charAt(i++))
				enc4 = this.keyStr.indexOf(input.charAt(i++))
				chr1 = (enc1 << 2) | (enc2 >> 4)
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
				chr3 = ((enc3 & 3) << 6) | enc4
				output = output + String.fromCharCode(chr1)
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2)
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3)
				}
			}
			output = this._utf8_decode(output)
			return output
		},
		_utf8_encode (string) {
			string = string.replace('/\r\n\g', '\n') // 有错
			var utftext = ''
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n)
				if (c < 128) {
					utftext += String.fromCharCode(c)
				} else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192)
					utftext += String.fromCharCode((c & 63) | 128)
				} else {
					utftext += String.fromCharCode((c >> 12) | 224)
					utftext += String.fromCharCode(((c >> 6) & 63) | 128)
					utftext += String.fromCharCode((c & 63) | 128)
				}
			}
			return utftext
		},
		_utf8_decode (utftext) {
			var string = ''
			var i = 0
			var c = 0
			var c1 = 0
			var c2 = 0
			var c3 = 0
			while (i <utftext.length) {
				c =utftext.charCodeAt(i)
				if (c < 128) {
					string += String.fromCharCode(c)
					i++
				} else if ((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i + 1)
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
					i += 2
				} else {
					c2 = utftext.charCodeAt(i + 1)
					c3 = utftext.charCodeAt(i + 2)
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
					i += 3
				}
			}
			return string
		},
		/**
		 * 兼容浏览器
		 */
		myBrowser () {
			let userAgent = navigator.userAgent
			let isOpera = userAgent.indexOf('Opera') > -1
			let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MISE') > -1 && !isOpera
			let isFF = userAgent.indexOf('Firefox') > -1
			let isSafari = userAgent.indexOf('Safari') > -1
			if (isIE) {
				let IE5 = false
				let IE55 = false
				let IE6 = false
				let IE7 = false
				let IE8 = false
				let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
				reIE.test(userAgent)
				let fIEVerision = parseFloat(RegExp['$1'])
				IE55 = fIEVerision === 5
				IE55 = fIEVerision === 5.5
				IE6 = fIEVerision === 6.0
				IE7 = fIEVerision === 7.0
				IE8 = fIEVerision === 8.0
				if (IE5) {
					return 'IE5'
				}
				if (IE55) {
					return 'IE55'
				}
				if (IE6) {
					return 'IE6'
				}
				if (IE7) {
					return 'IE7'
				}
				if (IE8) {
					return 'IE8'
				}
			}
			if (isFF) {
				return 'FF'
			}
			if (isOpera) {
				return 'Opera'
			}
			if (isSafari) {
				return 'Safari'
			}
		},
	},
	async mounted () {
		// 在显示页面时生成并显示验证码
		this.verifyPic()
		// 若浏览器版本过低，则提醒浏览器
		if (this.myBrowser() === 'IE55' || this.myBrowser() === 'IE6' || this.myBrowser() === 'IE7' || this.myBrowser() === 'IE8') {
			alert(this.zzlLang.lowBrowsers)
		}
	}
}
</script>

<style lang="scss" scoped>
@import "./login.scss";
</style>
