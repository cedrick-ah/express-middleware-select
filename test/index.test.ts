import { select } from "../src";
import { Request, Response } from "express";
import express from "express";
import request from "supertest";
import nock from "nock";
import { Server } from "http";

const app = express();
let server: Server;

describe("select", () => {
    beforeAll(() => {
        const PORT = process.env.PORT || 4000;

        nock("http://localhost:" + PORT)
            .get("/json")
            .reply(200)
            .get("/text")
            .reply(200);
        const router = express.Router();
        router.get(
            "/json",
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
        router.get(
            "/text",
            select(
                function (req: Request) {
                    if (req.headers["accept"] === "text/plain") return 0;
                    else return 1;
                },
                [
                    function (req: Request, res: Response) {
                        res.end("text");
                    },
                    function (req: Request, res: Response) {
                        res.end("json");
                    },
                ]
            )
        );
        app.use(router);
        server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });

    afterAll(async () => {
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
        server.close();
    });

    it("should return json in response", async () => {
        const response = await request(app)
            .get("/json")
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.text).toMatch("json");
    });

    it("should return text in response", async () => {
        const response = await request(app)
            .get("/text")
            .set("Accept", "text/plain");
        expect(response.status).toEqual(200);
        expect(response.text).toMatch("text");
    });
});
