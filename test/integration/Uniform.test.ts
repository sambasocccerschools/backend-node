
import request from "supertest";
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';

const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

describe("Uniform Endpoints", () => {

  const jwt = config.TEST.JWT_TEST;
  const apiKey = config.SERVER.SECRET_API_KEY;      
  const baseUrl = config.COMPANY.BACKEND_HOST; 
  let createdUniformId: any;

  it("should create a new Uniform", async () => {
    const response = await request(baseUrl)
      .post("uniform/add")
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .send({
        title: "test_title"+Date.now(),
        description: "test_description",
        price: 100,
        url: "test_url"
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id");

    createdUniformId = response.body.data.id;
  });

  it("should update an existing Uniform", async () => {
    const response = await request(baseUrl)
      .put(`uniform/edit?id=${createdUniformId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .send({
        title: "test_title"+Date.now(),
        description: "test_description",
        price: 100,
        url: "test_url"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", createdUniformId);
  });

  it("should get a Uniform by ID", async () => {
    const response = await request(baseUrl)
      .get(`uniform/get?id=${createdUniformId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", createdUniformId);
  });

  it("should get all Uniform with pagination", async () => {
    const response = await request(baseUrl)
      .get(`uniform/get_all`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .query({ page: 1, size: 10 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should delete an existing Uniform", async () => {
    const response = await request(baseUrl)
      .delete(`uniform/delete?id=${createdUniformId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey);

    expect(response.status).toBe(200);
  });
});
