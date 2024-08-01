import fs from 'fs';
import path from 'path';

interface CompanyConfig {
    NAME: string;
    LOGO: string;
    BACKEND_HOST: string;
    FRONT_END_HOST: string;
    RESET_PASSWORD_URL: string;
    MAIN_COLOR: string;
    LANDING_PAGE: string;
}

interface GeneralConfig {
    IS_DEBUGGING: boolean;
    FAIL_LOGIN_MAX_NUMBER: number;
}

interface HttpRequestConfig {
    PAGE_SIZE: number;
    PAGE_OFFSET: number;
}

interface ServerConfig {
    PORT: number;
    SECRET_API_KEY: string;
    VALIDATE_API_KEY: boolean;
    PASSWORD_SALT: string;
}

interface DbConfig {
    PORT: number;
    HOST: string;
    USER: string;
    PASSWORD: string;
    NAME: string;
    CONNECTION_LIMIT: number;
}

interface JwtTokenConfig {
    EXPIRE: string | null;
    SECRET_KEY: string;
}

interface JwtConfig {
    MAIN_TOKEN: JwtTokenConfig;
    REFRESH_TOKEN: JwtTokenConfig;
    FORGOT_PASS_TOKEN: JwtTokenConfig;
    REGISTER_TOKEN: JwtTokenConfig;
}

interface GeneralFileConfig {
    MAX_FILE_SIZE: number;
}

interface AwsConfig {
    BUCKET_NAME: string;
    REGION: string;
    ACCESS_KEY: string;
    SECRET_ACCESS_KEY: string;
    PUBLIC_FOLDER: string;
}

interface FileConfig {
    GENERAL: GeneralFileConfig;
    AWS: AwsConfig;
}

interface EmailContent {
    REGISTER_SUBJECT: string;
    FORGOT_PASS_SUBJECT: string;
    ACTIVE_USER: string;
}

interface EmailConfig {
    SERVICE: string;
    AUTH_USER: string;
    AUTH_PASSWORD: string;
    EMAIL_FROM: string;
    CONTENT: EmailContent;
}

interface AppConfig {
    COMPANY: CompanyConfig;
    GENERAL: GeneralConfig;
    HTTP_REQUEST: HttpRequestConfig;
    SERVER: ServerConfig;
    DB: DbConfig;
    JWT: JwtConfig;
    FILE: FileConfig;
    EMAIL: EmailConfig;
}

const configPath = path.resolve(__dirname, './unbreakable-config.json');
const configData = fs.readFileSync(configPath, 'utf-8');
const config: AppConfig = JSON.parse(configData);

export default config;
