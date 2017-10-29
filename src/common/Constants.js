/**
 * Created by wangzhen on 2017/9/6.
 */
export const baseUrl = "http://127.0.0.1:9090"

export const addressKey = "addressKey"; //辽宁省沈阳市和平区25号

export const emailKey = "emailKey"; //pengleemanager@gmail.com

export const userIdKey = "userIdKey";//用户表ID

export const fullNameKey = "fullNameKey"; //用户的名字：钱多多

export const orgIdKey = "orgIdKey"; //用户所在机构ID

export const roleKey = "roleKey"; //ROLE_PROVINCE_NORMAL

export const sexKey = "sexKey"; //性别

export const storageTokenKey = 'myTokenKey'; //Token

export const usernameKey = 'username'; //账号名

export const orgNameKey = 'orgNameKey'; //所在单位名称

export const orgLevelKey = 'orgLevelKey'; //机构级别  HOSPITAL  CITY  PROVINCE

export const higherOrgKey = 'higherOrgKey'; //上级机构

export const addressCityKey = 'addressCityKey'; //所属地区，精确到省|市：辽宁省|沈阳市

export const backSystemUrl = 'backSystemUrl';// http://127.0.0.1:9090 后台路径前缀

export const higherOrgName = [
  {value: '辽宁省药监局', label: '辽宁省药监局'},
  {value: '沈阳市药监局', label: '沈阳市药监局'},
]

export const addressCity = [
  {
    value: '辽宁省',
    label: '辽宁省',
    children: [
      {
        label: '沈阳市',
        value: '沈阳市',
      },
      {
        label: '大连市',
        value: '大连市',
      },
      {
        label: '鞍山市',
        value: '鞍山市',
      },
      {
        label: '抚顺市',
        value: '抚顺市',
      },
      {
        label: '本溪市',
        value: '本溪市',
      },
      {
        label: '丹东市',
        value: '丹东市',
      },
      {
        label: '锦州市',
        value: '锦州市',
      },
      {
        label: '营口市',
        value: '营口市',
      },
      {
        label: '阜新市',
        value: '阜新市',
      },
      {
        label: '辽阳市',
        value: '辽阳市',
      },
      {
        label: '盘锦市',
        value: '盘锦市',
      },
      {
        label: '铁岭市',
        value: '铁岭市',
      },
      {
        label: '朝阳市',
        value: '朝阳市',
      },
      {
        label: '葫芦岛市',
        value: '葫芦岛市',
      },
    ],
  },

]

export const hospitalDegreeUtil = {
  A: '一级',
  B: '二级',
  C: '三级',
  children: {
    A: '甲等',
    B: '乙等',
    C: '丙等'
  }
}

export const hospitalDegree = [
  {
    value: 'A', label: '一级', children: [
    {value: 'A', label: '甲等'},
    {value: 'B', label: '乙等'},
    {value: 'C', label: '丙等'},]
  },
  {
    value: 'B', label: '二级', children: [
    {value: 'A', label: '甲等'},
    {value: 'B', label: '乙等'},
    {value: 'C', label: '丙等'},]
  },
  {
    value: 'C', label: '三级', children: [
    {value: 'A', label: '甲等'},
    {value: 'B', label: '乙等'},
    {value: 'C', label: '丙等'},]
  },
]

//管理市级监测机构表格
export const registerCityMonitorColumns = [
  {
    title: '监测机构名称',
    dataIndex: 'orgName',
  },
  {
    title: '级别',
    dataIndex: 'orgLevel',
  },
  {
    title: '上级监测机构',
    dataIndex: 'higherOrgName',
  },
  {
    title: '联系地址',
    dataIndex: 'address',
  },
  {
    title: '联系人',
    dataIndex: 'contacts',
  },
  {
    title: '电话',
    dataIndex: 'phoneNumber',
  },
];

export const managerMachineColumns = [
  {
    title: '机构名称',
    dataIndex: 'orgName',
  },
  {
    title: '医院级别',
    dataIndex: 'hospitalDegree',
  },
  {
    title: '上级监测机构',
    dataIndex: 'higherOrgName',
  },
  {
    title: '联系地址',
    dataIndex: 'address',
  },
  {
    title: '状态',
    dataIndex: 'isActive',
  },
]

//注册器械Form内容
export const registerMachineItems = [
  {disabled: false, required: true, label: '单位名称', fieldName: 'orgName', type: '',},
  {disabled: false, required: true, label: '所属监测机构', fieldName: 'higherOrgName', type: 'select'},
  {disabled: false, required: true, label: '医院等级', fieldName: 'hospitalDegree', type: 'select'},
  {disabled: false, required: true, label: '所属地区', fieldName: 'addressCity', type: 'select'},
  {disabled: false, required: true, label: '邮编', fieldName: 'postalCode', type: ''},
  {disabled: false, required: true, label: '邮箱', fieldName: 'email', type: 'email'},
  {disabled: false, required: true, label: '联系人', fieldName: 'contacts', type: ''},
  {disabled: false, required: true, label: '联系电话', fieldName: 'phoneNumber', type: 'phone'},
  {disabled: false, required: false, label: '传真', fieldName: 'fax', type: 'fax'},
  {disabled: false, required: false, label: '法定代表人', fieldName: 'legalPerson', type: ''},
  {disabled: false, required: true, label: '联系地址', fieldName: 'address', type: ''},
]

//注册市级监测机构Form内容
export const registerMonitor = [
  {disabled: false, required: true, label: '机构名称', fieldName: 'orgName', type: ''},
  {disabled: false, required: true, label: '单位级别', fieldName: 'orgLevel', type: 'radios'},
  {disabled: false, required: true, label: '所属地区', fieldName: 'addressCity', type: 'select'},
  {disabled: false, required: true, label: '所属上级机构', fieldName: 'higherOrgName', type: 'select'},
  {disabled: false, required: true, label: '邮编', fieldName: 'postalCode', type: ''},
  {disabled: false, required: true, label: '邮箱', fieldName: 'email', type: 'email'},
  {disabled: false, required: true, label: '联系人', fieldName: 'contacts', type: ''},
  {disabled: false, required: true, label: '联系电话', fieldName: 'phoneNumber', type: 'phone'},
  {disabled: false, required: false, label: '传真', fieldName: 'fax', type: 'fax'},
  {disabled: false, required: true, label: '联系地址', fieldName: 'address', type: ''},
]

//修改市级监测机构form内容
export const alterMonitor = [
  {disabled: true, required: true, label: '机构名称', fieldName: 'orgName', type: ''},
  {disabled: true, required: true, label: '所属地区', fieldName: 'addressCity', type: ''},
  {disabled: true, required: true, label: '所属上级机构', fieldName: 'higherOrgName', type: ''},
  {disabled: false, required: true, label: '邮编', fieldName: 'postalCode', type: ''},
  {disabled: false, required: true, label: '邮箱', fieldName: 'email', type: 'email'},
  {disabled: false, required: true, label: '联系人', fieldName: 'contacts', type: ''},
  {disabled: false, required: true, label: '联系电话', fieldName: 'phoneNumber', type: 'phone'},
  {disabled: false, required: false, label: '传真', fieldName: 'fax', type: 'fax'},
  {disabled: false, required: true, label: '联系地址', fieldName: 'address', type: ''},
]

