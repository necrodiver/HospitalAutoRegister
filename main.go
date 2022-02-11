package main

import (
	utils "hospital-auto-register/utils"

	_ "github.com/robertkrimen/otto/underscore"
)

func init() {
	// utils.InitINI()
}

func main() {
	utils.InitGin()
}
