const userController = require("../controllers/user.controller");
const httpMocks = require("node-mocks-http");
const bcrypt = require("bcrypt");
const User = require("../models/index").User
const generateToken = require("../middleware/auth").generateToken;

jest.mock("../models");
jest.mock("../middleware/auth");

let req, res;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    bcrypt.compareSync = jest.fn().mockImplementation(() => true);
});

describe("User Controller signUp", () => {
    it("user register should return 400 ", async() => {
        const email = "email@gmail.com";
        User.findOne.mockResolvedValue({ email: email });
        await userController.signUp(req, res);
        expect(res.statusCode).toBe(400);
    });

    it('should return 200', async () => {
        try{
            User.findOne.mockResolvedValue(null)    
        User.create.mockResolvedValue({ 
            email : "helo"
        })  
        await userController.signUp(req, res);
        }catch{
            expect(res.statusCode).toBe(200);
        }
        
     })
    it("User register should return 500", async() => {
        const errData = {
            status: 503,
            message: "Internal server error"
        }
        try {
            User.findOne.mockResolvedValue(errData)
            await userController.signUp(req, res)
        } catch {
            expect(res.statusCode).toBe(503)
        }
    });

});

describe("userController signIn", () => {
    beforeAll(() => {
        bcrypt.hashSync = jest.fn();
        generateToken.mockReturnValue("get Token");
    });

    it("sign should return 400 if email not found", async() => {
        User.findOne.mockResolvedValue(null);
        await userController.signIn(req, res);
        expect(res.statusCode).toBe(400);
    });

    it("User login should return 400 if password not match", async() => {
        const data = {
            email: "email",
            password: "wrongpassword",
        };
        User.findOne.mockResolvedValue(data);
        bcrypt.compareSync = jest.fn().mockImplementation(() => false);
        await userController.signIn(req, res);
        expect(res.statusCode).toBe(400);
    });

    it("User login should return 200 ", async() => {
        User.findOne.mockResolvedValue({ user: "login" });
        userController.signIn(req, res);
        expect(res.statusCode).toBe(200);
    });

    it("User login should return 500", async() => {
        const errData = {
            status: 503,
            message: "Internal server error"
        }
        try {
            User.findOne.mockResolvedValue(errData)
            await userController.signIn(req, res)
        } catch {
            expect(res.statusCode).toBe(503)
        }
    });
});

describe("userController updateUser", () => {
    it("User update should return 200 updated", async() => {
        User.update.mockResolvedValue({ user: "user" });
        await userController.updateUser(req, res);
        expect(res.statusCode).toBe(200);
    });

    it("User update should return 500", async() => {
        const rejected = Promise.reject({ message: "internal server error" });
        User.update.mockResolvedValue(rejected);
        await userController.updateUser(req, res);
        expect(res.statusCode).toBe(500);
    });
});


describe("userController deleteUser", () => {
    it("user delete should return 200 deleted", async() => {
        User.destroy.mockResolvedValue({ user: "user" });
        await userController.deleteUser(req, res);
        expect(res.statusCode).toBe(200);
    });

        it("User delete should return 500", async() => {
            const errData = {
                status: 503,
                message: "Internal server error"
            }
            try {
                User.destroy.mockResolvedValue(errData)
                await userController.deleteUser(req, res)
            } catch {
                expect(res.statusCode).toBe(503)
            }
        });
  });