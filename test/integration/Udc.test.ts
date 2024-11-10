import request from "supertest";
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';

const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

describe("UDC Endpoints", () => {

  const jwt = config.TEST.JWT_TEST;
  const apiKey = config.SERVER.SECRET_API_KEY;      
  const baseUrl = config.COMPANY.BACKEND_HOST; 
  let createdUDCId: any;

  it("should create a new UDC", async () => {
    const response = await request(baseUrl)
      .post("udc/add")
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .send({
        code: "CLUSTER"+Date.now(),
        type: "PROJECT_TYPE",
        title: "Cluster",
        title_es: "Cluster",
        slug: "Cluster",
        father_code: "Cluster",
        value1: "valor_del_value1",
        value2: "valor_del_value2",
        country_iso_code: "CRC",
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id");

    createdUDCId = response.body.data.id;
  });

  it("should update an existing UDC", async () => {
    const response = await request(baseUrl)
      .put(`udc/edit?id=${createdUDCId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .send({
        code: "CLUSTER"+Date.now(),
        type: "PROJECT_TYPE",
        title: "Cluster Updated",
        title_es: "Cluster Actualizado",
        slug: "cluster-updated",
        father_code: "Cluster",
        value1: "valor_modificado_1",
        value2: "valor_modificado_2",
        country_iso_code: "CRC",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.title", "Cluster Updated");
  });

  it("should get a UDC by ID", async () => {
    const response = await request(baseUrl)
      .get("udc/get")
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .query({ id: createdUDCId });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status.http_code", 200);
    expect(response.body).toHaveProperty("data.id", createdUDCId);
  });

  it("should get all UDCs with pagination", async () => {
    const response = await request(baseUrl)
      .get("udc/get_all")
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .query({ page: 1, size: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status.http_code", 200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should delete a UDC", async () => {
    const response = await request(baseUrl)
      .delete("udc/delete")
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .query({ id: createdUDCId });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", createdUDCId);
  });
});
