//*************************************** */
//              Configuration
//*************************************** */
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';

//set configuration first time
const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

import { DataSource } from 'typeorm';
import { UnitDynamicCentral } from '@index/entity/UnitDynamicCentral';
import { Franchise } from '@index/entity/Franchise';


async function createDatabaseIfNotExists() {
  // Step 1: Connect to MySQL without specifying a database
  const tempDataSource = new DataSource({
      type: config.DB.TYPE, // Type of the database
      host: config.DB.HOST, // Host of the database
      port: config.DB.PORT, // Port of the database
      username: config.DB.USER, // Usertitle for the database
      password: config.DB.PASSWORD, // Password for the database
  });

  await tempDataSource.initialize();

  // Step 2: Create the database if it does not exist
  await tempDataSource.query(`CREATE DATABASE IF NOT EXISTS \`${config.DB.NAME}\``);
  await tempDataSource.destroy(); // Close the temporary connection
}


async function runSeed() {
 
    await createDatabaseIfNotExists();
    /*
        Init Datasource
    */
    const dataSource = new DataSource({
        type: config.DB.TYPE, // Type of the database
        host: config.DB.HOST, // Host of the database
        port: config.DB.PORT, // Port of the database
        username: config.DB.USER, // Usertitle for the database
        password: config.DB.PASSWORD, // Password for the database
        database: config.DB.NAME, // Name of the database
        entities: [UnitDynamicCentral, Franchise], // Array of entities to be used
        synchronize: true, // Synchronize the schema with the database
        extra: {
            connectionLimit: 150, 
        },
    });
    

    await dataSource.initialize();


    function createFranchise(first_name: string, last_name: string, dob: Date, age: number, phone: string, email: string, postal_code: string, location: string, liquid_capacity: number, message: string, referral_code: string): Franchise {
      const franchise = new Franchise();
      franchise.first_name = first_name;
      franchise.last_name = last_name;
      franchise.dob = dob;
      franchise.age = age;
      franchise.phone_number = phone;
      franchise.email = email;
      franchise.postal_code = postal_code;
      franchise.location = location;
      franchise.liquid_capacity = liquid_capacity;
      franchise.message = message;
      franchise.is_deleted = false;
  
      const referralSource = new UnitDynamicCentral();
      referralSource.code = referral_code;
      franchise.referral_source_code = referralSource;
  
      return franchise;
  }


    /*
       Franchise
    */
    const franchiseRepository = dataSource.getRepository(Franchise);
    const franchises: Franchise[] = [];
    // Populate the array with franchise data
    franchises.push(
      createFranchise("John", "Smith", new Date("2005-06-12"), 18, "+1-555-0101", "john.smith@example.com", "12345", "London, UK", 500, "Looking forward to joining the camp!", "FACEBOOK"),
      createFranchise("Michael", "Johnson", new Date("2007-03-09"), 16, "+1-555-0102", "michael.johnson@example.com", "23456", "Manchester, UK", 300, "", "INSTAGRAM"),
      createFranchise("Emily", "Davis", new Date("2008-12-22"), 15, "+1-555-0103", "emily.davis@example.com", "34567", "Birmingham, UK", 450, "Excited about learning new skills.", "GOOGLE_SEARCH"),
    );

    await franchiseRepository.upsert(franchises, ["code"]);

    console.log("STG seed done!");
}

runSeed().catch((error) => console.error(error));