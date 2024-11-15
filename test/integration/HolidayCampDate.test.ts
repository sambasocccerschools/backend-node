
import request from "supertest";
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';

const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

describe("HolidayCampDate Endpoints", () => {

  const jwt = config.TEST.JWT_TEST;
  const apiKey = config.SERVER.SECRET_API_KEY;      
  const baseUrl = config.COMPANY.BACKEND_HOST; 
  let createdHolidayCampDateId: any;

  it("should create a new HolidayCampDate", async () => {
    const response = await request(baseUrl)
      .post("holidaycampdate/add")
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .send({
        name: "test_name",
        start_date: "2024-11-15T04:16:06.502Z",
        end_date: "2024-11-15T04:16:06.502Z",
        camp_type_code: "test_camp_type_code",
        franchise_id: "test_franchise_id"
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id");

    createdHolidayCampDateId = response.body.data.id;
  });

  it("should update an existing HolidayCampDate", async () => {
    const response = await request(baseUrl)
      .put(`holidaycampdate/edit?id=${createdHolidayCampDateId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .send({
        name: "test_name",
        start_date: "2024-11-15T04:16:06.502Z",
        end_date: "2024-11-15T04:16:06.502Z",
        camp_type_code: "test_camp_type_code",
        franchise_id: "test_franchise_id"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", createdHolidayCampDateId);
  });

  it("should get a HolidayCampDate by ID", async () => {
    const response = await request(baseUrl)
      .get(`holidaycampdate/get?id=${createdHolidayCampDateId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", createdHolidayCampDateId);
  });

  it("should get all HolidayCampDate with pagination", async () => {
    const response = await request(baseUrl)
      .get(`holidaycampdate/get_all`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .query({ page: 1, size: 10 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should delete an existing HolidayCampDate", async () => {
    const response = await request(baseUrl)
      .delete(`holidaycampdate/delete?id=${createdHolidayCampDateId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey);

    expect(response.status).toBe(200);
  });
});
