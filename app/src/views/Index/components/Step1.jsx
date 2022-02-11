import { withModifiers, defineComponent, ref, reactive, inject, toRef, toRefs, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { Input, Textarea, Button, Modal, Collapse, Radio, Space } from 'ant-design-vue';
import testOptions from './test';
import './steps.scss';
const { Panel } = Collapse;
const router = useRouter();

const App = defineComponent({
    name: 'step1',
    setup(props, { expose, emit }) {
        const $fetch = inject('$fetch');
        const stepLoading = ref(false);
        const initData = reactive({
            userList: []
        });
        const firstData = reactive({
            userSign: testOptions.step1.userSign,
            xVersion: testOptions.step1.xVersion,
            userEncrypt: testOptions.step1.userEncrypt
        });
        const submitAnalysis = () => {
            stepLoading.value = true;
            $fetch
                .post('/api/analysis', { ...firstData })
                .then(res => {
                    if (res && res.data && res.data.cardInfo && res.data.cardInfo.length) {
                        initData.userList = res.data.cardInfo;
                        emit('sureStep', 0, 1, { userList: initData.userList });
                        return;
                    }
                    message.error('查无数据！');
                })
                .catch(err => {})
                .finally(() => {
                    stepLoading.value = false;
                });
        };
        // expose({
        //     changeVisit
        // });
        return () => (
            <>
                <div className="step-content">
                    <div className="item-content">
                        <div className="item">
                            <div className="item-left">x-sign：</div>
                            <div className="item-right">
                                <Input v-model:value={firstData.userSign} allowClear placeholder="请输入login.json接口header中的x-sign" size="large" />
                            </div>
                        </div>
                        <div className="item">
                            <div className="item-left">x-version：</div>
                            <div className="item-right">
                                <Input v-model:value={firstData.xVersion} allowClear placeholder="请输入login.json返回Header中的x-version" size="large" />
                            </div>
                        </div>
                        <div className="item">
                            <div className="item-left">加密串：</div>
                            <div className="item-right">
                                <Textarea v-model:value={firstData.userEncrypt} allowClear autoSize={{ minRows: 2, maxRows: 12 }} placeholder="请输入login.json返回的加密内容" />
                            </div>
                        </div>
                    </div>
                    <div className="step-footer">
                        <Button type="primary" shape="round" size="large" loading={stepLoading.value} onClick={withModifiers(submitAnalysis, ['self'])} block>
                            解析
                        </Button>
                    </div>
                </div>
            </>
        );
    }
});

export default App;
