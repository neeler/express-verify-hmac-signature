import {
    BinaryLike,
    BinaryToTextEncoding,
    createHmac,
    KeyObject,
    timingSafeEqual,
} from 'crypto';
import type { Request, RequestHandler } from 'express';

export interface VerifyHmacSignatureConfig<TRequest extends Request> {
    algorithm: string;
    secret: BinaryLike | KeyObject;
    encoding: BinaryToTextEncoding;
    getDigest: (
        req: TRequest
    ) =>
        | WithImplicitCoercion<string | Uint8Array | readonly number[]>
        | undefined;
    getBody?: (req: TRequest) => BinaryLike | undefined;
    onFailure?: RequestHandler;
}

export function verifyHmacSignature<TRequest extends Request = Request>({
    algorithm = 'sha256',
    secret = 'secret',
    encoding = 'base64',
    getDigest = () => undefined,
    getBody = (req) => (req.body ? JSON.stringify(req.body) : undefined),
    onFailure = (req, res) => res.sendStatus(401),
}: VerifyHmacSignatureConfig<TRequest>) {
    return ((req: TRequest, res, next) => {
        const receivedDigest = getDigest(req);
        if (!receivedDigest) return onFailure(req, res, next);

        const computedHmac = createHmac(algorithm, secret);
        const body = getBody(req);
        if (body) {
            computedHmac.update(body);
        }

        try {
            if (
                !timingSafeEqual(
                    Buffer.from(receivedDigest),
                    Buffer.from(computedHmac.digest(encoding))
                )
            ) {
                return onFailure(req, res, next);
            }

            next();
        } catch (err) {
            return onFailure(req, res, next);
        }
    }) as RequestHandler;
}
