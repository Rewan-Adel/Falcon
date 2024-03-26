declare global {
    namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        PORT?  : string;
        DB_NAME: string;
        DB_USER: string;
        DB_PASS: string;
        DB_HOST: string;
        DB_PORT: string;
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;
        JWT_COOKIE_EXPIRES_IN: string;

        } 
    }
}

export {};