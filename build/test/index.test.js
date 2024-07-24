var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { select } from "../src";
import express from "express";
import request from "supertest";
import nock from "nock";
const app = express();
let server;
describe("select", () => {
    beforeAll(() => {
        const PORT = process.env.PORT || 4000;
        nock("http://localhost:" + PORT)
            .get("/json")
            .reply(200)
            .get("/text")
            .reply(200);
        const router = express.Router();
        router.get("/json", select(function (req) {
            if (req.headers["accept"] === "application/json")
                return 0;
            else
                return 1;
        }, [
            function (req, res) {
                res.end("json");
            },
            function (req, res) {
                res.end("text");
            },
        ]));
        router.get("/text", select(function (req) {
            if (req.headers["accept"] === "text/plain")
                return 0;
            else
                return 1;
        }, [
            function (req, res) {
                res.end("text");
            },
            function (req, res) {
                res.end("json");
            },
        ]));
        app.use(router);
        server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(() => resolve(), 500));
        server.close();
    }));
    it("should return json in response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .get("/json")
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.text).toMatch("json");
    }));
    it("should return text in response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .get("/text")
            .set("Accept", "text/plain");
        expect(response.status).toEqual(200);
        expect(response.text).toMatch("text");
    }));
});
