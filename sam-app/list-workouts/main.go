package main

import (
	"../libs/Workout"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"log"
	"strconv"
)

type body struct {
	Workouts []Workout.WorkoutBody `json:"workouts"`
	Message  string                `json:"message"`
}

type postBody struct {
	Latitude  string `json:"latitude"`
	Longitude string `json:"longitude"`
	TodayDate string `json:"today_date"`
	UntilDate string  `json:"until_date"`
}

func main() {
	lambda.Start(handler)
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	var bodyMessage []byte
	var statusCode int
	var err error = nil

	var postData postBody
	log.Print(request.Body)
	err = json.Unmarshal([]byte(request.Body), &postData)
	if err != nil {
		bodyMessage, _ = json.Marshal(body{
			Message: "Invalid postdata.",
		})
		statusCode = 400
	} else {
		lat, err := strconv.ParseFloat(postData.Latitude, 64)
		if err != nil {
			panic(err)
		}
		long, err := strconv.ParseFloat(postData.Longitude, 64)
		if err != nil {
			panic(err)
		}

		workouts, err := Workout.Fetch(lat, long, postData.TodayDate, postData.UntilDate)
		if err != nil {
			bodyMessage, _ = json.Marshal(body{
				Message: "Could not fetch workouts.",
			})
			statusCode = 400
		} else {
			bodyMessage, _ = json.Marshal(body{
				Workouts: workouts,
			})
			statusCode = 200
		}
	}

	return events.APIGatewayProxyResponse{
		Body:       string(bodyMessage),
		StatusCode: statusCode,
	}, err
}
