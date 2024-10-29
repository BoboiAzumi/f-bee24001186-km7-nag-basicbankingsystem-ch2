const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { Authentication } = require("../Authentication")
const { UsersProfilesService } = require("../UsersProfiles")

jest.mock("jsonwebtoken")
jest.mock("bcrypt")
jest.mock("../UsersProfiles")

describe("Authentication", () => {
    let auth, mockUser;

    beforeEach(() => {
        auth = new Authentication();
        mockUser = {
            id: "user123",
            email: "test@example.com",
            password: "hashed_password"
        };
        UsersProfilesService.mockImplementation(() => ({
            findFirst: jest.fn()
        }));
    });

    describe("authentication", () => {
        it("should throw an error if email is not found", async () => {
            auth.UsersProfiles.findFirst.mockResolvedValue(null);
            
            await expect(auth.authentication("test@example.com", "password"))
                .rejects
                .toThrow("Email not found");
        });

        it("should throw an error if password is wrong", async () => {
            auth.UsersProfiles.findFirst.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(auth.authentication("test@example.com", "wrong_password"))
                .rejects
                .toThrow("Password is wrong");
        });

        it("should return a token if email and password are correct", async () => {
            auth.UsersProfiles.findFirst.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("fake_jwt_token");

            const token = await auth.authentication("test@example.com", "password");
            expect(token).toBe("fake_jwt_token");
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: mockUser.id },
                auth.secret,
                { algorithm: "HS256", expiresIn: "24h" }
            );
        });
    });

    describe("validation", () => {
        it("should return false if token is not provided", async () => {
            const result = await auth.validation(null);
            expect(result).toBe(false);
        });

        it("should return false if token is invalid", async () => {
            jwt.verify.mockImplementation(() => { throw new Error("Invalid token"); });

            const result = await auth.validation("invalid_token");
            expect(result).toBe(false);
        });

        it("should return false if user is not found", async () => {
            jwt.verify.mockReturnValue({ id: "user123" });
            auth.UsersProfiles.findFirst.mockResolvedValue(null);

            const result = await auth.validation("valid_token");
            expect(result).toBe(false);
        });

        it("should return token data if token is valid and user exists", async () => {
            jwt.verify.mockReturnValue({ id: mockUser.id });
            auth.UsersProfiles.findFirst.mockResolvedValue(mockUser);

            const result = await auth.validation("valid_token");
            expect(result).toEqual({ id: mockUser.id });
        });
    });
});
