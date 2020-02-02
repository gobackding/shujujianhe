import React, { Fragment } from "react";
import { Table, Button, Modal, Input, Select, Pagination, message } from "antd"
import { CHECKVALUEPAI } from "@api"
import { LSFXLIST, HQLCLIST, TIMEJHSJ, SUPERVISORVUE, DEFAULTDATA, ALLSINGLE } from "@api/Supervise"
import Calendar from "./calendar"
import Axios from "axios";
import BackFirst from '@pages/BackFirst'
const { Option } = Select;
const columns = [
    {
        title: '规则号',
        dataIndex: 'ruleSeq',
        align: 'center',
        width: '100px',
        ellipsis: true,
    },
    {
        title: '规则描述',
        dataIndex: 'ruleDesc',
        align: 'center',
        ellipsis: true,
    },
    {
        title: '中文表名',
        dataIndex: 'srcTabNameCn',
        align: 'center',
        ellipsis: true,
    },
    {
        title: '英文表名',
        dataIndex: 'srcTabNameEn',
        align: 'center',
        ellipsis: true,
    },
    {
        title: '失范总数',
        dataIndex: 'sfsjzl',
        align: 'center',
        width: '100px',
        defaultSortOrder: 'descend',
        ellipsis: true,
        sorter: (a, b) => a.sfsjzl - b.sfsjzl,
    },
    {
        title: '失范比例',
        dataIndex: 'sfsjbl',
        align: 'center',
        width: '100px',
        filterMultiple: false,
        ellipsis: true,
        sorter: (a, b) => {
            return parseInt(a.sfsjbl) - parseInt(b.sfsjbl)
        },
    },
    {
        title: '采集日期',
        dataIndex: 'cjrq',
        align: 'center',
        width: '100px',
        ellipsis: true,
    }
];
const Popupcolumns = [
    {
        title: '规则号',
        dataIndex: 'ruleSeq',
        align: 'center',
        ellipsis: true,
        align: 'center'
    },
    {
        title: '失范数据',
        dataIndex: 'sfsj',
        align: 'center',
        ellipsis: true,
        align: 'center'
    },
    {
        title: '采集时间',
        dataIndex: 'cjrq',
        align: 'center',
        ellipsis: true,
        align: 'center'
    },
    {
        title: '检核轮次',
        dataIndex: 'jclc',
        align: 'center',
        width: '100px',
        ellipsis: true,
        align: 'center'

    }
];

