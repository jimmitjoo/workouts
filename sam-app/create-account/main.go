package main

import (
	"../libs/Account"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	_ "github.com/go-sql-driver/mysql"
	"regexp"
)

func main() {
	lambda.Start(handler)
}

type body struct {
	Id int64 `json:"id"`
	Message string `json:"message"`
}

type postBody struct {
	Name string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
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

	var emailRegexp = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")

	if !emailRegexp.MatchString(postData.Email) {
		bodyMessage, _ = json.Marshal(body{
			Message: "Invalid email.",
		})
		statusCode = 400


		return events.APIGatewayProxyResponse{
			Body:       string(bodyMessage),
			StatusCode: statusCode,
		}, err
	}

	if len(postData.Password) < 6 {
		bodyMessage, _ = json.Marshal(body{
			Message: "Your password has to be atleast 6 characters.",
		})
		statusCode = 400


		return events.APIGatewayProxyResponse{
			Body:       string(bodyMessage),
			StatusCode: statusCode,
		}, err
	}

	if Account.Exists(postData.Email) {
		bodyMessage, _ = json.Marshal(body{
			Message: "This account seems to already exist.",
		})
		statusCode = 403


		return events.APIGatewayProxyResponse{
			Body:       string(bodyMessage),
			StatusCode: statusCode,
		}, err
	}

	userId, err := Account.SignUp(postData.Email, postData.Password)

	if userId > 0 {
		bodyMessage, _ = json.Marshal(body{
			Id: userId,
			Message: "Your account is successfully created.",
		})
		statusCode = 201
	} else {
		bodyMessage, _ = json.Marshal(body{
			Message: "Something went wrong.",
		})
		statusCode = 500
	}

	return events.APIGatewayProxyResponse{
		Body:       string(bodyMessage),
		StatusCode: statusCode,
	}, err
}