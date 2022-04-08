package utils

import (
	"encoding/json"
	"time"

	"github.com/imroc/req"
	_ "github.com/robertkrimen/otto/underscore"
)

var XTOKEN = ""

func reloadMain() {
	timeSecond := time.Millisecond * 50
	time.Sleep(timeSecond)
}

// 获取科室列表
func getAfterdayDepartment(tapIndex string) string {
	url := "/api/appointmentInfo/getAfterdayDepartment.json"
	dataStr := "{\"tapIndex\":" + tapIndex + "}"
	encryData, _ := EncryTokenInGet(dataStr, XTOKEN, url)
	param := req.Param{
		"tapIndex": tapIndex,
	}
	res := GetHttpData(encryData, param)
	return res
}

// 获取可预约时间
func getAppointmentTime(data DeptTapIndex) string {
	url := "/api/system/getAppointmentTime.json"
	dataStr := "{\"distCode\":\"" + data.TapIndex + "\",\"deptCode\":\"" + data.DeptId + "\"}"
	encryData, _ := EncryTokenInGet(dataStr, XTOKEN, url)
	param := req.Param{
		"distCode": data.TapIndex,
		"deptCode": data.DeptId,
	}
	res := GetHttpData(encryData, param)
	return res
}

// func getData() bool {
// 	// 获取医生信息
// 	docInfo := GetDoctorInfo()
// 	if docInfo.AmPm == "" {
// 		fmt.Println("没有医生信息")
// 		return true
// 	}
// 	// 查询当前医生的预约信息
// 	docMakeInfo := getYyScheduleInfo(docInfo)
// 	if docMakeInfo.AmPm == "" {
// 		fmt.Println("没有医生对应的预约信息")
// 		return true
// 	}
// 	loopNum := 0
// 	timeSecond := time.Duration(RUN_HZ) * time.Millisecond
// 	if docInfo.AmPm != "" {
// 		// 定时循环执行挂号
// 		for range time.Tick(timeSecond) {
// 			loopNum++
// 			fmt.Println("执行抢票：", loopNum)
// 			createOrder(docInfo, docMakeInfo)
// 		}
// 	}
// 	OutSystem()
// 	return false
// }

func GetDoctorInfo(data VisitDept) string {
	url := "/api/appointmentInfo/getYyDoctorInfo.json"
	dataStr := "{\"time\":\"" + data.VisitDate + "\",\"deptCode\":" + data.DeptId + ",\"tapIndex\":" + data.TapIndex + "}"
	encryData, _ := EncryTokenInGet(dataStr, XTOKEN, url)
	param := req.Param{
		"time":     data.VisitDate,
		"deptCode": data.DeptId,
		"tapIndex": data.TapIndex,
	}
	res := GetHttpData(encryData, param)
	return res
	// if res == "" {
	// 	return DoctorInfo{}
	// }
	// var docInfo DoctorInfoBase
	// transErr := json.Unmarshal([]byte(res), &docInfo)
	// if transErr != nil {
	// 	fmt.Println("转换出错：", transErr)
	// }
	// for _, item := range docInfo.Data {
	// 	if item.Fee >= VISIT_MIN_MONEY && item.Fee <= VISIT_MAX_MONEY && item.Znumber > 0 {
	// 		return item
	// 	}
	// }
	// return DoctorInfo{}
}

// 当前医生的预约信息
func GetYyScheduleInfo(data YyScheduleInfo) string {
	url := "/api/appointmentInfo/getYyScheduleInfo.json"
	dataStr := "{\"tapIndex\":" + data.TapIndex + ",\"deptId\":" + data.DeptId + ",\"doctId\":\"" + data.DoctId + "\",\"time\":\"" + data.VisitDate + "\"}"
	encryData, _ := EncryTokenInGet(dataStr, XTOKEN, url)
	param := req.Param{
		"tapIndex": data.TapIndex,
		"deptId":   data.DeptId,
		"doctId":   data.DoctId,
		"time":     data.VisitDate,
	}
	res := GetHttpData(encryData, param)
	return res
	// if res == "" {
	// 	return DoctorMakeInfo{}
	// }
	// var docMakeBase DoctorMakeInfoBase
	// transErr := json.Unmarshal([]byte(res), &docMakeBase)
	// if transErr != nil {
	// 	fmt.Println("转换出错：", transErr)
	// }
	// if len(docMakeBase.Data) == 0 {
	// 	return DoctorMakeInfo{}
	// }
	// return docMakeBase.Data[0]
}

func CreateOrder(data OrderInfo) string {
	url := "/api/appointmentRecord/YysamedayAppointment.json"
	dataStr := "{\"patientId\":" + data.PatientId + ",\"scheduleId\":\"" + data.ScheduleId + "\",\"visitDate\":\"" + data.VisitDate + "\",\"deptId\":\"" + data.DeptId + "\",\"sguId\":\"" + data.SguId + "\",\"dist\":\"" + data.TapIndex + "\"}"
	encryData, _ := EncryTokenInPost(dataStr, XTOKEN, url)
	res := PostHttpDataToJson(encryData)
	return res
	// if res != "" {
	// 	var msgData MessageData
	// 	transErr := json.Unmarshal([]byte(res), &msgData)
	// 	if transErr != nil {
	// 		fmt.Println("转换出错：", transErr)
	// 		OutSystem()
	// 	}
	// 	// 挂号成功
	// 	if msgData.Status == 0 {
	// 		fmt.Println("挂号成功：", msgData.Data)
	// 		OutSystem()
	// 	} else if msgData.Status < -10 || msgData.Status > -1 {
	// 		fmt.Println("挂号失败：系统繁忙,请稍后再试")
	// 	} else {
	// 		fmt.Println("挂号失败：", msgData.Message)
	// 	}
	// 	return
	// }
}

func JsonToMap(str string) map[string]interface{} {

	var tempMap map[string]interface{}

	err := json.Unmarshal([]byte(str), &tempMap)

	if err != nil {
		panic(err)
	}

	return tempMap
}
