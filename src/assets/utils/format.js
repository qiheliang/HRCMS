import Vue from 'vue'
const _that = new Vue();
export default {
  // 判断是否是空数组
  isEmptyArray(arr) {
    if (arr !== undefined) {
      if (!arr.length) {
        return false;
      } else {
        return true;
      }
    }
  },
  // 校验身份证
  IdentityCodeValid (value) {
    let city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    let tip = "";
    let pass= true;

    if(!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)){
      tip = "身份证号格式错误";
      pass = false;
    }

    else if(!city[value.substr(0,2)]){
      tip = "地址编码错误";
      pass = false;
    }
    else{
      //18位身份证需要验证最后一位校验位
      if(value.length == 18){
        value = value.split('');
        //加权因子
        let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
        //校验位
        let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
        let sum = 0;
        let ai = 0;
        let wi = 0;
        for (let i = 0; i < 17; i++)
        {
          ai = value[i];
          wi = factor[i];
          sum += ai * wi;
        }
        let last = parity[sum % 11];
        if(parity[sum % 11] != value[17]){
          tip = "校验位错误";
          pass =false;
        }
      }
    }
    return pass;
  },
  formatJson (filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  },
  // 根据ID获取对应名称
  getNameById (_id, _list) {
    for (let _item of _list) {
      if (_id == _item.id) {
        return _item.name
      }
    }
    return _id
  },
  // 根据value获取对应名称
  getLabelByValue (_val, _list) {
    for (let _item of _list) {
      if (_val == _item.value) {
        return _item.label
      }
    }
    return isNaN(_val) ? '无' : _val
  },
  // 日期时间截取
  getTimeDate (_val) {
    if (!_val) {
      return _val
    }
    if (_val.split(' ')[0]) {
      return _val.split(' ')[0]
    }
    return _val
  },
  // 其它时间截取
  getTimeOther (_val) {
    if (!_val) {
      return _val
    }
    if (_val.split('T')[0]) {
      return _val.split('T')[0]
    }
    return _val
  },
  // 格式化金额
  moneyFormat (value) {
    if (value !== '' && !isNaN(value)) {
      if (value >= 0) {
        let num = null;
        if (
          value == null ||
          value === 0 ||
          value === undefined ||
          value === '&#160;'
        ) {
          num = '0.00'
        } else {
          let result = value.toString().indexOf('.')
          if (result !== -1) {
            if (value.toString().substring(result, value.length).length >= 3) {
              if (typeof value === 'string') {
                num = parseInt(value).toFixed(2)
              }
              num = value.toFixed(2)
            } else {
              num = value + '0'
            }
          } else {
            num = value + '.00'
          }
        }
        return num
      } else {
        return '0.00'
      }
    } else {
      return '0.00'
    }
  },
  // 检查图片文件
  checkImg(file) {
    let isFileFormat =
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ;
    const isLt100K = file.size < 102400;
    if (!isFileFormat) {
      _that.$message.error('可上传文件包括jpg、jpeg、png');
    }
    if (!isLt100K) {
      _that.$message.error('上传文件大小不能超过 100K!');
    }
    return isFileFormat && isLt100K;
  },
  // 检查图片文件
  checkImgs(file) {
    let isFileFormat =
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'application/pdf' ;
    const isLt100M = file.size < 104857600;
    if (!isFileFormat) {
      _that.$message.error('可上传文件包括jpg、jpeg、png、pdf');
    }
    if (!isLt100M) {
      _that.$message.error('上传文件大小不能超过 100M!');
    }
    return isFileFormat && isLt100M;
  },
  // 检查文件
  checkFile (file) {
    let str = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
    let isFileFormat =
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'video/mp4' ||
      file.type === 'audio/mp3' ||
      file.type === 'application/pdf' ||
      str === '.rar' ||
      str === '.7z' ||
      str === '.zip' ||
      str === '.wma' ||
      str === '.m4a' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    const isLt100M = file.size < 1048576000
    if (!isFileFormat) {
      _that.$message.error(
        '可上传文件包括jpg、jpeg、png、mp4、mp3、excel、rar、7z、zip、doc、docx'
      )
    }
    if (!isLt100M) {
      _that.$message.error('上传文件大小不能超过 100MB!')
    }
    return isFileFormat && isLt100M
  }
}
