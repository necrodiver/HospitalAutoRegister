import { defineComponent, reactive, ref, withModifiers, watch, toRefs, inject } from 'vue';
import { Button, Cascader, Select, SelectOption, InputNumber, Spin } from 'ant-design-vue';
import defaultData from '@/utils/defaultData.js';
import './steps.scss';

const App = defineComponent({
    props: {
        deptList: {
            type: Array,
            require: true
        },
        initData: {
            type: Object,
            require: true
        }
    },
    setup(props, { expose, emit }) {
        const $fetch = inject('$fetch');
        let afterDeptList = [];
        let afterAppointmentTimeList = ref([]);
        const { deptList, initData } = toRefs(props);
        const isloading = ref(false);
        // 设置科室列表展示结构
        const setDeptList = depts => {
            depts.forEach(item => {
                const i = afterDeptList.findIndex(c => c.label === item.majorName);
                if (i > -1) {
                    if (afterDeptList[i].children.some(c => c.label === item.deptName)) {
                        return;
                    }
                    afterDeptList[i].children.push({
                        label: item.deptName,
                        value: item.deptId
                    });
                    return;
                }
                afterDeptList.push({
                    label: item.majorName,
                    value: item.majorDetailId,
                    children: [
                        {
                            label: item.deptName,
                            value: item.deptId
                        }
                    ]
                });
            });
        };
        // 监听科室变化
        watch(
            deptList,
            (list, prevList) => {
                setDeptList(list);
            },
            { deep: true }
        );
        // 科室选择
        const changeSelectDepts = (value, selectedOptions) => {
            if (value && value.length === 2) {
                getAppointmentTimes(value[1]);
            }
        };
        // 获取挂号时间列表
        const getAppointmentTimes = id => {
            isloading.value = true;
            $fetch
                .get('/api/appoinmentTimes', { tapIndex: initData.value.addressCode, deptId: id, timeSpan: Date.now() })
                .then(res => {
                    if (res.data && res.data.length) {
                        setAppointmentTimes(res.data);
                    }
                })
                .finally(() => {
                    isloading.value = false;
                });
        };
        const setAppointmentTimes = list => {
            afterAppointmentTimeList.value = list.map(item => {
                return {
                    label: `${item.date} (${item.displayWeek})`,
                    value: item.date,
                    disabled: item.amount <= 0
                };
            });
        };
        const changeSelectTime = val => {
            if (val) {
                getDoctorList();
            }
        };
        const getDoctorList = () => {
            isloading.value = true;
            $fetch
                .get('/api/doctorList', {
                    visitDate: timeId.value,
                    tapIndex: initData.value.addressCode,
                    deptId: deptId.value[deptId.value.length - 1],
                    timeSpan: Date.now()
                })
                .then(res => {
                    if (res && res.data && res.data.length) {
                        setDoctorList(res.data);
                    }
                })
                .finally(() => {
                    isloading.value = false;
                });
        };
        let doctorList = ref([]);
        const setDoctorList = list => {
            doctorList.value = list
                .sort((a, b) => b.fee - a.fee)
                .map(item => {
                    if (!rankList.some(child => child.value === item.ygzc)) {
                        rankList.push({ label: item.ygzc, value: item.ygzc });
                    }
                    const label = `${item.numbers > 0 ? '余号:' + item.numbers : '(满诊)'} - ${item.fee}元 - ${item.doctName} - ${item.doctIntroduced}`;
                    return {
                        label,
                        value: item.doctId
                    };
                });
        };
        const rankList = reactive([]);
        const stepLoading = ref(false);
        const displayRender = ({ labels }) => {
            return labels[labels.length - 1];
        };
        const submitSelectDept = () => {
            emit('sureStep', 3, 4, {
                deptId: deptId.value[deptId.value.length - 1],
                timeId: timeId.value,
                robTicketId: robTicketId.value,
                docId: docId.value,
                rankId: rankId.value,
                moneyRange: moneyRange,
                ...detailTimeInfo
            });
        };
        const filterOptions = (input, option) => {
            return option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };
        const detailTimeList = reactive([]);
        const changeSelectDoctor = () => {
            isloading.value = true;
            // 获取医生当前信息
            $fetch
                .get('/api/getYyScheduleInfo', {
                    visitDate: timeId.value,
                    deptId: deptId.value[deptId.value.length - 1],
                    tapIndex: initData.value.addressCode,
                    doctId: docId.value,
                    timeSpan: Date.now()
                })
                .then(res => {
                    if (res && res.data && res.data.length) {
                        detailTimeList.push(...res.data);
                    }
                })
                .finally(() => {
                    isloading.value = false;
                });
        };
        const amPm = ref('');
        const detailTimeInfo = reactive({
            sguId: '',
            scheduleId: ''
        });
        const changeDetailTimeInfo = val => {
            if (val) {
                const selectItem = detailTimeList.find(item => item.amPm === val);
                detailTimeInfo.sguId = selectItem.sguID;
                detailTimeInfo.scheduleId = selectItem.scheduleId;
            }
        };
        const robTicketOptions = defaultData.robTicketOptions;
        // 科室id
        const deptId = ref('');
        // 挂号时间
        const timeId = ref('');
        // 挂号类型
        const robTicketId = ref(null);
        // 类型为按医生：医生id
        const docId = ref('');
        // 类型为职位级别：职位级别
        const rankId = ref('');
        // 类型为金额范围：金额范围
        const moneyRange = reactive({
            min: 60,
            max: 300
        });
        const isDisabled = () => {
            if (!deptId.value) {
                return true;
            }
            if (!timeId.value) {
                return true;
            }
            if (!robTicketId.value) {
                return true;
            }
            if (robTicketId.value === 1 && (!docId.value || !amPm.value)) {
                return true;
            }
            if (robTicketId.value === 2 && moneyRange.min === 0 && moneyRange.max === 0) {
                return true;
            }
            if (robTicketId.value === 3 && !rankId.value) {
                return true;
            }
            return false;
        };
        return () => (
            <>
                <a-spin tip="Loading..." spinning={isloading.value}>
                    <div className="step-content">
                        <div className="item-content">
                            <div className="item">
                                <div className="item-left">请选择挂号科室</div>
                                <div className="item-right">
                                    <Cascader
                                        style={{ width: '280px' }}
                                        size="large"
                                        v-model:value={deptId.value}
                                        options={afterDeptList}
                                        display-render={displayRender}
                                        expand-trigger="hover"
                                        placeholder="请选择科室"
                                        onChange={changeSelectDepts}
                                    />
                                </div>
                            </div>
                            {deptId.value ? (
                                <div className="item">
                                    <div className="item-left">请选择挂号日期</div>
                                    <div className="item-right">
                                        <Select v-model:value={timeId.value} style={{ width: '280px' }} show-search filterOption={filterOptions} onChange={changeSelectTime}>
                                            {afterAppointmentTimeList.value.length &&
                                                afterAppointmentTimeList.value.map(item => {
                                                    return (
                                                        <SelectOption value={item.value} disabled={item.disabled}>
                                                            {item.label} {item.disabled ? ' (不可选择)' : ''}
                                                        </SelectOption>
                                                    );
                                                })}
                                        </Select>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                            {timeId.value ? (
                                <div className="item">
                                    <div className="item-left">请选择刷号类型</div>
                                    <div className="item-right">
                                        <Select v-model:value={robTicketId.value} style={{ width: '280px' }} show-search filterOption={filterOptions}>
                                            {robTicketOptions.map(item => {
                                                return <SelectOption value={item.value}>{item.label}</SelectOption>;
                                            })}
                                        </Select>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}

                            {robTicketId.value === 1 ? (
                                <div className="item">
                                    <div className="item-left">请选择医生</div>
                                    <div className="item-right">
                                        <Select v-model:value={docId.value} style={{ width: '800px' }} show-search filterOption={filterOptions} onChange={changeSelectDoctor}>
                                            {doctorList.value.length &&
                                                doctorList.value.map(item => {
                                                    return <SelectOption value={item.value}>{item.label}</SelectOption>;
                                                })}
                                        </Select>
                                    </div>
                                </div>
                            ) : robTicketId.value === 2 ? (
                                <div className="item">
                                    <div className="item-left">请输入金额范围</div>
                                    <div className="item-right">
                                        <InputNumber v-model:value={moneyRange.min} min={0} max={2000} precision={0} />
                                        <span style={{ padding: '0 10px' }}>~</span>
                                        <InputNumber v-model:value={moneyRange.max} min={moneyRange.min} max={2000} />
                                    </div>
                                </div>
                            ) : robTicketId.value === 3 ? (
                                <div className="item">
                                    <div className="item-left">请选择职位级别</div>
                                    <div className="item-right">
                                        <Select v-model:value={rankId.value} style={{ width: '280px' }} show-search filterOption={filterOptions}>
                                            {rankList.map(item => {
                                                return <SelectOption value={item.value}>{item.label}</SelectOption>;
                                            })}
                                        </Select>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                            {docId.value ? (
                                <div className="item">
                                    <div className="item-left">请选择具体时间</div>
                                    <div className="item-right">
                                        <Select v-model:value={amPm.value} style={{ width: '280px' }} show-search filterOption={filterOptions} onChange={changeDetailTimeInfo}>
                                            {detailTimeList.length &&
                                                detailTimeList.map(item => {
                                                    return (
                                                        <SelectOption value={item.amPm}>
                                                            {item.amPm} -- (余号：{item.numbers})
                                                        </SelectOption>
                                                    );
                                                })}
                                        </Select>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="step-footer">
                            <Button type="primary" shape="round" size="large" disabled={isDisabled()} loading={stepLoading.value} onClick={withModifiers(submitSelectDept, ['self'])} block>
                                解析
                            </Button>
                        </div>
                    </div>
                </a-spin>
            </>
        );
    }
});

export default App;
