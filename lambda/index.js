const { Parser } = require('@robojones/nginx-log-parser')
const schema = `$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" "$http_x_forwarded_for"`

exports.handler = function(event, context, callback) {
    event.Records.forEach(record => {
        const payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
		const jsonData = JSON.parse(payload)

		const containerName = jsonData.container_name
		const accessLog = jsonData.log

		const parser = new Parser(schema)
		const result = parser.parseLine(accessLog)

        console.log('result:', result)
    });
};
