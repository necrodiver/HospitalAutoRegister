const defaultData = {
    addressList: [
        {
            code: '0',
            name: '魏公村总院区'
        },
        {
            code: '1',
            name: '第一门诊部(西城区西四)'
        },
        {
            code: '2',
            name: '第二门诊部(北四环大屯路)'
        },
        {
            code: '3',
            name: '第三门诊部(北三环花园东路)'
        },
        {
            code: '4',
            name: '第四门诊部(东四环慈云寺)'
        },
        {
            code: '5',
            name: '第五门诊部(东二环朝阳门)'
        },
        {
            code: '6',
            name: '一门诊C楼（现场挂号，不支持线上）',
            disabled: true
        }
    ],
    robTicketOptions: [
        {
            label: '针对医生',
            value: 1
        },
        {
            label: '针对金额 -- (暂不支持)',
            value: 2
        },
        {
            label: '针对职位 -- (暂不支持)',
            value: 3
        }
    ]
};

export default defaultData;
