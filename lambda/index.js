const { Parser } = require('@robojones/nginx-log-parser')
const endpoints = {
	'Firehose': 'http://host.docker.internal:4206',
	'Kinesis': 'http://host.docker.internal:4207',
	'Lambda': 'http://host.docker.internal:4208',
	'S3': 'http://host.docker.internal:4211',
};
const AWS = require('node-localstack')(endpoints);
const s3 = new AWS.S3();

const SCHEMA = `$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" "$http_x_forwarded_for"`

const BUCKET_NAME = 'nginx-log'

const getObject = async (params) => {
	return new Promise((resolve, reject) => {
		s3.getObject(params, (err, data) => {
			if (err) return reject(err);

			contentType = data.ContentType;
			resolve(data);
		})
	});
}

const upload = (key, data) => {
	const params = {
		ACL: 'public-read',
		CacheControl: 'max-age=2592000',
		Bucket: BUCKET_NAME,
		ContentType: contentType,
		key,
		Body: data
	};

	return new Promise((resolve, reject) => {
		s3.upload(params, (err, data) => {
			if (err) return reject(err);

			return resolve(`${params.Bucket}.s3.amazonaws.com/${params.Key}`);
		});
	});
};

const getS3Path = (dateStr) => {
	const validDate = dateStr.split(':')[0]
	const dateObj = new Date(validDate)
	const year = dateObj.getFullYear()
	const month = dateObj.getMonth() + 1
	const day = dateObj.getDate()

	return `/${year}/${month}/${day}/access.log`
}

exports.handler = async (event, context, callback) => {
	var rtv = []

	event.Records.forEach(async (record) => {
		const payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
		const jsonData = JSON.parse(payload)

		console.log(payload)

		const containerName = jsonData.container_name
		const accessLog = jsonData.log

		const parser = new Parser(SCHEMA)
		const result = parser.parseLine(accessLog)

		const logDate = result.time_local
		const key = getS3Path(logDate)

		const existData = await getObject({Bucket: BUCKET_NAME, Key: key})
		// const uploadKey = await upload(key, JSON.stringify(result))

		console.log(`key :: ${key}`)
		console.log(`getObject rtv :: ${rtv}`)
		// console.log(`uploadKey :: ${uploadKey}`)

		rtv.push(uploadKey)
	});

	callback(null, `result :: ${rtv}`)
};
