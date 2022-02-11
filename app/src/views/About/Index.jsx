import { withModifiers, defineComponent, ref } from 'vue';
import './index.scss';
const App = defineComponent({
    setup() {
        return () => (
            <>
                <div className="about-body">
                    <div className="about-warn">
                        <div>注意：本程序只供学习交流之用,由此产生任何纠纷由使用者自己承担!本人概不负责！</div>
                        <div>另外，请求频次太高将会被封号，请注意设定好自己的请求频率（代码已作限制至少请求频率为1000ms）</div>
                    </div>
                    <div className="about-title">使用说明</div>
                    <div className="about-message">
                        <div className="item">
                            1.
                            首先切换到初始选择页面，然后根据所提示内容进行填写，其操作方式和小程序内差不多，只是第一步的“初始化数据”需要手动使用抓包工具获取（另一份的README.md上有此操作具体说明及解释）
                        </div>
                        <div className="item">2. 第4步的科室及医生选择暂只支持某个医生，不支持另外两个条件（针对金额和针对职位），后续可能会补上，都是功能上的堆积，没技术含量，暂时懒得弄</div>
                        <div className="item">3. 第4步完成后会携带参数到创建订单的页面，也就是“刷”这个页面，根据具体请求频率设置，最低1000ms（自己有需求自行设置）</div>
                    </div>
                </div>
            </>
        );
    }
});

export default App;
