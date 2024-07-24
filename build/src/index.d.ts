import { Request, Response, NextFunction } from "express";
/**
 * Returns a middleware selected by another
 * middleware.
 *
 * @param {(number|function)} selector
 *   If a number, the middleware at position number will be executed, else the next middleware will be
 *   executed first. If the selector is a function it will be executed with the req,
 *   res, and next arguments. The return of the function will be used as the
 *   selector.
 * @param {function[]} middlewares
 *   The middlewares to select.
 *
 * @return {function}
 *   The middleware selected.
 *
 * @example
 *   // Will select a middleware based on the request application/json accept
 *   // header.
 *   app.use(require('express-middleware-select')(
 *     function (req, res, next) {
 *       if (req.get('accept') === 'application/json') return 1;
 *       else return 2
 *     },
 *     [function (req, res, next) {
 *       console.log('Mime type is application/json');
 *       next()
 *     }, function (req, res, next) {
 *       console.log('Mime type is not application/json');
 *       next();
 *     }]
 *  ));
 */
export declare const select: (selector: number | ((req: Request, res: Response, next: NextFunction, ...rest: unknown[]) => number), middlewares: ((req: Request, res: Response, next: NextFunction, ...rest: unknown[]) => void)[]) => (req: Request, res: Response, next: NextFunction, ...rest: unknown[]) => void;
