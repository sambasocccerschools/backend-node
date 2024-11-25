import { IDatabaseAdapter } from "tenshi/persistance/DataBaseHelper/IDatabaseAdapter";
import { MariaDbAdapter } from "./Adapters/MariaDBAdapter";

export class DBPersistanceFactory {
    /**
     * Creates a database persistence adapter based on the provided type.
     * Currently only supports MariaDB.
     *
     * @param type - The type of database adapter to create. Defaults to null.
     * @returns An instance of the database adapter.
     * @throws {Error} If an unsupported adapter type is provided.
     */
    static createDBAdapterPersistance(type: string | null = null): IDatabaseAdapter {
        // Check if the provided type is null (default) or not supported
        switch (type) {
            case "mariadb" :
                return MariaDbAdapter.getInstance();
            default:
                // If not null or supported, throw an error
                throw new Error(`Factory: Adapter type ${type} is not supported.`);
        }
    }
}

