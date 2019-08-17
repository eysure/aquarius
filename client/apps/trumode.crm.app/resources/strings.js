export default {
    // Support Languages
    $LANGUAGE: ["en,en-US", "zh,zh-CN"],
    APP_NAME: ["CRM", "客户关系管理"],

    // Tabs
    TAB_CUSTOMERS: ["Customers", "客户"],
    TAB_SUPPLIERS: ["Suppliers", "供应商"],

    TAB_CUSTOMERS_ICON: ["folder_shared", "folder_shared"],
    TAB_SUPPLIERS_ICON: ["folder_shared", "folder_shared"],

    // Context Menu
    OPEN: ["Open", "打开"],
    DELETE: ["Delete", "删除"],

    // Customers Fields
    logo: ["Logo", "Logo"],
    abbr: ["Abbr.", "简称"],
    name: ["Name", "名称"],
    country: ["Country or Region", "国家或地区"],
    type: ["Type", "类型"],
    address: ["Address", "地址"],
    tel: ["Tel.", "电话"],
    website: ["Website", "网站"],
    fax: ["Fax", "传真"],
    time_created: ["Created Time", "创建时间"],
    time_modified: ["Last Modified Time", "最后修改时间"],
    name_cn: ["Name (CN)", "中文名称"],
    remark: ["Remark", "备注"],
    tags: ["Tags", "标签"],
    NAME_PH: ["Full company name", "公司全名"],
    ABBR_PH: ["Brand abbrivation", "商标简称"],

    type_0: ["Not Customer", "非客户"],
    type_1: ["Potential Customer", "潜在客户"],
    type_2: ["General Customer", "一般客户"],
    type_3: ["Important Customer", "重要客户"],
    type_4: ["Special Customer", "特殊客户"],

    CUSTOMER_DELETE_DC: [
        'Are you sure to delete customer "${name}"? This cannot be restore. Only customers with no order placed can be removed.',
        '你确定要删除客户"${name}"吗？此操作不能复原。只有从未下单的客人可以被删除。'
    ],
    NEW_CUSTOMER: ["New Customer", "新建客户"],

    TAB_CUSTOMER_BASIC_INFO: ["Basic Info", "基本信息"],
    TAB_CUSTOMER_CONTACTS: ["Contacts", "联系人"],
    TAB_CUSTOMER_ANALYZE: ["Analyze", "分析"],

    TAB_CUSTOMER_BASIC_INFO_ICON: ["assignment", "assignment"],
    TAB_CUSTOMER_CONTACTS_ICON: ["assignment_ind", "assignment_ind"],
    TAB_CUSTOMER_ANALYZE_ICON: ["assessment", "assessment"],

    // Customer Contact
    NEW_CUSTOMER_CONTACT: ["New Customer Contact", "新建客户联系人"],

    // Field
    customer_id: ["Belongs to Customer", "所属客户"],
    photo: ["Photo", "照片"],
    role: ["Role", "职位"],
    email: ["Email", "邮箱"],
    mobile: ["Mobile", "电话"],

    CUSTOMER_CONTACT_DELETE_DC: ['Are you sure to delete "${name}"? \n This cannot be undo.', '你确定要删除"${name}"吗？此操作不能复原。'],

    // Suppliers Fields
    city: ["City", "城市"],
    state: ["State", "省/州"],

    SUPPLIER_DELETE_DC: [
        'Are you sure to delete supplier "${name}"? This cannot be restore. Only suppliers with no order taken can be removed.',
        '你确定要删除供应商"${name}"吗？此操作不能复原。只有从未承接订单的供应商可以被删除。'
    ],

    NEW_SUPPLIER: ["New Supplier", "新建供应商"],

    TAB_SUPPLIER_BASIC_INFO: ["Basic Info", "基本信息"],
    TAB_SUPPLIER_CONTACTS: ["Contacts", "联系人"],
    TAB_SUPPLIER_ANALYZE: ["Analyze", "分析"],

    TAB_SUPPLIER_BASIC_INFO_ICON: ["assignment", "assignment"],
    TAB_SUPPLIER_CONTACTS_ICON: ["assignment_ind", "assignment_ind"],
    TAB_SUPPLIER_ANALYZE_ICON: ["assessment", "assessment"],

    NEW_SUPPLIER_CONTACT: ["New Supplier Contact", "新建供应商联系人"],

    supplier_id: ["Belongs to Supplier", "所属供应商"],

    SUPPLIER_CONTACT_DELETE_DC: ['Are you sure to delete "${name}"? \n This cannot be undo.', '你确定要删除"${name}"吗？此操作不能复原。']
};
