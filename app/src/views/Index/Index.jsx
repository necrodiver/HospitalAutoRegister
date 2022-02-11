import { withModifiers, defineComponent, ref, reactive, inject, toRaw } from 'vue';
import { Input, Textarea, Button, message, Steps } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import Step1 from './components/Step1.jsx';
import Step2 from './components/Step2.jsx';
import Step3 from './components/Step3.jsx';
import Step4 from './components/Step4.jsx';
import 'ant-design-vue/es/steps/style/css';
import './index.scss';
const { Step } = Steps;

const App = defineComponent({
    setup() {
        const router = useRouter();
        const $fetch = inject('$fetch');
        const userData = reactive({
            userList: [],
            deptList: []
        });
        const initData = reactive({
            addressCode: null,
            userCode: null,
            deptId: null,
            docId: null,
            timeId: null,
            robTicketId: null,
            rankId: null,
            moneyRange: null,
            sguId: null,
            scheduleId: null
        });
        const current = ref(0);
        const onChange = step => {
            current.value = step;
        };
        const stepStatus = reactive([
            {
                index: 0,
                title: '1. 初始化数据',
                status: 'process',
                disabled: false
            },
            {
                index: 1,
                title: '2. 院区选择',
                status: 'wait',
                disabled: true
            },
            {
                index: 2,
                title: '3. 就诊人选择',
                status: 'wait',
                disabled: true
            },
            {
                index: 3,
                title: '4. 科室及医生选择',
                status: 'wait',
                disabled: true
            }
        ]);
        // wait process finish error
        const sureStep = (nowStep, nextStep, val) => {
            const index = stepStatus.findIndex(i => i.index === nowStep);
            if (index !== -1) {
                stepStatus[index].status = 'finish';
                current.value = nextStep;
                if (nowStep === 0) {
                    Object.assign(userData, val);
                    return;
                }
                if (nowStep === 1) {
                    const { deptList, addressCode } = val;
                    Object.assign(userData, { deptList });
                    Object.assign(initData, { addressCode });
                    return;
                }
                Object.assign(initData, val);
                if (nowStep === 3) {
                    const afterData = toRaw(initData);
                    gotoSetPage(afterData);
                }
            }
        };
        const gotoSetPage = query => {
            const { moneyRange, ...other } = query;
            router.push({
                name: 'set',
                query: {
                    ...other,
                    min: moneyRange.min,
                    max: moneyRange.max
                }
            });
        };
        return () => (
            <>
                <div className="index-body">
                    <Steps type="navigation" v-model:current={current.value} className="index-steps ant-steps ant-steps-horizontal ant-steps-label-horizontal ant-steps-navigation">
                        {stepStatus.map(item => {
                            return <Step title={item.title} status={item.status} disabled={item.disabled} />;
                        })}
                    </Steps>
                    <div style={{ display: current.value === 0 ? 'block' : 'none' }}>
                        <Step1 onSureStep={sureStep}></Step1>
                    </div>
                    <div style={{ display: current.value === 1 ? 'block' : 'none' }}>
                        <Step2 onSureStep={sureStep}></Step2>
                    </div>
                    <div style={{ display: current.value === 2 ? 'block' : 'none' }}>
                        <Step3 onSureStep={sureStep} userList={userData.userList}></Step3>
                    </div>
                    <div style={{ display: current.value === 3 ? 'block' : 'none' }}>
                        <Step4 onSureStep={sureStep} initData={initData} deptList={userData.deptList}></Step4>
                    </div>
                </div>
            </>
        );
    }
});

export default App;
