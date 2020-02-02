import React, { Fragment } from "react";
import { Table, Button, Radio, Divider, Form, Input, Calendar, Modal, message } from 'antd';
import { FILEMANAGEM, FILEWJJC, DAFAULTROUTE } from "@api"
import Inspection from "./Inspection"
import DafaultRoute from '@components/DafaultRoute'
import { DATALOADINGTIME, DAFAULTTIMEAPI, FROMDATAID } from "@api/FileManagement"
import BackFirst from '@pages/BackFirst'
const { Search } = Input;
@Form.create()
class FileManagement extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [],
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,
            filteredInfo: null,
            sortedInfo: null,
            keyWord: "",
            TableName: "",
            currPage: 1,
            totalCount: 66,
            InspectBool: false,
            InspectList: [],//文件检查,
            TipsBool: false,//提示
            OriginalData: [],//原始数据
            classification: '',//主题分类
            bmEnList: [],
            DafaultTime: '请选择加载时间',
            visible: false,
            pageBool: false,
            EditUserName:''
        }
    }
    // start = () => {
    //     this.setState({ loading: true });
    //     // ajax request after empty completing
    //     setTimeout(() => {
    //         this.setState({
    //             selectedRowKeys: [],
    //             loading: false,
    //         });
    //     }, 1000);
    // };

    // onSelectChange = selectedRowKeys => {
    //     console.log('selectedRowKeys changed: ', selectedRowKeys);
    //     this.setState({ selectedRowKeys });
    // };
    render() {
        let { sortedInfo, filteredInfo, bmEnList } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const { loading, selectedRowKeys } = this.state;
        // const rowSelection = {
        //     selectedRowKeys,
        //     onChange: this.onSelectChange,
        // };
        // const hasSelected = selectedRowKeys.length > 0;

        const columns = [
            {
                id: 1,
                title: '主题分类',
                dataIndex: 'jgztfl',
                align: 'center',
            },
            {
                id: 2,
                title: '主题分类编号',
                dataIndex: 'jgztflbm',
                align: 'center',
            },
            {
                id: 3,
                title: '表名',
                dataIndex: 'bmEn',
                align: 'center',
                filters: [{ text: 'YGB', value: 'YGB' }, { text: 'GYB', value: 'GYB' }],
                filterMultiple: false,
                onFilter: (value, record) => record.bmEn.indexOf(value) > -1,
                ellipsis: true,
            },
            {
                id: 4,
                title: '文件名称',
                dataIndex: 'papersName',
                align: 'center',
                ellipsis: true,
            },
            {
                id: 5,
                title: '文件检核状态',
                dataIndex: 'sjjhzt',
                align: 'center',
                render: (text, record) => {
                    if (record.sjjhzt == "1") {
                        return <span>
                            文件检核通过
                        </span>
                    } else if (record.sjjhzt == "0") {
                        return <span>
                            文件未检核
                        </span>
                    } else if (record.sjjhzt == "2") {
                        return <span>
                            文件检核未通过
                        </span>
                    } else if (record.sjjhzt == "3") {
                        return <span>
                            文件暂无
                        </span>
                    }

                }
            },
            {
                id: 6,
                title: '数据检核状态',
                dataIndex: 'wjjhzt',
                align: 'center',
                render: (text, record) => {
                    if (record.wjjhzt == "1") {
                        return <span>
                            数据检核通过
                        </span>
                    } else if (record.wjjhzt == "0") {
                        return <span>
                            数据未检核
                        </span>
                    } else if (record.wjjhzt == "2") {
                        return <span>
                            数据检核未通过
                        </span>
                    } else if (record.wjjhzt == "3") {
                        return <span>
                            数据暂无
                        </span>
                    }

                }
            },
            {
                id: 6,
                title: '文件检查',
                align: 'center',
                dataIndex: 'DocumentInspection',
                filters: [{ text: '全选', value: '全选' }, { text: '取消', value: '取消' }],
                filteredValue: filteredInfo.name || null,
                filterMultiple: false,
                onFilter: this.DocumentInspectionFilter.bind(this),
                render: (text, record) => {
                    if (record.wjjhzt == "2" || record.sjjhzt == "1") {
                        return <span>
                            <Radio disabled checked={record.bool} onClick={this.RadioClick.bind(this, record)}></Radio>
                        </span>

                    } else {
                        return <span>
                            <Radio checked={record.bool} onClick={this.RadioClick.bind(this, record)}></Radio>
                        </span>
                    }
                },
                ellipsis: true,
            },
            {
                id: 8,
                title: "数据加载",
                dataIndex: 'DataLoading',
                align: 'center',
                filters: [{ text: '全选', value: '全选' }, { text: '取消', value: '取消' }],
                filteredValue: filteredInfo.name || null,
                filterMultiple: false,
                onFilter: this.DataLoadingFilter.bind(this),
                render: (text, record) => {
                    if (record.sjjhzt == "2" || record.sjjhzt == "0") {
                        return <span>
                            <Radio disabled checked={record.LoadingBool} onClick={this.RadioClickLoading.bind(this, record)}></Radio>
                        </span>

                    } else {
                        return <span>
                            <Radio checked={record.LoadingBool} onClick={this.RadioClickLoading.bind(this, record)}></Radio>
                        </span>
                    }
                },
                ellipsis: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                key: 'operation',
                width: "150px",
                ellipsis: true,
                render: (text, record) => {
                    return <span>
                        <a onClick={this.EditHandlerValue.bind(this, text, record)}>文件检查</ a>
                        <Divider type="vertical" />
                        <a onClick={this.AbolishHandlerValue.bind(this, record)}>数据加载</ a>
                    </span>

                },
            }
        ];
        // const { getFieldDecorator } = this.props.form;
        return (
            <Fragment >
                <div style={{ height: '40px', backgroundColor: '#fff', lineHeight: '40px', paddingLeft: 10, fontSize: '14px', color: '#333' }}>
                    当前位置：首页-文件管理
                </div>
                {
                    this.state.pageBool ? <div>
                    <div style={{ padding: '10px' }} className='DafaultData_page'>
                        <div style={{ float: 'left' }}>
                            <Input
                                placeholder="请输入主题分类"
                                style={{ width: 200 }}
                                value={this.state.classification}
                                onChange={this.KeyWordValue.bind(this)}
                            />
                            <Input placeholder="请输入表名"
                                value={this.state.TableName}
                                style={{ width: 150, marginLeft: '12px' }}
                                onChange={this.TableNameValue.bind(this)} />
                            <Button type="primary"
                                style={{ margin: ' 0 6px' }}
                                onClick={this.QueryClick.bind(this)}>查询</Button>
                            <Button type="primary"
                                style={{ margin: ' 0 6px' }}
                                onClick={this.ResetClick.bind(this)}>重置</Button>
                            <Button type="primary"
                                style={{ margin: '0 5px' }}
                                onClick={this.GoReview.bind(this)}>去检核</Button>
                        </div>
                        <div style={{ float: 'right' }}>
                            <Button type="primary"
                                style={{ margin: ' 0 6px' }}
                                onClick={this.InspectClick.bind(this)}>文件检查</Button>
                            <Button type="primary"
                                style={{ margin: ' 0 6px' }}
                                onClick={this.LoadClick.bind(this)}>数据加载</Button>
                            <div style={{ display: 'inline-block', margin: '0 5px', width: '150px', border: '1px solid #d9d9d9', height: '32px', borderRadius: '4px', backgroundColor: '#fff', padding: '4px 11px', color: 'rgba(0, 0, 0, 0.65)', cursor: 'pointer' }}
                                onClick={this.DataLoadingTime.bind(this)}
                            >{this.state.DafaultTime}</div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: "#FFFFFF", padding: "10px" }} className="FileManagementTable">
                        <Table columns={columns}
                            dataSource={this.state.data}
                            onChange={this.onChange.bind(this)}
                            pagination={{ pageSize: 66 }}
                            scroll={{ y: 340 }} />
                    </div>

                    <Modal
                        title="文件检查"
                        visible={this.state.InspectBool}
                        onOk={this.handleOk.bind(this)}
                        onCancel={this.handleCancel.bind(this)}
                        className="ModalWJJC"
                    >
                        <Inspection val={this.state.InspectList} />
                    </Modal>
                    <div className="InspectionTable">
                        <Modal
                            title="文件检查"
                            visible={this.state.TipsBool}
                            onOk={this.handleOk.bind(this)}
                            onCancel={this.handleCancel.bind(this)}

                        >
                            <p>抱歉您的文件名不存在！！！</p>
                            <Button onClick={this.CloseClick.bind(this)}>关闭</Button>
                        </Modal>
                    </div>
                    <Modal
                        title="时间"
                        visible={this.state.visible}
                        onOk={this.handleOk.bind(this)}
                        onCancel={this.handleCancel.bind(this)}
                    >
                        <div>
                            <Calendar
                                onPanelChange={this.onPanelChange.bind(this)}
                                fullscreen={false}
                                onSelect={this.onSelect.bind(this)}
                            />
                        </div>
                    </Modal>
                    <DafaultRoute />
                </div> : <BackFirst title={this.state.EditUserName} />
                }
            </Fragment>
        )
    }
    CloseClick() {
        this.setState({
            InspectBool: false,
            TipsBool: false
        })
    }
    handleOk() {
        this.setState({
            InspectBool: false,
            TipsBool: false,
            visible: false
        })
    }
    handleCancel() {
        this.setState({
            InspectBool: false,
            TipsBool: false,
            visible: false
        })
    }
    componentDidMount() {

        this.HandlerValueList()

    }
    // 页面初始化渲染的数据
    async HandlerValueList() {
        let content = {}
        content.classification = this.state.classification
        content.TableName = this.state.TableName
        let DataList = await FILEMANAGEM(content)
        console.log(DataList, "DataList")
        if (DataList.data) {
            let OriginalData = JSON.parse(JSON.stringify(DataList.data))
            let DisplayData = JSON.parse(JSON.stringify(DataList.data))
            // let bmEn = []
            for (var i = 0; i < DisplayData.length; i++) {
                // let obj = {}
                // obj.text = DisplayData[i]
                // obj.value = DisplayData[i]
                // bmEn.push(obj)
                if (DisplayData[i].papersName == "文件不存在！！！") {
                    DisplayData[i].bool = false
                } else {
                    // 查出下标
                    let data = DisplayData[i].papersName.split(':')[1]
                    let Suffix = data.split('.')[0]
                    var index = Suffix.lastIndexOf("\\");
                    Suffix = Suffix.substring(index + 1, Suffix.length);
                    // 截取值
                    DisplayData[i].papersName = Suffix
                    DisplayData[i].bool = true
                }
            }
            this.setState({
                OriginalData: OriginalData,
                data: DisplayData,
                currPage: DataList.data.currPage,
                totalCount: DataList.data.totalCount,
                pageBool:true
                // bmEnList:bmEn
            }, () => {
                console.log(this.state.OriginalData, "OriginalData")
            })
        } else {
            this.setState({
                data: [],
                currPage: 1,
                totalCount: 10,
                EditUserName:DataList.msg,
                pageBool:false
            }, () => {
                console.log(this.state.OriginalData, "OriginalData")
            })
        }

    }
    // 页面筛选
    onChange(pageNumber) {
        // let data = await pagingListApi(pageNumber)
        // console.log(data)
        // this.setState({
        //     data: data.data.list,
        //     currPage: data.data.currPage
        // })
    }
    // 请输入关键词
    KeyWordValue(e) {
        this.setState({
            classification: e.target.value
        })
    }

    // 请输入表名
    TableNameValue(e) {
        this.setState({
            TableName: e.target.value
        })
    }
    // 文件检查
    async InspectClick() {
        let InspectList = []
        let DataList = this.state.data
        for (var i = 0; i < DataList.length; i++) {
            if (DataList[i].bool) {
                InspectList.push(DataList[i])
            }
        }
        let TJSJ = []
        let YSSJ = this.state.OriginalData
        for (var j = 0; j < YSSJ.length; j++) {
            for (var m = 0; m < InspectList.length; m++) {
                if (YSSJ[j].id == InspectList[m].id) {
                    TJSJ.push(YSSJ[j].papersName)
                }
            }
        }
        console.log(TJSJ, "TJSJ")
        let pathNameData = await FILEWJJC(TJSJ)
        console.log(pathNameData.data, "pathNameData")

        this.setState({
            InspectBool: true,
            InspectList: pathNameData.data
        })
    }

    RadioClick(val) {
        console.log(val, "888")
        let FromBool = val.bool
        // eslint-disable-next-line no-unused-expressions
        FromBool = !FromBool
        console.log(FromBool)
        let FromListId = val.id
        let FromList = this.state.data
        for (var i = 0; i < FromList.length; i++) {
            if (FromListId == FromList[i].id) {

                FromList[i].bool = FromBool
            }
        }
        this.setState({
            data: FromList
        })
    }
    // 加载按钮
    RadioClickLoading(val) {
        if (val.sjjhzt == "1") {
            console.log(111)
            let FromBool = val.LoadingBool
            // eslint-disable-next-line no-unused-expressions
            FromBool = !FromBool
            console.log(FromBool)
            let FromListId = val.id
            let FromList = this.state.data
            for (var i = 0; i < FromList.length; i++) {
                if (FromListId == FromList[i].id) {
                    FromList[i].LoadingBool = FromBool
                }
            }
            this.setState({
                data: FromList
            })
        }

    }
    // 文件检查
    async EditHandlerValue(val) {
        let EditListArray = []
        EditListArray.push(arguments[1].papersName + '.txt')
        let pathNameData = await FILEWJJC(EditListArray)
        if (arguments[1].papersName == "文件不存在！！！") {
            this.setState({
                TipsBool: true
            })
        } else {
            let InspectList = []
            InspectList.push(arguments[1])
            console.log(InspectList, '123')
            this.setState({
                InspectBool: true,
                InspectList: pathNameData.data
            })
        }
    }
    // 数据加载
    async AbolishHandlerValue(record) {
        console.log(record)
        let obj = {}
        obj.id = record.id
        if (this.state.DafaultTime == '请选择加载时间') {
            obj.cjrq = ''
        } else {
            obj.cjrq = this.state.DafaultTime
        }
        let IDdata = await FROMDATAID(obj)
        if (IDdata.code == '0') {
            this.error('暂无机构代码')
        } else if (IDdata.code == '1') {
            this.error('文件名称不存在')
        } else if (IDdata.code == '2') {
            this.error('请选择您的加载时间')
        } else if (IDdata.code == '3') {
            this.error('文件地址不存在')
        } else if (IDdata.code == '4') {
            this.success()
        } else {
            console.log('失败')
        }
    }
    // 表名筛选
    TableNameFilter(value, record) {
        console.log(value)

    }
    // DataLoadingFilter 数据加载按钮全选
    DataLoadingFilter(value, record) {
        let FromList = this.state.data
        if (value == "全选") {
            for (var i = 0; i < FromList.length; i++) {
                if (FromList[i].sjjhzt == "1") {
                    FromList[i].LoadingBool = true
                }
            }
        } else if (value == "取消") {
            for (var j = 0; j < FromList.length; j++) {
                FromList[j].LoadingBool = false
            }
        }
        this.setState({
            data: FromList
        })
    }
    // 文件检查按钮
    DocumentInspectionFilter(value, record) {
        console.log(value)
        let FromList = this.state.data
        if (value == "全选") {
            for (var i = 0; i < FromList.length; i++) {
                if (FromList[i].wjjhzt == "0" || FromList[i].wjjhzt == "2") {
                    FromList[i].bool = true
                }
            }
        } else if (value == "取消") {
            for (var j = 0; j < FromList.length; j++) {
                FromList[j].bool = false
            }
        }
        this.setState({
            data: FromList
        })
    }
    onChange(pagination, filters, sorter, extra) {

    }
    // 表单确定按钮
    handleLogin() {

    }
    // 输入框 搜索的小图标
    SearchInputValue(value) {
        console.log(value)
    }
    // 去检核
    GoReview() {
        console.log("去检核")
        console.log(this)
        this.props.history.push("/DataChecking/ClassfyList")
    }
    // 查询
    async QueryClick() {
        this.HandlerValueList()
        // let content = {}
        // content.classification = this.state.classification
        // content.TableName = this.state.TableName
        // let List = await FILEMANAGEM(content)
        // console.log(content)
        // console.log('查询')
    }
    ResetClick() {
        this.setState({
            classification: '',
            TableName: ''
        }, () => {
            this.QueryClick()
        })
    }

    // 数据加载
    async LoadClick() {
        console.log('数据加载按钮')
        if (this.state.DafaultTime == '请选择加载时间') {
            let data = await DATALOADINGTIME()
            console.log(data)
            if (data.code == 1) {
                this.success()
            } else if (data.code == 0) {
                this.error('请选择您的默认时间')
            }
        } else {
            let dafaultTime = this.state.DafaultTime
            let str = ''
            let Array = dafaultTime.split('-')
            for (var i = 0; i < Array.length; i++) {
                str += Array[i]
            }
            let data = await DAFAULTTIMEAPI(str)
            console.log(data)
            if (data.msg == '成功') {
                this.success()
            }
        }
        // let keyWord = this.state.keyWord
        // let TableName = this.state.TableName
        // console.log(keyWord, TableName)
    }
    success = () => {
        message.success('数据加载成功');
    }
    error = (val) => {
        message.error(val);
    };
    DataLoadingTime() {
        console.log('弹出时间选择框')
        this.setState({
            visible: true
        })
    }
    onPanelChange = value => {
        console.log(value, "8888")
        const d = new Date(value._d)
        const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
        console.log(resDate, "777")
        this.setState({
            DafaultTime: resDate
        });
    }
    onSelect = value => {
        console.log(value, "999999")
        const d = new Date(value._d)
        const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())

        console.log(resDate)
        this.setState({
            DafaultTime: resDate,
        }, () => {
            this.handleOk()
        });
    }
    p(s) {
        return s < 10 ? '0' + s : s
    }
}
export default FileManagement