package Database

import (
	"database/sql"
	"os"
)

func Connect() *sql.DB {

	username := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")

	db, err := sql.Open("mysql", username+":"+password+"@tcp("+dbHost+":3306)/"+dbName)

	if err != nil {
		panic(err)
	}

	return db
}