const { Parser } = require('@robojones/nginx-log-parser')

exports.handler = function(event, context, callback) {
    event.Records.forEach(record => {
        const payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
		var rowData = ''

		console.log(`Decoded paylog: ${payload}`)

		try {
			rowData = JSON.parse(payload).log
		} catch (e) {
			return callback(e)
		}

		const schema = `$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" "$http_x_forwarded_for"`
		const parser = new Parser(schema)
		const result = parser.parseLine(rowData)

        console.log('result:', result)
    });
};