class JHLSFX extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [],
            visible: false,
            ReverseChecking: false,
            EditListValue: [],
            Rotation: "",
            SelectValue: '',
            calendarTime: "请选择时间",
            currPage: 1,
            totalCount: 10,
            SelectList: [],//轮次
            LC: 1,
            InputValueH: 10,
            DCTCBool: false,//样本导出
            // 下面的事弹窗 --反查
            columns: [],
            selectedRowKeys: [],
            ReversePage: 10,//分页器的总数
            ReversePageID: 1,
            TableAllData: [],//table反查全部的数据
            TableDisplayData: [],//table展示的数据
            Detailime: '',
            AllButton: 0,
            CurrentButton: 0,
            countAllData: 0,
            DafaultValueSelect: '请选择轮次',
            PopupData: [],//弹窗的data
            srcTabNameEn: '',
            ruleDesc: '',
            PopupDataLength: 0,
            pageBool: false,
            pagetitle: ''
        }

    }
    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <Fragment>
                <div style={{ height: '40px', backgroundColor: '#fff', lineHeight: '40px', paddingLeft: 10, fontSize: '14px', color: '#333' }}>
                    当前位置：首页-检核历史详情
                </div>
                {
                    this.state.pageBool ? <div style={{ padding: '10px' }} className="supervisorTableFY">
                        <div style={{ display: 'flex', justifyContent: "space-between" }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button type="primary"
                                    onClick={this.DQClickhandler.bind(this)}
                                    style={{ margin: '0 6px 0 0 ' }}>当期</Button>
                                <Button type="primary"
                                    onClick={this.QBClickhandler.bind(this)}
                                    style={{ margin: '6px' }}>全部</Button>
                                <div
                                    onClick={this.RLClickhandler.bind(this)}
                                    style={{
                                        width: '100px',
                                        height: '32px',
                                        border: 'solid 1px #d9d9d9',
                                        borderRadius: '4px',
                                        backgroundColor: '#fff',
                                        display: 'inline-block',
                                        margin: '6px',
                                        color: '#666',
                                        lineHeight: '32px',
                                        paddingLeft: '5px',
                                        cursor: 'pointer'
                                    }} >
                                    {this.state.calendarTime}
                                </div>
                                <Select value={this.state.DafaultValueSelect} style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                                    {
                                        this.state.SelectList.map((item, index) => {
                                            return <Option value={item} key={index}>{item}</Option>
                                        })
                                    }
                                </Select>
                                <Button type="primary" style={{ margin: '6px' }} onClick={this.QueryData.bind(this)}>查询</Button>
                            </div>
                            <div>
                                <span>总数量：{this.state.countAllData}</span>&nbsp;&nbsp;
                            <span>样本数量（行）</span>
                                <Input type="text" style={{ width: '120px' }} placeholder={this.state.data.length}
                                    onChange={this.ChangeInputValue.bind(this)}
                                />
                                <Button type="primary" onClick={this.DCExcel.bind(this)} style={{ margin: '6px' }}>导出样本</Button>
                                <Button type="primary"
                                    onClick={this.SCSBClickhandler.bind(this)}
                                    style={{ margin: '6px' }}>上报</Button>
                            </div>
                        </div>
                        <div style={{ marginTop: '10px' }} className="PagePagining">
                            <Pagination showQuickJumper className="PagePagion"
                                defaultCurrent={this.state.currPage} total={this.state.totalCount}
                                onChange={this.SupervisorFY.bind(this)} />
                        </div>
                        <Table columns={columns}
                            dataSource={this.state.data}
                            onChange={this.onChange.bind(this)}
                            onRow={record => {
                                let Value = record
                                return {
                                    onDoubleClick: event => {
                                        this.thatsOk(Value)
                                    }
                                }
                            }}
                            style={{ backgroundColor: '#fff' }} />

                        <div style={{ marginTop: '10px' }} className="PagePaging">
                            <Pagination showQuickJumper
                                defaultCurrent={this.state.currPage} total={this.state.totalCount}
                                onChange={this.SupervisorFY.bind(this)} />
                        </div>
                        <Modal
                            title="日历"
                            visible={this.state.visible}
                            onOk={this.handleOk.bind(this)}
                            onCancel={this.handleCancel.bind(this)}
                            className="Supervise"
                        >
                            <Calendar calendarTime={this.CanlerTime.bind(this)}></Calendar>
                        </Modal>
                        <Modal
                            title="数据反查"
                            visible={this.state.ReverseChecking}
                            onOk={this.handleOk.bind(this)}
                            onCancel={this.handleCancel.bind(this)}
                            className="ReverseChecking"
                        >
                            <div className="SuperviseTable">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span>表名：{this.state.srcTabNameEn}</span>
                                    <span>规则描述：{this.state.ruleDesc}</span>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>导出数量(行)</span>
                                        <Input type="text" style={{ marginRight: '10px' }} onChange={this.PopupDataLength.bind(this)} value={this.state.PopupDataLength} />
                                        <Button type="primary" onClick={this.ExportExcel.bind(this)}>导出</Button>
                                    </div>
                                </div>

                                <div style={{ maxHeight: '280px', overflow: 'auto' }} className="TableBlock">
                                    <Table columns={Popupcolumns} dataSource={this.state.PopupData} />
                            </div>

                                <div>
                                    <Button type="primary" style={{ marginTop: '10px' }}
                                        onClick={() => this.CloseClick(this.state.tddata, '表单')}>关闭</Button>
                                </div>

                            </div>

                        </Modal>
                        <Modal
                            title="样本导出"
                            visible={this.state.DCTCBool}
                            onOk={this.handleOk.bind(this)}
                            onCancel={this.handleCancel.bind(this)}
                            className="ReverseChecking"
                        >
                            <p>您的样本已成功导出</p>
                            <div>
                                <Button type="primary" onClick={this.DCYBValue.bind(this)}>确定</Button>
                                <Button onClick={this.DCYBValue.bind(this)}>取消</Button>
                            </div>
                        </Modal>
                    </div> : <BackFirst title={this.state.pagetitle} />
                }
            </Fragment>
        )
    }
    PopupDataLength(e) {
        this.setState({
            PopupDataLength: e.target.value
        })
    }
    // 样本导出
    DCYBValue() {
        this.setState({
            DCTCBool: false
        })
    }
    // 输出的行数
    ChangeInputValue(e) {
        this.setState({
            InputValueH: e.target.value
        })
    }
    // 分页器
    async SupervisorFY(pageNumber) {
        if (this.state.AllButton == 1) {
            let obj = {}
            obj.Time = ''
            obj.pageNumber = pageNumber
            obj.LC = ''
            let AllData = await ALLSINGLE(obj)
            this.setState({
                data: AllData.data.page.list,
                currPage: AllData.data.page.currPage,
                totalCount: AllData.data.page.totalCount,
                countAllData: AllData.data.page.totalCount
            })
        } else if (this.state.CurrentButton == 1) {
            let TimeData = await this.DafaultTime()
            let obj = {}
            obj.Time = TimeData
            obj.pageNumber = pageNumber
            obj.LC = ''
            let CurrentData = await ALLSINGLE(obj)
            console.log(CurrentData, 'CurrentData')
            this.setState({
                data: CurrentData.data.page.list,
                currPage: CurrentData.data.page.currPage,
                totalCount: CurrentData.data.page.totalCount,
                countAllData: CurrentData.data.page.totalCount
            })
        } else if (this.state.calendarTime != '请选择时间') {
            let obj = {}
            obj.Time = this.state.calendarTime
            obj.pageNumber = pageNumber
            obj.LC = this.state.SelectValue
            let CurrentData = await ALLSINGLE(obj)
            console.log(CurrentData, 'CurrentData')
            this.setState({
                data: CurrentData.data.page.list,
                currPage: CurrentData.data.page.currPage,
                totalCount: CurrentData.data.page.totalCount,
                countAllData: CurrentData.data.page.totalCount
            })
        } else {
            let Time = this.state.Detailime
            let LC = this.state.SelectValue
            let val = {}
            val.Time = Time
            val.pageNumber = pageNumber
            val.LC = LC
            console.log(val)
            let FYList = await LSFXLIST(val)
            console.log(FYList)
            this.setState({
                data: FYList.data.list,
                currPage: FYList.data.currPage,
                totalCount: FYList.data.totalCount,
                countAllData: FYList.data.totalCount
            })
        }
    }
    // 轮次的下拉
    handleChange(value) {
        this.setState({
            SelectValue: value,
            DafaultValueSelect: value
        })
        console.log(`selected ${value}`);
    }

    // 双击弹窗
    async thatsOk(record) {
        let ReverseChecking = {}
        ReverseChecking.calendarTime = record.cjrq
        ReverseChecking.DafaultValueSelect = record.jclc
        ReverseChecking.id = record.id
        ReverseChecking.ruleSeq = record.ruleSeq
        let ListValueApi = await CHECKVALUEPAI(ReverseChecking)
        if (ListValueApi.data[0].td) {
            this.setState({
                ReverseChecking: true,
                PopupData: ListValueApi.data[0].td,
                srcTabNameEn: ListValueApi.data[1].topdate.srcTabNameEn,
                ruleDesc: ListValueApi.data[1].topdate.ruleDesc
            })
        } else {
            console.log(ListValueApi.data[1].topdate.srcTabNameEn)
            this.setState({
                ReverseChecking: true,
                PopupData: [],
                srcTabNameEn: ListValueApi.data[1].topdate.srcTabNameEn,
                ruleDesc: ListValueApi.data[1].topdate.ruleDesc
            })
        }
    }
    async componentDidMount() {
        let data = await this.DafaultTime()
        this.setState({
            Detailime: data,
        })
        this.DefaultData(data)
    }
    // 进来时的默认数据
    async DefaultData(val) {
        let data = await DEFAULTDATA(val)
        console.log(data, 'data')
        if (data.data) {
            this.setState({
                pageBool: true,
                data: data.data.list,
                currPage: data.data.currPage,
                totalCount: data.data.totalCount,
                countAllData: data.data.totalCount
            })
        } else {
            this.setState({
                pageBool: false,
                pagetitle: data.msg
            })
        }
    }
    async HandlerValue() {
        let FromArr = {}
        FromArr.Time = ""
        FromArr.sblc = ""
        let data = await SUPERVISORVUE(FromArr)
        this.setState({
            data: data.data.page.list,
            currPage: data.data.page.currPage,
            totalCount: data.data.page.totalCount,
            countAllData: data.data.page.totalCount
        })
    }
    // onChange
    onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }
    // 进入的默认时间
    async DafaultTime() {
        let data = await TIMEJHSJ()
        return data.data
    }
    // 当期按钮
    async DQClickhandler(val) {
        let obj = {}
        obj.Time = await this.DafaultTime()
        obj.sblc = ''
        let DAData = await SUPERVISORVUE(obj)
        this.setState({
            data: DAData.data.page.list,
            currPage: DAData.data.page.currPage,
            totalCount: DAData.data.page.totalCount,
            FYTime: val,
            AllButton: 0,
            CurrentButton: 1,
            calendarTime: '请选择时间',
            SelectValue: '',
            SelectList: [],
            DafaultValueSelect: '请选择轮次',
            countAllData: DAData.data.page.totalCount,
        }, () => {
            this.forceUpdate()
            console.log(this.state.SelectList, "list")
        })
        // this.GetRound(obj)

    }
    // 日历按钮
    RLClickhandler() {
        this.setState({
            visible: true
        })
    }
    // 点击日期关闭弹窗
    async CanlerTime(val) {
        let str = ""
        let Array = val.split("-")
        for (var i = 0; i < Array.length; i++) {
            str += Array[i]
        }
        let FromArr = {}
        FromArr.Time = str
        FromArr.sblc = ""
        let RQTime = await HQLCLIST(FromArr)
        let RQArray = RQTime.data.sort(function (a, b) {
            return b - a
        })
        this.setState({
            visible: false,
            calendarTime: FromArr.Time,
            SelectList: RQArray
        })
    }
    // 获取轮次
    async GetRound(val) {
        let RQTime = await HQLCLIST(val)
        let RQArray = RQTime.data.sort(function (a, b) {
            return b - a
        })
        this.setState({
            SelectList: RQArray,
        })
    }
    // 全部按钮
    QBClickhandler() {
        this.setState({
            FYTime: '',
            calendarTime: '请选择日期',
            SelectList: [],
            Detailime: '',
            SelectValue: '',
            AllButton: 1,
            CurrentButton: 0,
            DafaultValueSelect: '请选择轮次'
        }, () => {
            this.HandlerValue()
        })
    }
    // 生成上报
    SCSBClickhandler() {
        console.log('上报')
        this.props.history.push('/SBAdministration')
    }
    // 点击确定关闭弹窗
    handleOk() {
        this.setState({
            visible: false,
            ReverseChecking: false
        })
    }
    // 点击取消关闭弹窗
    handleCancel() {
        this.setState({
            visible: false,
            ReverseChecking: false
        })
    }
    // 导出zip
    DCExcel() {
        let val = {}
        val.lc = this.state.SelectValue//轮次
        if (this.state.calendarTime == '请选择时间') {
            val.cjrq = ''
        } else {
            val.cjrq = this.state.calendarTime//时间
        }

        val.hc = this.state.InputValueH//导出行
        console.log(val)
        if (val.lc > 0 && val.cjrq.length > 0 && val.hc > 0) {
            console.log('进来了')
            Axios({
                url: `${window.apiUrl}/review/Appear/inTheNewspapersLeadingOut`,
                method: 'get',
                responseType: 'blob',
                params: {
                    'cjrq': val.cjrq,
                    'jclc': val.lc,
                    'number': val.hc
                }
            }).then(({ data }) => {
                console.log(data, '132')
                const blob = new Blob([data], { type: 'application/vnd.ms-excel;charset=utf-8' })
                var link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = val.cjrq + '.zip'
                link.click()
            })
        } else {
            this.error()
        }

    }
    error = () => {
        message.error('请您选择时间跟轮次');
    }
    // 关闭数据反查弹框
    CloseClick() {
        this.setState({
            ReverseChecking: false,
            EditListValue: []
        })
    }
    // 点击查询，获取日历-轮次
    async QueryData() {
        let queryData = {}
        queryData.Time = this.state.calendarTime
        queryData.LC = this.state.SelectValue
        queryData.pageNumber = 1
        console.log(queryData, "queryData")
        let data = await ALLSINGLE(queryData)
        console.log(data)
        this.setState({
            data: data.data.page.list,
            currPage: data.data.page.currPage,
            totalCount: data.data.page.totalCount,
            countAllData: data.data.page.totalCount,
            AllButton: 0
        })
    }
    // // 数据反查
    // // 分页
    // // 关闭按钮
    // CloseClick() {
    //     this.setState({
    //         ReverseChecking: false
    //     })
    // }
    p(s) {
        return s < 10 ? '0' + s : s
    }
    // 反查-导出表格
    async ExportExcel(e) {
        let PopupDataLength = this.state.PopupDataLength
        let obj = {}
        if (this.state.PopupData[0]) {
            console.log(this.state.PopupData[0])
            obj.ruleSeq = this.state.PopupData[0].ruleSeq
            obj.jclc = this.state.PopupData[0].jclc
            obj.cjrq = this.state.PopupData[0].cjrq
            obj.PopupDataLength = PopupDataLength
            Axios({
                url: `${window.apiUrl}/review/fc/exportOne`,
                method: 'get',
                responseType: 'blob',
                params: {
                    'cjrq': obj.cjrq,
                    'jclc': obj.jclc,
                    'number': obj.PopupDataLength,
                    'ruleSeq': obj.ruleSeq
                }
            }).then(({ data }) => {
                console.log(data, '132')
                const blob = new Blob([data], { type: 'application/vnd.ms-excel;charset=utf-8' })
                var link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = obj.ruleSeq + '-' + obj.cjrq + '.xls'
                link.click()
            })
            this.setState({
                ReverseChecking: false
            })
        }

    }
    // 数据反查的分页器
    ReversePageSearch(pageNumber) {
        console.log(pageNumber, "1111")
        let TableAllData = this.state.TableAllData
        let num = (pageNumber - 1) * 10
        let max = num + 10
        let TableDsplayData = []
        for (var i = num; i < max; i++) {
            TableDsplayData.push(TableAllData[i])
        }
        console.log(TableDsplayData, 'TableDsplayData')
        this.setState({
            tddata: TableDsplayData,

        })
        console.log(pageNumber);
    }
}
export default JHLSFX