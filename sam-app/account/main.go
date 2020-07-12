package main

import (
	"../libs/Account"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type postBody struct {
	ActionKey    string `json:"action_key"`
}

type body struct {
	Message string `json:"message"`
}

type User struct {
	Firstname string `json:"firstname"`
	Lastname string `json:"lastname"`
	Email string `json:"email"`
}

func main() {
	lambda.Start(handler)
}

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
			Message: "Something went wrong when fetching user data.",
		})
		statusCode = 400
	} else {
		bodyMessage, _ = json.Marshal(User{
			Email: user.Email,
		})
		statusCode = 200
	}
	
	return events.APIGatewayProxyResponse{
		Body:       string(bodyMessage),
		StatusCode: statusCode,
	}, err
}