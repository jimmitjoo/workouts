REGION=eu-north-1
PROFILE=default
STACK=materun-api
ARTIFACT_BUCKET=${STACK}-artifacts
STACK_BUCKET=${STACK}-bucket

deps:
	go get -v ./...

clean:
	rm -rf ./sign-in/sign-in
	rm -rf ./create-account/create-account

local: build
	sam local start-api

package:
	sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket ${ARTIFACT_BUCKET} --profile ${PROFILE} --region ${REGION}

deploy: build package
	aws cloudformation deploy --template-file packaged.yaml --stack-name ${STACK} --capabilities CAPABILITY_NAMED_IAM --region ${REGION} --profile ${PROFILE}

delete:
	aws cloudformation delete-stack --stack-name ${STACK} --region ${REGION} --profile ${PROFILE}

build: clean
	GOOS=linux GOARCH=amd64 go build -o sign-in/sign-in ./sign-in
	GOOS=linux GOARCH=amd64 go build -o create-account/create-account ./create-account
