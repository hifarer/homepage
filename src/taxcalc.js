
// 个税起征点
// const taxThreshold = 3500
const taxThreshold = 5000 + 1500    // 1500为租房专项扣除
// 级距
// const taxStep = [1500, 3000, 4500, 26000, 20000, 25000]
const taxStep = [3000, 9000, 13000, 10000, 20000, 25000]
// 级距对应的税率
const taxRate = [0.03, 0.1, 0.2, 0.25, 0.3, 0.35, 0.45]

/**
 * 个税计算器
 * 杭州2018年7月1日起社保封顶基数15274.74 养老8% 医疗2% 失业0.5%
 * 杭州2018年7月1日起公积金封顶基数24311 比例12%
 * http://www.hzgjj.gov.cn/art/2018/7/6/art_22_5344.html
 * @param {Number} income 应发工资
 * @param {Number} iRate 养老医疗失业险（工伤生育险个人不用出）缴存比例，一般为10.5%
 * @param {Number} fRate 公积金（实际为三险一金，工伤生育险个人不用出）缴存比例，一般为12%
 */
function taxCalc (income, iRate, fRate) {
  // 五险一金合计
  let insuranceFund = Math.min(15274.74, income) * iRate + Math.min(24311, income) * fRate
  // 应缴个税部分的工资金额
  let taxNum = income - insuranceFund - taxThreshold
  let temp = 0

  // 个税
  let taxResult = taxStep.reduce((prevValue, currentValue, index) => {
    if (taxNum - currentValue >= 0) {
      temp = prevValue + currentValue * taxRate[index]
    } else {
      temp = prevValue + Math.max(taxNum * taxRate[index], 0)
    }
    taxNum -= currentValue
    return temp
  }, 0)

  // 超过8w的部分
  if (taxNum > 0) {
    taxResult += taxNum * taxRate[taxRate.length - 1]
  }

  return {
    tax: Math.round(taxResult * 100) / 100,
    income: Math.round((income - insuranceFund - taxResult) * 100) / 100
  }
}

let result = taxCalc(19000, 0.105, 0.12)

if (result.tax === 0) {
  console.log('不需要缴纳个税，实发工资：' + result.income)
} else {
  console.log('需要缴纳个税：' + result.tax + '元，实发工资：' + result.income)
}
