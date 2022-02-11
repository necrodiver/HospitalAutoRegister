import { withModifiers, defineComponent, ref, reactive, nextTick } from 'vue';
import { InputNumber, Alert, Button, Timeline, TimelineItem, message, notification } from 'ant-design-vue';
import dayjs from 'dayjs';
import { useRouter, useRoute } from 'vue-router';

import './index.scss';

const App = defineComponent({
    setup() {
        const route = useRoute();
        const isLoading = ref(false);
        const num = ref(1);
        const { addressCode, deptId, docId, max, min, rankId, robTicketId, timeId, userCode, sguId, scheduleId } = route.query;
        const HzNum = ref(1000);
        const params = {
            tapIndex: addressCode,
            deptId,
            doctId: docId,
            min: parseInt(min),
            max: parseInt(max),
            rankId,
            visitDate: timeId,
            patientId: userCode,
            HzNum: HzNum.value,
            sguId,
            scheduleId
        };
        const linelist = reactive([]);
        const goBottom = async () => {
            await nextTick();
            const height = document.querySelector('.ant-timeline').offsetHeight;
            document.querySelector('.right').scrollTop = height;
        };
        let worker = null;
        const beginSet = () => {
            if (isLoading.value && worker) {
                worker.postMessage({
                    code: 1
                });
                isLoading.value = false;
                return;
            }
            params.HzNum = HzNum.value;
            isLoading.value = true;
            worker = new Worker('./worker.js');
            worker.postMessage({
                code: 0,
                data: params
            });
            worker.onmessage = res => {
                const msg = res.data;
                if (!msg) {
                    message.error('请求错误，请刷新重试！');
                    linelist.push({ time: dayjs().format('YYYY-MM-DD HH:mm:ss SSS'), color: 'red', msg: '错误' });
                    worker.terminate();
                    isLoading.value = false;
                } else if (msg.code === 0) {
                    linelist.push({ time: dayjs().format('YYYY-MM-DD HH:mm:ss SSS'), color: 'green', msg: '挂号成功' });
                    notification.success({
                        message: '挂号成功',
                        description: msg.message
                    });
                    worker.terminate();
                    isLoading.value = false;
                } else if (msg.code === 100 || msg.code === 101) {
                    message.error('系统出错！');
                    linelist.push({ time: dayjs().format('YYYY-MM-DD HH:mm:ss SSS'), color: 'red', msg: '错误' });
                    worker.terminate();
                    isLoading.value = false;
                } else {
                    linelist.push({ time: dayjs().format('YYYY-MM-DD HH:mm:ss SSS'), color: '#FFA042', msg: msg.message });
                }
                goBottom();
            };
            worker.onerror = e => {
                message.error('代码错误:' + e.message);
                worker.terminate();
            };
        };
        return () => (
            <>
                <div className="set-content">
                    <div className="left">
                        <div className="item">
                            <div className="key">就诊人Id</div>
                            <div className="value">{userCode}</div>
                        </div>
                        <div className="item">
                            <div className="key">位置Id</div>
                            <div className="value">{addressCode}</div>
                        </div>
                        <div className="item">
                            <div className="key">时间</div>
                            <div className="value">{timeId}</div>
                        </div>
                        <div className="item">
                            <div className="key">科室Id</div>
                            <div className="value">{deptId}</div>
                        </div>
                        {robTicketId === '1' ? (
                            <div className="item">
                                <div className="key">医生Id</div>
                                <div className="value">{docId}</div>
                            </div>
                        ) : robTicketId === '2' ? (
                            <>
                                <div className="item">
                                    <div className="key">最小金额</div>
                                    <div className="value">{min}</div>
                                </div>
                                <div className="item">
                                    <div className="key">最大金额</div>
                                    <div className="value">{max}</div>
                                </div>
                            </>
                        ) : robTicketId === '3' ? (
                            <div className="item">
                                <div className="key">职位级别</div>
                                <div className="value">{rankId}</div>
                            </div>
                        ) : (
                            ''
                        )}
                        <div className="item set">
                            <div className="key">请求频率</div>
                            <div className="value">
                                <InputNumber v-model:value={HzNum.value} min={1000} max={10000} precision={0} disabled={isLoading.value} />
                                <span style={{ paddingLeft: '10px' }}>ms</span>
                            </div>
                        </div>
                        <div className="item set">
                            <Button type="primary" shape="round" size="large" onClick={withModifiers(beginSet, ['self'])} block>
                                {isLoading.value ? '取消请求' : '开始请求'}
                            </Button>
                        </div>
                    </div>
                    <div className="right">
                        <Timeline pending={isLoading.value ? '请求中...' : false} reverse={false}>
                            {linelist.map(item => {
                                return (
                                    <TimelineItem color={item.color}>
                                        {item.time} {item.msg}
                                    </TimelineItem>
                                );
                            })}
                        </Timeline>
                    </div>
                </div>
            </>
        );
    }
});

export default App;
