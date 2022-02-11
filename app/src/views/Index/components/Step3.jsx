import { defineComponent, reactive, ref, withModifiers, toRefs, watch } from 'vue';
import { RadioGroup, Radio, Button } from 'ant-design-vue';
import './steps.scss';

const App = defineComponent({
    props: {
        userList: {
            type: Array,
            require: true
        }
    },
    setup(props, { expose, emit }) {
        const userCode = ref('');
        const stepLoading = ref(false);
        const radioStyle = reactive({
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        });
        const submitSelectAddress = () => {
            emit('sureStep', 2, 3, { userCode: userCode.value });
        };
        const { userList } = toRefs(props);
        watch(userList, (userList, prevUserList) => {
            const firstUser = userList.find(item => item.status === '1');
            if (firstUser) {
                userCode.value = firstUser.clientId;
            }
        });
        return () => (
            <>
                <div className="step-content">
                    <div className="item-content">
                        <div className="item">
                            <div className="item-left">请选择</div>
                            <div className="item-right">
                                <RadioGroup v-model:value={userCode.value}>
                                    {userList.value &&
                                        userList.value.length &&
                                        userList.value.map(item => {
                                            return (
                                                <Radio style={radioStyle} disabled={item.status !== '1'} value={item.clientId}>
                                                    {item.clientName}
                                                </Radio>
                                            );
                                        })}
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                    <div className="step-footer">
                        <Button type="primary" shape="round" size="large" loading={stepLoading.value} onClick={withModifiers(submitSelectAddress, ['self'])} block disabled={!userCode.value}>
                            解析
                        </Button>
                    </div>
                </div>
            </>
        );
    }
});

export default App;
