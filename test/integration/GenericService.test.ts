import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';
const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
configManager.getConfig();

import { RequestHandler } from '@TenshiJS/generics/index';
import HttpAction from '@TenshiJS/helpers/HttpAction';
import GenericValidation from '@TenshiJS/generics/Validation/GenericValidation';
import RequestHandlerBuilder from '@TenshiJS/generics/RequestHandler/RequestHandlerBuilder';
import { Request, Response } from 'express';
import Validations from '@TenshiJS/helpers/Validations';
import JWTObject from '@TenshiJS/objects/JWTObject';
import { ConstRegex } from '@index/consts/Const';
import GenericService from '@TenshiJS/generics/Services/GenericService';

describe('GenericValidation', () => {
    let genericValidation: GenericValidation;
    let req: Request;
    let res: Response;
    let validation: Validations;
    let httpExec: HttpAction;
    let jwtData: JWTObject | null = null;
    let service: GenericService;

    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNjNDczY2Q2LWI4NDktNDAxZC1iNDZmLWU5MTAzMGQ1NzJlYSIsImVtYWlsIjoic2FtYmFzb2NjZXIyNEBnbWFpbC5jb20iLCJyb2xlIjoiOWIxZTZjNGEtNGNiNi00ZmYzLTlhNDQtMmRlOGQyNDUxMDRhIiwiaWF0IjoxNzMwNDk3MzgxLCJleHAiOjE3MzA1MjczODF9.w-uRtBMc8Um7CmK2jFhrtIbf35biGiusbWML9_47Q3M';
    const roleValidate = 'TEST';

    beforeEach(async () => {
        req = {
            headers: {
                'authorization': jwt
            }
        } as Request;

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            locals: {},
        } as unknown as Response;

        genericValidation = new GenericValidation();

        service = new GenericService();
        httpExec = new HttpAction(res);
        res.locals.httpExec = httpExec;
    });


    const validateJWT = async () => {
        validation = new Validations(req, httpExec);
        res.locals.validation = validation;

        jwtData = await validation.validateRequireJWT();
        res.locals.jwtData = jwtData;

        if (!jwtData) {
            throw new Error('JWT validation failed');
        }
    };


    describe('Validate All About Request Handler Builder Validations', () => {

        beforeEach(async () => {
            await validateJWT();
        });


        //************************************************ */
        // Validate JWT
        //************************************************ */
        it('Should SUCCESS Integration Insert Service', async () => {

            req.body = { 'password': 'Tenshitest1*' };
            const regexValidatorList: [string, string][] = [
                [ConstRegex.PASSWORD_REQUIRED_REGEX, req.body.password as string]
            ];
            
             const requestHandler: RequestHandler =
                 new RequestHandlerBuilder(res, req)
                     .setRegexValidation(regexValidatorList)
                     .build();

            const result = await service.insertService(requestHandler, async () => {return await true});
            expect(result).toEqual(true);
        });

    });
});