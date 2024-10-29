const { auth } = require("../Auth")
const { Auth } = require("../helper/Authentication")

jest.mock("../helper/Authentication", () => ({
    Auth: {
        authentication: jest.fn(),
        validation: jest.fn()
    }
}))

const res = {
    json: jest.fn(),
    status: jest.fn()
}

const req = {
    user: {
        id: 1
    },
    body: {
        data: {
            email: "azenalabidin@gmail.com",
            password: "zaenalabidin123"
        }
    },
    params: {
        id: 1
    }
}

const next = jest.fn()

describe("Authenticate", () => {
    it("Should authentication", async () => {
        Auth.authentication.mockReturnValue("THIS_TOKEN")

        await auth(req, res, next)

        expect(res.json).toHaveBeenCalled()
    })
    it("Should error", async () => {
        Auth.authentication.mockImplementation(() => {
            throw new Error()
        })

        await auth(req, res, next)

        expect(next).toHaveBeenCalled()
    })
})