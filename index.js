const crypto = require('crypto');

function verifyHmacSignature({
    algorithm = 'sha256',
    secret = 'secret',
    encoding = 'base64',
    getDigest = () => undefined,
    getBody = req => (req.body ? JSON.stringify(req.body) : undefined),
    onFailure = (req, res) => res.sendStatus(401)
} = {}) {
    return (req, res, next) => {
        const receivedDigest = getDigest(req);
        if (!receivedDigest) return onFailure(req, res, next);

        const computedHmac = crypto.createHmac(algorithm, secret);
        const body = getBody(req);
        if (body) {
            computedHmac.update(body);
        }

        if (
            !crypto.timingSafeEqual(
                Buffer.from(receivedDigest),
                Buffer.from(computedHmac.digest(encoding))
            )
        ) {
            return onFailure(req, res, next);
        }

        next();
    };
}

module.exports = verifyHmacSignature;
