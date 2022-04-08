export type ResponseModel = {
    data: any;
    meta: {
        version: string;
    };
    response: {
        code: number;
        status: string;
        errors: any;
    };
};

/**
 * Get meta data for creating response model
 */
const getMetaData = () => {
    const meta = {
        version: '1.0.0'
    };

    return meta;
};

/**
 * Create response model with user friendly designed
 *
 * @param responseCode
 * @param data
 * @param errors
 */
export const createResponse = (responseCode: number, data: any, errors: any) => {
    const responseModel: ResponseModel = {
        data,
        meta: getMetaData(),
        response: {
            code: responseCode,
            errors,
            status: responseCode < 400 ? 'OK' : 'ERROR'
        }
    };

    return responseModel;
};
