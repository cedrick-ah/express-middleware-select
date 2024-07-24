# express-middleware-select

Select a middleware to execute.

You must provide as the first parameter a number which is the index of the middleware to be executed in an array of middlewares passed as the second parameter.

```typescript
import express from "express";
import { select } from "express-middleware-select";

const app = express();

app.use(
    select(
        function (req: Request) {
            if (req.headers["accept"] === "application/json") return 0;
            else return 1;
        },
        [
            function (req: Request, res: Response) {
                res.end("json");
            },
            function (req: Request, res: Response) {
                res.end("text");
            },
        ]
    )
);
```

You can also use it by passing a number as first parameter:

```typescript
app.use(
    select(1, [
        function (req: Request, res: Response) {
            res.end("json");
        },
        function (req: Request, res: Response) {
            res.end("text");
        },
    ])
);
```

You can also use it as CommonJS module.

```typescript
const { select } = require("express-middleware-select");

const app = express();

app.use(
    select(
        function (req: Request) {
            if (req.headers["accept"] === "application/json") return 0;
            else return 1;
        },
        [
            function (req: Request, res: Response) {
                res.end("json");
            },
            function (req: Request, res: Response) {
                res.end("text");
            },
        ]
    )
);
```
