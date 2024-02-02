/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Item } from '../models/Item';
import type { ResponseMessage } from '../models/ResponseMessage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Get Items
     * @returns Item Successful Response
     * @throws ApiError
     */
    public static getItemsApiItemsGet(): CancelablePromise<Array<Item>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/items/',
        });
    }
    /**
     * Create Item
     * @param requestBody
     * @returns ResponseMessage Successful Response
     * @throws ApiError
     */
    public static createItemApiItemsPost(
        requestBody: Item,
    ): CancelablePromise<ResponseMessage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/items/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Hello World
     * @returns any Successful Response
     * @throws ApiError
     */
    public static helloWorldApiPythonGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/python',
        });
    }
}
