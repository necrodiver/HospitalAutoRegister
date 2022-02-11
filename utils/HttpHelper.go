package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/imroc/req"
	"github.com/robertkrimen/otto"
)

func GetHttpData(tokenStr string, param req.Param) string {
	return httpBase(tokenStr, param, "GET")
}

func PostHttpDataToJson(tokenStr string) string {
	return httpBase(tokenStr, req.Param{}, "POST")
}

func httpBase(data string, param req.Param, httpType string) string {
	vm := otto.New()
	_, err := vm.Run(string(WxUtilBytes))
	if err != nil {
		panic(err)
	}

	if data == "" {
		panic("无效数据")
	}

	if strings.ToUpper(httpType) == "GET" {
		var baseData BaseData
		transErr := json.Unmarshal([]byte(data), &baseData)
		if transErr != nil {
			panic(transErr)
		}
		authHeader := joinHeader(baseData, BaseDataPost{}, false)
		r, err := req.Get(baseData.Url, authHeader, param)
		var encryData EncryData
		r.ToJSON(&encryData)
		if err != nil {
			fmt.Println(err)
		}
		if encryData.Encrypt == "" {
			var encryData2 interface{}
			r.ToJSON(&encryData2)
			log.Printf("%s：%+v", "----请求结果--错误", encryData2)
			return ""
		}
		decryStr := DecryStr(baseData.Header.XSign, encryData.Encrypt)
		return decryStr
	} else {
		var baseData BaseDataPost
		transErr := json.Unmarshal([]byte(data), &baseData)
		if transErr != nil {
			panic(transErr)
		}
		authHeader := joinHeader(BaseData{}, baseData, true)
		r, err := req.Post(baseData.Url, authHeader, baseData.Data)
		var encryData EncryData
		r.ToJSON(&encryData)
		if err != nil {
			fmt.Println(err)
		}
		if encryData.Encrypt == "" {
			var encryData2 interface{}
			r.ToJSON(&encryData2)
			log.Printf("%s：%+v", "----请求结果--错误", encryData2)
			return ""
		} else {
			decryStr := DecryStr(baseData.Header.XSign, encryData.Encrypt)
			return decryStr
		}
	}
}

func joinHeader(baseData BaseData, baseDataPost BaseDataPost, isPost bool) req.Header {
	contentLength := ""
	XTimestamp := ""
	XSign := ""
	XNonce := ""
	XToken := ""
	if isPost {
		XTimestamp = baseDataPost.Header.XTimestamp
		XSign = baseDataPost.Header.XSign
		XNonce = baseDataPost.Header.XNonce
		XToken = baseDataPost.Header.XToken
	} else {
		XTimestamp = baseData.Header.XTimestamp
		XSign = baseData.Header.XSign
		XNonce = baseData.Header.XNonce
		XToken = baseData.Header.XToken
	}
	header := req.Header{
		"Accept":          "*/*",
		"x-timestamp":     XTimestamp,
		"Accept-Encoding": "gzip, deflate, br",
		"Accept-Language": "zh-cn",
		"Content-Type":    "application/json;charset=UTF-8",
		"Content-Length":  contentLength,
		"Host":            "bdkq.leanpay.cn",
		"Referer":         "https://servicewechat.com/wxf47aa38d871be854/109/page-frame.html",
		"User-Agent":      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac",
		"x-sign":          XSign,
		"x-nonce":         XNonce,
		"x-token":         XToken,
	}

	return header
}

func OutSystem() {
	var inputStr string
	fmt.Scanf("按Enter退出：%s", &inputStr)
	panic("退出")
}
