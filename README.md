## 医院挂号使用教程  
#### 注意：本程序只供学习交流娱乐之用,由此产生任何纠纷由使用者自己承担!本人概不负责！侵删！  
#### 介绍：北京大学口腔医院，挂号   
#### mac文件夹为mac执行挂号程序,windows为window执行程序（暂未打包），按需下载    
---  
#### 使用说明：
1. 启用抓包工具（我这里使用的是Proxyman），可以抓小程序的微信授权登录，调用接口```https://bdkq.leanpay.cn/weixin-miniapp-bdkq@default/wechat/login.json```的登录参数  
    最重要的三个参数：   
    > Request请求的header：***x-sign***，接口返回加密串需要的解密key（***动态的，每次请求都是随机加密的***）  
    > Response返回的header：***x-version***，接口请求url的拼接版本（***动态的，一小段时间后就会改变***）  
    > Response返回的Body：{ encrypt": "XXXXXX" }，这里的***XXXXXX***（这个就是加密串，用***上边的x-sign来解密***）  
2. 启用“北京大学口腔医院医疗服务助手”（推荐直接在电脑端打开，比较方便，使用抓包工具来抓登录的参数）  
3. 复制到对应的conf文件夹下的app.ini中  
参数分别对应复制到以下：  
    > USER_ENCRY: XXXXXX  
    > USER_SIGN: x-sign  
    > VERSION: x-version  
4. 如果需要设置对应的其他配置，可以在app.ini中进行其他配置  
    > PATIENT_ID：患者ID，默认取第一条（就诊人第一条）；  

    > VISIT_DATE：挂号日期，请务必对应放号日期来进行挂号，（格式：YYYY-MM-DD，比如：2020-09-28）；

    > DEPT_ID：科室ID，用于挂号的科室，（科室隔一段时间会改变，这里默认683，683暂时为：口腔外科门诊，后续可能会变化，查看你需要挂的科室：开启抓包工具，然后操作你需要挂号的科室进入，在抓包工具中直接查看接口getYyDoctorInfo.json的请求Query中的参数deptCode就是对应科室id）；   

    > VISIT_MIN_MONEY：挂号至少金额，默认单位元，非必填，至少0，至多10000，包含所填的值，若参数为负数/比挂号至多金额多，不填默认按0；  
    
    > VISIT_MAX_MONEY：挂号至多金额，默认单位元，非必填，至少0，至多10000，包所填的值，若参数为负数/比挂号至多金额多，不填默认按100；  

    > RUN_HZ:这里是执行时间间隔，默认单位ms，默认50ms执行一次  

5. 以上都配置完成后，直接运行hospital-auto-register就行了,若运行出错，将会提示

