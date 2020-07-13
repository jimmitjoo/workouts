package main

import (
	"../libs/Account"
	"../libs/Workout"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(handler)
}

type body struct {
	Id int `json:"id"`
	Message string `json:"message"`
}

type postBody struct {
	StartingAt string `json:"starting_at"`
	Activity string `json:"activity"`
	Name string `json:"name"`
	Description string `json:"description"`
	Latitude float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	ActionKey string `json:"action_key"`
}

type User struct {
	Id int `json:"id"`
	Firstname string `json:"firstname"`
	Lastname string `json:"lastname"`
	Email string `json:"email"`
}

// handler is the Lambda function handler
func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	var bodyMessage []byte
	var statusCode int
	var err error = nil

	var postData postBody
	err = json.Unmarshal([]byte(request.Body), &postData)
	if err != nil {
		bodyMessage, _ = json.Marshal(body{
			Message: "Invalid postdata.",
		})
		statusCode = 400
	}

	user, err := Account.Info(postData.ActionKey)
	if err != nil {
		bodyMessage, _ = json.Marshal(body{
			Message: "User not found.",
		})
		statusCode = 400
	}

	var workoutData Workout.WorkoutBody
	workoutData.StartingAt = postData.StartingAt
	workoutData.Activity = postData.Activity
	workoutData.Name = postData.Name
	workoutData.Description = postData.Description
	workoutData.Latitude = postData.Latitude
	workoutData.Longitude = postData.Longitude
	workoutData.UserId = user.Id
	workoutId, err := Workout.Create(workoutData)
	if err != nil {
		bodyMessage, _ = json.Marshal(body{
			Message: "Workout could not be created.",
		})
		statusCode = 400
	} else {
		bodyMessage, _ = json.Marshal(body{
			Id: workoutId,
			Message: "Workout created!",
		})
		statusCode = 201
	}


	return events.APIGatewayProxyResponse{
		Body:       string(bodyMessage),
		StatusCode: statusCode,
	}, err
}