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
	Email     string `json:"email"`
	SignInKey string `json:"sign_in_key"`
	Message   string `json:"message"`
}

type postBody struct {
	Email    string `json:"email"`
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
			Message: "Check your email spelling, it seems to be an invalid email address.",
		})
		statusCode = 400

		return events.APIGatewayProxyResponse{
			Body:       string(bodyMessage),
			StatusCode: statusCode,
		}, err
	}

	userKey, err := Account.SignIn(postData.Email, postData.Password)

	if err != nil {
		bodyMessage, _ = json.Marshal(body{
			Message: err.Error(),
		})
		statusCode = 400
	}

	if userKey != "" {
		user, err := Account.Info(userKey)
		if err != nil {
			bodyMessage, _ = json.Marshal(body{
				Message: err.Error(),
			})
			statusCode = 400
		} else {
			bodyMessage, _ = json.Marshal(body{
				Email:     user.Email,
				SignInKey: userKey,
				Message:   "You could successfully sign in.",
			})
			statusCode = 201
		}
	} else {
		bodyMessage, _ = json.Marshal(body{
			Message: "Wrong credentials.",
		})
		statusCode = 500
	}

	return events.APIGatewayProxyResponse{
		Body:       string(bodyMessage),
		StatusCode: statusCode,
	}, err
}
