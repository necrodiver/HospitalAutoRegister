package utils

import (
	"encoding/json"
	"fmt"
)

func GetUserData() UserData {
	userData := DecryStr(USER_SIGN, USER_ENCRY)
	var userInfo UserData
	transErr := json.Unmarshal([]byte(userData), &userInfo)
	if transErr != nil {
		fmt.Println("转换出错：", transErr)
		return UserData{}
	}
	return userInfo
}
