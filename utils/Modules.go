package utils

type Analysis struct {
	UserSign    string `form:"userSign" json:"userSign" xml:"userSign"  binding:"required"`
	XVersion    string `form:"xVersion" json:"xVersion" xml:"xVersion"  binding:"required"`
	UserEncrypt string `form:"userEncrypt" json:"userEncrypt" xml:"userEncrypt"  binding:"required"`
}
type XTOKENInfo struct {
	AccessToken string `form:"accessToken" json:"accessToken" xml:"accessToken"  binding:"required"`
}
type Dept struct {
	TapIndex string `form:"tapIndex" json:"tapIndex" xml:"tapIndex" binding:"required"`
}
type DeptTapIndex struct {
	TapIndex string `form:"tapIndex" json:"tapIndex" xml:"tapIndex" binding:"required"`
	DeptId   string `form:"deptId" json:"deptId" xml:"deptId" binding:"required"`
}
type VisitDept struct {
	VisitDate string `form:"visitDate" json:"visitDate" xml:"visitDate" binding:"required"`
	DeptId    string `form:"deptId" json:"deptId" xml:"deptId" binding:"required"`
	TapIndex  string `form:"tapIndex" json:"tapIndex" xml:"tapIndex" binding:"required"`
}
type YyScheduleInfo struct {
	VisitDate string `form:"visitDate" json:"visitDate" xml:"visitDate" binding:"required"`
	DeptId    string `form:"deptId" json:"deptId" xml:"deptId" binding:"required"`
	TapIndex  string `form:"tapIndex" json:"tapIndex" xml:"tapIndex" binding:"required"`
	DoctId    string `form:"doctId" json:"doctId" xml:"doctId" binding:"required"`
}
type OrderInfo struct {
	VisitDate  string `form:"visitDate" json:"visitDate" xml:"visitDate" binding:"required"`
	DeptId     string `form:"deptId" json:"deptId" xml:"deptId" binding:"required"`
	TapIndex   string `form:"tapIndex" json:"tapIndex" xml:"tapIndex" binding:"required"`
	DoctId     string `form:"doctId" json:"doctId" xml:"doctId" binding:"required"`
	PatientId  string `form:"patientId" json:"patientId" xml:"patientId" binding:"required"`
	SguId      string `form:"sguId" json:"sguId" xml:"sguId" binding:"required"`
	ScheduleId string `form:"scheduleId" json:"scheduleId" xml:"scheduleId" binding:"required"`
	HzNum      int    `form:"hzNum" json:"hzNum" xml:"hzNum" binding:"required"`
}
type DoctorInfoBase struct {
	Data []DoctorInfo `json:"data"`
}

type BaseData struct {
	Url    string `json:"url"`
	Method string `json:"method"`
	Header struct {
		XToken     string `json:"x-token"`
		XNonce     string `json:"x-nonce"`
		XTimestamp string `json:"x-timestamp"`
		XSign      string `json:"x-sign"`
	} `json:"header"`
	Data struct {
		// DeptCode int `json:"deptCode"`
		TapIndex int `json:"tapIndex"`
	} `json:"data"`
}

type BaseDataPost struct {
	Url    string `json:"url"`
	Method string `json:"method"`
	Header struct {
		XToken     string `json:"x-token"`
		XNonce     string `json:"x-nonce"`
		XTimestamp string `json:"x-timestamp"`
		XSign      string `json:"x-sign"`
	} `json:"header"`
	Data string `json:"data"`
}

type SubmitData struct {
	PatientId  int    `json:"patientId"`
	ScheduleId string `json:"scheduleId"`
	VisitDate  string `json:"visitDate"`
	DeptId     string `json:"deptId"`
	SguId      string `json:"sguId"`
	Dist       string `json:"dist"`
}

// 登录用户信息
type UserData struct {
	Data struct {
		AccessToken string `json:"accessToken"`
		CardInfo    []struct {
			Birthday      string `json:"birthday"`
			ClientId      int    `json:"clientId"`
			ClientName    string `json:"clientName"`
			CreateTime    int64  `json:"createTime"`
			IdCardNo      string `json:"idCardNo"`
			IsDefaultFlag string `json:"isDefaultFlag"`
			Phone         string `json:"phone"`
			Relationship  string `json:"relationship"`
			Sex           string `json:"sex"`
			Status        string `json:"status"`
			UpdateTime    int64  `json:"updateTime"`
			UserId        int    `json:"userId"`
		} `json:"cardInfo"`
		Init       bool   `json:"init"`
		Registered bool   `json:"registered"`
		SessionKey string `json:"sessionKey"`
	} `json:"data"`
	AmPm   string `json:"amPm"`
	DoctId string `json:"doctId"`
}

type DoctorInfo struct {
	AmPm           string `json:"amPm"`
	DoctId         string `json:"doctId"`
	DoctImgUrl     string `json:"doctImgUrl"`
	DoctIntroduced string `json:"doctIntroduced"`
	DoctName       string `json:"doctName"`
	Fee            int    `json:"fee"`
	Numbers        int    `json:"numbers"`
	ScheduleId     string `json:"scheduleId"`
	SeqDoct        string `json:"seqDoct"`
	VisitDate      int64  `json:"visitDate"`
	VisitTime      string `json:"visitTime"`
	Ygzc           string `json:"ygzc"`
	Znumber        int    `json:"znumber"`
}
type DoctorMakeInfoBase struct {
	Data []DoctorMakeInfo `json:"data"`
}
type DoctorMakeInfo struct {
	AmPm           string `json:"amPm"`
	CreateTime     int64  `json:"createTime"`
	DeptId         string `json:"deptId"`
	DeptIntroduced string `json:"deptIntroduced"`
	DeptName       string `json:"deptName"`
	Dist           string `json:"dist"`
	DoctId         string `json:"doctId"`
	DoctImgUrl     string `json:"doctImgUrl"`
	DoctIntroduced string `json:"doctIntroduced"`
	DoctName       string `json:"doctName"`
	Fee            int    `json:"fee"`
	MajorDetailId  string `json:"majorDetailId"`
	MajorId        string `json:"majorId"`
	MajorName      string `json:"majorName"`
	Numbers        int    `json:"numbers"`
	ScheduleId     string `json:"scheduleId"`
	ScheduleType   string `json:"scheduleType"`
	Seq            string `json:"seq"`
	SeqDoct        string `json:"seqDoct"`
	SeqMj          string `json:"seqMj"`
	SguID          string `json:"sguID"`
	Sign           string `json:"sign"`
	SourceId       int    `json:"sourceId"`
	Status         string `json:"status"`
	TotalNumbers   int    `json:"totalNumbers"`
	UpdateTime     int64  `json:"updateTime"`
	VisitDate      int64  `json:"visitDate"`
	VisitTime      string `json:"visitTime"`
	Ygzc           string `json:"ygzc"`
}

type EncryData struct {
	Encrypt string `json:"encrypt"`
}

type MessageData struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Data    string `json:"data"`
}
