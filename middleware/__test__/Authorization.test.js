const { Authorization } = require("../Authorization");
const { auth } = require("../helper/AuthorizationInstance")

jest.mock("../helper/AuthorizationInstance");

describe("Authorization Middleware", () => {
    let req, res, next, authInstance;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it("should respond with 401 if authorization header is missing", async () => {
        await Authorization(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ status: "UNAUTHORIZED" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should respond with 401 if token is invalid", async () => {
        req.headers.authorization = "Bearer invalid_token";
        auth.validation.mockResolvedValue({});

        await Authorization(req, res, next);

        expect(auth.validation).toHaveBeenCalledWith("invalid_token");
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ status: "UNAUTHORIZED" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next and set req.user if token is valid", async () => {
        req.headers.authorization = "Bearer valid_token";
        const mockUser = { id: "user123" };
        auth.validation.mockResolvedValue(mockUser);

        await Authorization(req, res, next);

        expect(auth.validation).toHaveBeenCalledWith("valid_token");
        expect(req.user).toEqual({ id: mockUser.id });
        expect(next).toHaveBeenCalled();
    });
});
