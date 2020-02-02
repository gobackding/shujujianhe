import http from "@utils/http";
import axios from "@utils/axios";
import Cookies from "js-cookie";
export const booksListApi = () => http.get(`${window.apiUrl}/review/rules/SearchRules`)
// 分页器获取数据
export const pagingListApi = (pages) => http.get(`${window.apiUrl}/review/rules/SearchRules`, {
    'page': pages.pageNumber,
    'dataFieldCode': pages.dataFieldCode,
    'ruleDesc': pages.ruleDesc,
    'ruleImp': pages.ruleImp,
    'ruleSeq': pages.ruleSeq,
    'srcTabNameCn': pages.srcTabNameCn,
    'srcTabNameEn': pages.srcTabNameEn
})
// 删除
export const DeteteValueApi = (index) => http.get(`${window.apiUrl}/review/rules/DeleteRules`, {
    'ids': index
})
// 根据条件查询-数据检核
export const conditionApi = (val) => http.get(`${window.apiUrl}/review/rules/SearchRules`, {
    'ruleSeq': val.ruleSeq,
    'ruleDesc': val.ruleDesc,
    'srcTabNameCn': val.srcTabNameCn,
    'srcTabNameEn': val.srcTabNameEn,
    'dataFieldCode': val.dataFieldCode,
    'ruleImp': val.ruleImp
})
// 修改
export const UpdaterulesApi = ({ ...val }) => http.post(`${window.apiUrl}/review/rules/UpdateRules`, {
    'id': val.id,
    'ruleSeq': val.ruleSeq,
    'ruleDesc': val.ruleDesc,
    'srcTabNameCn': val.srcTabNameCn,
    'srcTabNameEn': val.srcTabNameEn,
    'dataFieldCode': val.dataFieldCode,
    'ruleImp': val.ruleImp,
    'standardType': val.standardType,
    'ruleType': val.ruleType
})
// 新增规则一条
export const NewAddedApi = (val) => http.post(`${window.apiUrl}/review/rules/AddRules`, {
    'ruleSeq': val.ruleSeq,
    'ruleType': val.ruleType,
    'ruleImp': val.ruleImp,
    'srcTabNameCn': val.srcTabNameCn,
    'srcTabNameEn': val.srcTabNameEn,
    'gzVersion': val.gzVersion,
    'diySql': val.diySql,
    'ruleDesc': val.ruleDesc
})

// 检核时列表展示页面
export const JHKSLBZS = (val) => http.post(`${window.apiUrl}/review/rules/queryRules`, {
    'diySql': val.diySql,
    'level': val.level,
    'ruleDesc': val.ruleDesc,
    'ruleSeq': val.ruleSeq,
    'ruleType': val.ruleType,
    'srcTabNameCn': val.srcTabNameCn,
    'srcTabNameEn': val.srcTabNameEn,
    'standardType': val.standardType
})

// 检核时列表展示页面
export const JHCHLIST = (val) => http.post(`${window.apiUrl}/review/rules/queryRules`, {
    'ruleDesc': val.ruleDesc,
    'ruleSeq': val.ruleSeq,
    'ruleType': val.ruleType,
    'srcTabNameCn': val.srcTabNameCn,
    'srcTabNameEn': val.srcTabNameEn,
    'standardType': val.stantTypeValue
})

// 检核传输数组 ID
export const JHCSID = (val) => http.post(`${window.apiUrl}/review/rules/queryRules`, {
    'ids': val
})

// 网后端传id 检核
export const JHIDSH = (val) => http.post(`${window.apiUrl}/review/checkin`, {
    'ids': val.ids,
    'beginDate': val.beginDate,
    'endDate': val.endDate
})
export const ceshidata = (val) => http.get(`${window.apiUrl}/review/checkin`, {
    'ids': val.ids,
    'beginDate': val.beginDate,
    'endDate': val.endDate
})

// 检核状态点击查看状态跳转页面
export const JHTZCK = (val) => http.get(`${window.apiUrl}/review/dataCheckList`, {
    'cjrq': val.Time,//当前时间
    // dDqGzs: val.List,//需要传输的数组
    // lc: 1
})

// 下载excel表格
export const ExcelDownload = (val) => http.get(`${window.apiUrl}/review/export`, {
    'cjiq': val
})




// 文件管理初始数据
export const FILEMANAGEM = (val) => http.get(`${window.apiUrl}/review/wj/queryList`,{
    'jgztfl':val.classification,
    'bmEn':val.TableName
})


// 文件管理  -》 文件检查
export const FILEWJJC = (val) => http.post(`${window.apiUrl}/review/wj/scan`, {
    'pathName': val
})

// 反查 
export const CHECKVALUEPAI = (val) => http.get(`${window.apiUrl}/review/fc/tfone`, {
    'ruleSeq':val.ruleSeq,
    'cjrq':val.calendarTime,
    'jclc':val.DafaultValueSelect
})

// 检查默认的路径是否存在
export const DAFAULTROUTE = ()=>http.get(`${window.apiUrl}/review/defalut/isQueryFilePath`)
