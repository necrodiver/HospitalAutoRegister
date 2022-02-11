package utils

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/go-ini/ini"
)

// 配置文件读取
var (
	Cfg             *ini.File
	USER_ENCRY      string
	USER_SIGN       string
	PATIENT_ID      string
	VISIT_DATE      string
	DEPT_ID         string
	VISIT_MIN_MONEY int
	VISIT_MAX_MONEY int
	VERSION         string
	RUN_HZ          int
)

func InitINI() {
	var err error
	filePath := GetAPPRootPath() + "/conf/app.ini"
	Cfg, err = ini.Load(filePath)
	if err != nil {
		Cfg, err = ini.Load("conf/app.ini")
		if err != nil {
			log.Fatalf("Fail to parse 'conf/app.ini': %v", err)
		}
	}
	loadApp()
}

// LoadApp 读取APP
func loadApp() {
	sec, err := Cfg.GetSection("app")
	if err != nil {
		log.Fatalf("Fail to get section 'app': %v", err)
	}
	USER_ENCRY = sec.Key("USER_ENCRY").MustString("")
	USER_SIGN = sec.Key("USER_SIGN").MustString("")
	PATIENT_ID = sec.Key("PATIENT_ID").MustString("")
	VISIT_DATE = sec.Key("VISIT_DATE").MustString("")
	DEPT_ID = sec.Key("DEPT_ID").MustString("")
	VERSION = sec.Key("VERSION").MustString("")
	RUN_HZ = sec.Key("RUN_HZ").MustInt(50)
	VISIT_MIN_MONEY = sec.Key("VISIT_MIN_MONEY").MustInt(0)
	VISIT_MAX_MONEY = sec.Key("VISIT_MAX_MONEY").MustInt(100)

	if VISIT_MIN_MONEY < 0 {
		VISIT_MIN_MONEY = 0
	}
	if VISIT_MAX_MONEY < 0 {
		VISIT_MAX_MONEY = 0
	}
	if VISIT_MIN_MONEY > 10000 {
		VISIT_MIN_MONEY = 10000
	}
	if VISIT_MAX_MONEY > 10000 {
		VISIT_MAX_MONEY = 10000
	}
	if VISIT_MIN_MONEY == 0 && VISIT_MIN_MONEY == VISIT_MAX_MONEY {
		VISIT_MIN_MONEY = 0
		VISIT_MAX_MONEY = 100
	}
	if VISIT_MIN_MONEY > VISIT_MAX_MONEY {
		VISIT_MIN_MONEY = 0
		VISIT_MAX_MONEY = 100
	}

	fmt.Println("========== 初始化配置 ===========")
	fmt.Println(">> 患者Id：", PATIENT_ID)
	fmt.Println(">> 挂号日期：", VISIT_DATE)
	fmt.Println(">> 科室ID：", DEPT_ID)
	fmt.Printf(">> 挂号金额：%d <= 金额 <= %d", VISIT_MIN_MONEY, VISIT_MAX_MONEY)
	fmt.Println()
	fmt.Println(">> 执行时间间隔：", RUN_HZ, "ms")
	fmt.Println("================================")
}

func GetAPPRootPath() string {
	file, err := exec.LookPath(os.Args[0])
	if err != nil {
		return ""
	}
	p, err := filepath.Abs(file)
	if err != nil {
		return ""

	}
	return filepath.Dir(p)
}
