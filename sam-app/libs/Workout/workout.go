package Workout

import (
	"../Database"
	_ "github.com/go-sql-driver/mysql"
	"log"
)


type WorkoutBody struct {
	StartingAt string `json:"starting_at"`
	Activity string `json:"activity"`
	Name string `json:"name"`
	Description string `json:"description"`
	Latitude float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	UserId int `json:"user_id"`
}

func Create(data WorkoutBody) (int, error) {

	db := Database.Connect()

	stmt, err := db.Prepare("INSERT workouts SET starting_at=?, activity=?, user_id=?, `name`=?, description=?, latitude=?, longitude=?")
	if err != nil {
		log.Print("Error in Prepare")
		return 0, err
	}
	defer stmt.Close()

	res, err := stmt.Exec(data.StartingAt, data.Activity, data.UserId, data.Name, data.Description, data.Latitude, data.Longitude)
	if err != nil {
		log.Print("Error in Exec")
		return 0, err
	}

	insertedId, err := res.LastInsertId()
	if err != nil {
		log.Print("Error in LastInsertId")
		return 0, err
	}

	return int(insertedId), nil
}