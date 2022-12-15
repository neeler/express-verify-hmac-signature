import type { Response } from 'express';
import { RequestWithRawBody } from './RequestWithRawBody';

export function rawBodySaver(
    req: RequestWithRawBody,
    res: Response,
    buf: Buffer,
    encoding?: string
) {
    if (buf && buf.length) {
        req.rawBody = buf.toString((encoding as BufferEncoding) || 'utf8');
    }
}
