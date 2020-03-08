# kinesis-lambda-s3
Establish centralized logging pipeline.

## Outline
- only Nginx access log
- send log to kinesis stream every minute
- convert access log to structured log in json format with human-readable title
- store in s3 for Athena func
```sh
nginx -> (fluent bit) -> kinesis stream -> lambda -> s3
```
## Skill
- terraform
- localstack
- docker