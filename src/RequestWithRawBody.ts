import type { Request } from 'express';

export interface RequestWithRawBody extends Request {
    rawBody: string;
}
