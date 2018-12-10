# Verify HMAC Signature - Express Middleware

Many API requests (webhooks, etc.) are signed with an encoded HMAC header generated using the request body and a secret. This is a simple Express middleware for verifying these types of signatures. 

### Pass the raw body through to this middleware

This middleware relies on the availability of the _raw_ body data somewhere on the request object.

The following example shows how to easily store the raw body data on the request object.

```
const express = require('express');
const bodyParser = require('body-parser');

function rawBodySaver(req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}

const app = express();
app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: () => true }));
```

### Config / Example use

`headerKey`: the header key that contains the signature  
`algorithm`: the HMAC algorithm (default `sha256`) - anything supported by `crypto.createHmac()`  
`secret`: the shared secret that the signature is signed with  
`rawBodyKey`: the key that contains the raw request body data on the request object. In the example above, this would be `rawBody`.  
`encoding`: the signature encoding (default `base64`) - any encoding supported by Node (https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings)  
`onFailure`: failure handler with a (req, res, next) function signature. (defaults is a 401 response)  

The following is an example that verifies a Shopify webhook signature.

```
const verifyHmacSignature = require('express-verify-hmac-signature');

app.use(verifyHmacSignature({
	headerKey: 'x-shopify-hmac-sha256',
	algorithm: 'sha256',
	secret: 'SHARED-WEBHOOK-SECRET',
	rawBodyKey: 'rawBody', // Assumes we stored the raw body data as in the example above
	encoding: 'base64',
	onFailure: (req, res, next) => {
		console.log("Invalid webhook signature");
		res.sendStatus(401);	
	}
});
```