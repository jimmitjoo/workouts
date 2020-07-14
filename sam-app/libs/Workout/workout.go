package Workout

import (
	"../Database"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"log"
)

type WorkoutBody struct {
	StartingAt  string  `json:"starting_at"`
	Activity    string  `json:"activity"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	UserId      int     `json:"user_id"`
}

func Fetch(latitude float64, longitude float64, todayDate string, untilDate string) ([]WorkoutBody, error) {
	db := Database.Connect()

	var query = "SELECT id, starting_at, activity, `name`, description, latitude, longitude FROM workouts " +
		"WHERE starting_at >= '" + todayDate + "' AND starting_at < '" + untilDate + "' LIMIT 25"

	rows, err := db.Query(query)
	if err != nil {
		log.Println(query)
		panic(err)
	}

	var workouts []WorkoutBody

	defer rows.Close()
	for rows.Next() {
		var id int
		var starting_at string
		var activity string
		var name sql.NullString
		var description sql.NullString
		var lat sql.NullFloat64
		var long sql.NullFloat64

		err = rows.Scan(&id, &starting_at, &activity, &name, &description, &lat, &long)
		if err != nil {
			log.Println("Scanning rows went wrong")
			panic(err)
		}

		var workoutName = ""
		if name.Valid {
			workoutName = name.String
		}
		var workoutDescription = ""
		if description.Valid {
			workoutDescription = description.String
		}
		var workoutLatitude float64
		if lat.Valid {
			workoutLatitude = lat.Float64
		}
		var workoutLongitude float64
		if long.Valid {
			workoutLongitude = long.Float64
		}

		var workout = WorkoutBody{
			StartingAt:  starting_at,
			Activity:    activity,
			Name:        workoutName,
			Description: workoutDescription,
			Latitude:    workoutLatitude,
			Longitude:   workoutLongitude,
		}
		workouts = append(workouts, workout)
	}

	return workouts, nil
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
