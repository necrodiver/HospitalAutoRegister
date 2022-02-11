import { defineComponent, reactive, ref, withModifiers, inject } from 'vue';
import { RadioGroup, Radio, Button } from 'ant-design-vue';
import defaultData from '@/utils/defaultData';

import './steps.scss';

const App = defineComponent({
    setup(props, { expose, emit }) {
        const addreassList = defaultData.addressList;
        const addressCode = ref('0');
        const stepLoading = ref(false);
        const radioStyle = reactive({
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        });
        const $fetch = inject('$fetch');
        const submitSelectAddress = () => {
            $fetch.get('/api/depts', { tapIndex: addressCode.value, timeSpan: Date.now() }).then(res => {
                if (res && res.data && res.data.lists && res.data.lists.length) {
                    emit('sureStep', 1, 2, { deptList: res.data.lists, addressCode: addressCode.value });
                    return;
                }
            });
        };
        return () => (
            <>
                <div className="step-content">
                    <div className="item-content">
                        <div className="item">
                            <div className="item-left">请选择</div>
                            <div className="item-right">
                                <RadioGroup v-model:value={addressCode.value}>
                                    {addreassList.map(item => {
                                        return (
                                            <Radio style={radioStyle} disabled={item.disabled} value={item.code}>
                                                {item.name}
                                            </Radio>
                                        );
                                    })}
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                    <div className="step-footer">
                        <Button type="primary" shape="round" size="large" loading={stepLoading.value} onClick={withModifiers(submitSelectAddress, ['self'])} block>
                            解析
                        </Button>
                    </div>
                </div>
            </>
        );
    }
});

export default App;
