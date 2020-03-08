KINESIS_STREAM_NAME=nginx-log-stream

# IAM
create_iam_role:
	awslocal iam create-role --role-name lambda-kinesis-role --assume-role-policy-document \
		file://$(PWD)/iam-role-permission.json

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
