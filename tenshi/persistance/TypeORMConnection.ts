// src/utils/Database.ts
import { DataSource, EntitySchema } from "typeorm";
import { debuggingMessage } from "tenshi/utils/logsUtils";
import { Log } from "tenshi/entity/Log";
import { User } from "tenshi/entity/User";

import ConfigManager  from "tenshi/config/ConfigManager";
import { ConstMessages, ConstRoles } from "tenshi/consts/Const";
import { hashPassword } from "@TenshiJS/utils/encryptionUtils";

export class Database {

    private static instance: DataSource;
    private static initializedEntities: Array<Function | string | EntitySchema> = [];

    private constructor() {}

    

    /**
     * Retrieves the singleton instance of the DataSource.
     * If it doesn't exist, it creates a new instance and initializes it.
     *
     * @param {Array<Function | string | EntitySchema>} [entities] - Optional array of entities to be used by the DataSource.
     * @return {DataSource} The singleton instance of the DataSource.
     */
    public static async getInstance(entities?: Array<Function | string | EntitySchema>): Promise<DataSource> {

        //get configuration file
        const config = ConfigManager.getInstance().getConfig();

        async function createDatabaseIfNotExists() {
            // Step 1: Connect to MySQL without specifying a database
            const tempDataSource = new DataSource({
                type: config.DB.TYPE, // Type of the database
                host: config.DB.HOST, // Host of the database
                port: config.DB.PORT, // Port of the database
                username: config.DB.USER, // Username for the database
                password: config.DB.PASSWORD, // Password for the database
            });
          
            try {
                await tempDataSource.initialize();
                await tempDataSource.query(`CREATE DATABASE IF NOT EXISTS \`${config.DB.NAME}\``);
                debuggingMessage(ConstMessages.CREATE_DATABASE);
            } catch (error) {
                debuggingMessage(error);
            } finally {
                if(tempDataSource.isInitialized){
                    await tempDataSource.destroy();
                }
            }
        }

        //validate entities
        if (entities) {
            Database.initializedEntities = [...new Set([...Database.initializedEntities, ...entities, Log, User])];
        } else if (Database.initializedEntities.length === 0) {
            Database.initializedEntities = [Log, User];
        }

        if (!Database.instance) {

            await createDatabaseIfNotExists();
            // If instance doesn't exist, create a new instance
            Database.instance = new DataSource({
                type: config.DB.TYPE, // Type of the database
                host: config.DB.HOST, // Host of the database
                port: config.DB.PORT, // Port of the database
                username: config.DB.USER, // Username for the database
                password: config.DB.PASSWORD, // Password for the database
                database: config.DB.NAME, // Name of the database
                entities: Database.initializedEntities, // Array of entities to be used
                synchronize: true, // Synchronize the schema with the database
                extra: {
                    connectionLimit: 150, 
                },
            });

            // Initialize the DataSource
            await Database.instance.initialize()
                .then(async () => {
                    const config = ConfigManager.getInstance().getConfig();

                    //Create First User, as a User Admin
                    const userRepository = Database.instance.getRepository(User);
                    const existingUser = await userRepository.findOne({ where: { email: config.SUPER_ADMIN.USER_EMAIL } });

                    if (!existingUser) {
                        
                        const adminUser = new User();
                        adminUser.email = config.SUPER_ADMIN.USER_EMAIL;
                        adminUser.password = await hashPassword(config.SUPER_ADMIN.PASSWORD)!;
                        adminUser.first_name = config.SUPER_ADMIN.FIRST_NAME;
                        adminUser.last_name = config.SUPER_ADMIN.LAST_NAME;
                        adminUser.user_name = config.SUPER_ADMIN.USERNAME;
                        adminUser.role_code = ConstRoles.SUPER_ADMIN; 
                        adminUser.is_active_from_email = true;
                        adminUser.account_status = "active";

                        await userRepository.save(adminUser);
                    }

                    debuggingMessage(ConstMessages.INIT_DATASOURCE); // Log a message when initialization is successful
                })
                .catch((err) => {
                    throw err; // Throw an error if initialization fails
                });
        }

        return Database.instance; // Return the singleton instance
    }

    public static closeConnection() {
        // Close connection
        if (Database.instance) {
            Database.instance.destroy();
        }
    }
}
