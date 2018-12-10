const crypto = require('crypto');

function verifyHmacSignature({
	headerKey = 'x-hmac-sha256',
	algorithm = 'sha256',
	secret = 'secret',
	rawBodyKey = 'rawBody',
	encoding = 'base64',
	onFailure = (req, res, next) => res.sendStatus(401)
														 } = {}) {
	return (req, res, next) => {
		const digest = crypto
			.createHmac(algorithm, secret)
			.update(req[rawBodyKey])
			.digest(encoding);

		if (digest !== req.headers[headerKey]) {
			return onFailure(req, res, next);
		}

		next();
	};
}

module.exports = verifyHmacSignature;