# Verify HMAC Signature - Express Middleware

Many API requests (webhooks, etc.) are signed with an encoded HMAC header generated using the request body and a secret. This is a simple Express middleware for verifying these types of signatures. 

### Config / Example use

`header`: the header key that contains the signature.  
`algorithm`: the HMAC algorithm (anything supported by `crypto.createHmac()`). Defaults to `sha256`.  
`secret`: the shared secret that the signature is signed with.  
`getDigest`: function that receives the request object and returns the signature.  
`getBody`: function that receives the request object and returns the raw/Stringified request body. Defaults to `req => (req.body ? JSON.stringify(req.body) : undefined)`.    
`encoding`: the signature encoding (any encoding supported by Node https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings). Defaults to `base64`.  
`onFailure`: failure handler with a (req, res, next) function signature. Defaults to `(req, res) => res.sendStatus(401)`.  

The following is an example that verifies a Shopify webhook signature.

```
const verifyHmacSignature = require('express-verify-hmac-signature');

app.use(verifyHmacSignature({
	algorithm: 'sha256',
	secret: 'SHARED-WEBHOOK-SECRET',
	getDigest: req => req.headers['x-shopify-hmac-sha256'],
	getBody: req => (req.body ? JSON.stringify(req.body) : undefined),
	encoding: 'base64',
	onFailure: (req, res, next) => {
		console.log("Invalid webhook signature");
		res.sendStatus(401);	
	}
});
```
