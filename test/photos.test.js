const photoController = require("../controllers/photos.controller");
const httpMocks = require("node-mocks-http");
const { Photo } = require("../models/index")

jest.mock("../models");
jest.mock("../middleware/auth");

let req, res;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});


describe("Photo controller findAll", () => {
    it("Photo findall should return 200 ", async() => {
        Photo.findAll.mockResolvedValue(({ userId: "user" }));
        await photoController.getPhoto(req, res);
        expect(res.statusCode).toBe(200);
    });

    it("Photo findall should return 500", async() => {
        const rejected = Promise.reject({ message: "internal server error" });
        Photo.findAll.mockResolvedValue(rejected);
        await photoController.getPhoto(req, res);
        expect(res.statusCode).toBe(500);
    });
});

describe('PhotoController.postPhoto', ()=> {    
    it('should return 200', async () => {
        Photo.create.mockResolvedValue({ 
            title : "title"
        })    
        await photoController.postPhoto(req, res);
        expect(res.statusCode).toBe(201);
    })

    it('should return 500', async () => {          
        const rejected = Promise.reject({ message: "ini error"});
        Photo.create.mockResolvedValue(rejected)

        await photoController.postPhoto(req, res)
        expect(res.statusCode).toBe(500);
 
      })
 });
 
 describe("photoController updatePhoto", () => {
    it("Photo update should return 200 updated", async() => {
        Photo.update.mockResolvedValue({ photo: "photo" });
        await photoController.updatePhoto(req, res);
        expect(res.statusCode).toBe(200);
    });

    it("Photo update should return 500", async() => {
    const rejected = Promise.reject({ message: "internal server error" });
    Photo.update.mockResolvedValue(rejected);
    await photoController.updatePhoto(req, res);
    expect(res.statusCode).toBe(503);
    });

});

describe("Photo Controller deletePhoto", () => {
    it("Photo delete should return 200 deleted", async() => {
        Photo.destroy.mockResolvedValue({ user: "user" });
        await photoController.deletePhoto(req, res);
        expect(res.statusCode).toBe(200);
    });

    it("Photo update should return 500", async() => {
        const rejected = Promise.reject({ message: "internal server error" });
        Photo.update.mockResolvedValue(rejected);
        await photoController.updatePhoto(req, res);
        expect(res.statusCode).toBe(503);
        });
        
 });