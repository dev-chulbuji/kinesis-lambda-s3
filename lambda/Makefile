LAMBDA_NAME=ProcessKinesisRecords
KINESIS_STREAM_NAME=nginx-log-stream

# IAM
create_iam_role:
	awslocal iam create-role --role-name lambda-kinesis-role --assume-role-policy-document \
		file://$(PWD)/iam-role-permission.json

# Lambda
deploy_lambda: build update_lambda_function
build:
	zip -r function.zip index.js node_modules package.json package-lock.json
create_lambda_function:
	awslocal lambda create-function --function-name $(LAMBDA_NAME) \
		--zip-file fileb://function.zip --handler index.handler --runtime nodejs12.x \
		--role arn:aws:iam::000000000000:role/lambda-kinesis-role
update_lambda_function:
	awslocal lambda update-function-code \
    --function-name  $(LAMBDA_NAME) \
	--zip-file fileb://function.zip
add_event_source:
	awslocal lambda create-event-source-mapping --function-name $(LAMBDA_NAME) \
		--event-source  arn:aws:kinesis:us-east-1:000000000000:stream/nginx-log-stream \
		--batch-size 100 --starting-position LATEST
get_evnet_source:
	awslocal lambda list-event-source-mappings --function-name $(LAMBDA_NAME) 
test_lambda:
	awslocal lambda invoke --function-name ProcessKinesisRecords --payload file://$(PWD)/input.txt out.txt

# Kinesis
create_kinesis_stream:
	awslocal kinesis create-stream --stream-name $(KINESIS_STREAM_NAME) --shard-count 1
describe_kinesis_stream:
	awslocal kinesis describe-stream --stream-name $(KINESIS_STREAM_NAME)
get_kinesis_stream_arn:
	awslocal kinesis describe-stream --stream-name $(KINESIS_STREAM_NAME) | \
		jq '.StreamDescription.StreamARN' | tr  -d "\""
get_kinesis_stream:
	awslocal kinesis list-streams
put_data_in_kinesis_stream:
	awslocal kinesis put-record --stream-name $(KINESIS_STREAM_NAME) --partition-key 1 \
		--data "Hello, this is a test."
