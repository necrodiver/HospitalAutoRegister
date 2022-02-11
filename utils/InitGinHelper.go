package utils

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/robertkrimen/otto/underscore"
)

func InitGin() {
	app := gin.Default()
	app.LoadHTMLGlob("./app/dist/*.html")
	app.Static("/assets", "./app/dist/assets")
	app.Static("/imgs", "./app/dist/imgs")
	app.StaticFile("/favicon.ico", "./app/dist/favicon.ico")
	app.Handle("GET", "/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"PUT", "GET", "POST", "UPDATE", "DELETE"},
		AllowHeaders:     []string{"Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Token"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := app.Group("/api")
	// 初始解析用户数据
	api.Handle("POST", "/analysis", func(c *gin.Context) {
		var jsonData Analysis
		if err := c.ShouldBindJSON(&jsonData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		USER_SIGN = jsonData.UserSign
		USER_ENCRY = jsonData.UserEncrypt
		VERSION = jsonData.XVersion
		str := DecryStr(USER_SIGN, USER_ENCRY)

		var userInfo UserData
		transErr := json.Unmarshal([]byte(str), &userInfo)
		if transErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": transErr.Error()})
			return
		}
		XTOKEN = userInfo.Data.AccessToken
		c.JSON(http.StatusOK, gin.H{
			"message": str,
		})
	})
	api.Handle("POST", "/setXTOKEN", func(c *gin.Context) {
		// var json XTOKENInfo
		// if err := c.ShouldBindJSON(&json); err != nil {
		// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		// 	return
		// }
		// XTOKEN = json.AccessToken
		c.JSON(http.StatusOK, gin.H{
			"message": nil,
		})
	})
	// 查询科室
	api.Handle("GET", "/depts", func(c *gin.Context) {
		var json Dept
		if err := c.ShouldBindQuery(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		str := getAfterdayDepartment(json.TapIndex)
		c.JSON(http.StatusOK, gin.H{
			"message": str,
		})
	})
	// 查看对应科室可预约时间
	api.Handle("GET", "/appoinmentTimes", func(c *gin.Context) {
		var json DeptTapIndex
		if err := c.ShouldBindQuery(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		str := getAppointmentTime(json)
		c.JSON(http.StatusOK, gin.H{
			"message": str,
		})
	})
	// 获取医生列表
	api.Handle("GET", "/doctorList", func(c *gin.Context) {
		var json VisitDept
		if err := c.ShouldBindQuery(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		str := GetDoctorInfo(json)
		c.JSON(http.StatusOK, gin.H{
			"message": str,
		})
	})
	// 获取当前医生的预约信息
	api.Handle("GET", "/getYyScheduleInfo", func(c *gin.Context) {
		var json YyScheduleInfo
		if err := c.ShouldBindQuery(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		str := GetYyScheduleInfo(json)
		c.JSON(http.StatusOK, gin.H{
			"message": str,
		})
	})
	// 创建订单
	api.Handle("POST", "/create", func(c *gin.Context) {
		var json OrderInfo
		if err := c.ShouldBindJSON(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if json.HzNum < 1000 {
			json.HzNum = 1000
		}
		runTime := time.Duration(json.HzNum) * time.Millisecond
		time.Sleep(runTime)
		str := CreateOrder(json)
		c.JSON(http.StatusOK, gin.H{
			"message": str,
		})
	})
	app.Run(":10087")
}
