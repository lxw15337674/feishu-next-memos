'use server';
import * as lark from '@larksuiteoapi/node-sdk';
import { Bitable, Filter, ItemFields, Memo, newMemo } from './type';
import { createApi } from 'unsplash-js';
import { Random } from 'unsplash-js/dist/methods/photos/types';
import { splitMode } from '../utils/parser';
import { Readable } from 'stream';

// You need to provide your Feishu App ID and App Secret
const appId = 'cli_a66aa8de55e4d00c';
const appSecret = 'yB2jYZls1J9Y0KxHY8BwJfLqmfmrfMgT';
const appToken = 'HRbGbAGmbazCS4sUu51cwx2bndc';
const tableId = 'tbl70rRSqKoZuaK6';

// Create a new Lark Client instance
const client = new lark.Client({
    appId: appId,
    appSecret: appSecret,
    appType: lark.AppType.SelfBuild,
    domain: lark.Domain.Feishu,
});

export const getAppAccessToken = async () => {
    try {
        const data: any = await client.auth.appAccessToken.internal({
            data: {
                app_id: appId,
                app_secret: appSecret,
            },
        })
        return data?.app_access_token as string;
    } catch (error) {
        console.error('Error getting app access token:', error);
    }
}

export const getRecordsActions = async (config: {
    page_token?: string;
    page_size?: number;
    filter?: Filter;
    sort?: {
        field_name: string;
        desc: boolean;
    }[]
}) => {
    const { page_token = undefined, page_size = 20, filter } = config;
    try {
        const { data } = await client.bitable.appTableRecord.search({
            params: {
                page_size,
                page_token,

            },
            data: {
                sort: [{
                    'field_name': "created_time",
                    "desc": true
                }],
                filter
            },
            path: {
                app_token: appToken,
                table_id: tableId,
            },
        });
        console.log("数据获取成功");
        return data as unknown as Bitable;
    } catch (error) {
        console.error("数据获取失败:", error);
        throw error;
    }
};


interface GetMemosDataParams {
    page_token?: string;
    filter?: Filter;
}
export const getMemosDataActions = async ({ page_token, filter }: GetMemosDataParams = {}) => {
    return await getRecordsActions({
        page_token,
        sort: [{
            'field_name': "created_time",
            "desc": true
        }],
        filter
    });
};

// 一次性获取所有笔记
export const getAllMemosActions = async () => {
    const allMemos: Memo[] = [];
    let page_token: string | undefined = undefined;
    do {
        const data = await getMemosDataActions({ page_token });
        allMemos.push(...data.items);
        page_token = data.page_token;
    } while (page_token);
    console.log("所有数据获取成功", allMemos);
    return allMemos;
};

export const getAllFields = async () => {
    try {
        const { data } = await client.bitable.appTableField.list({
            path: {
                app_token: appToken,
                table_id: tableId,
            },
        });
        console.log("标签获取成功");
        return data;
    } catch (error) {
        console.error("标签获取失败:", error);
        throw error;
    }
};

export const createNewMemo = async (content: string, fileTokens?: string[]) => {
    try {
        const fields = splitMode(content, fileTokens) as Record<string, any>;
        await client.bitable.appTableRecord.create({
            path: {
                app_token: appToken,
                table_id: tableId,
            },
            data: {
                fields,
            },
        });
        console.log("添加成功");
    } catch (error) {
        console.error("添加失败:", error);
        throw error;
    }
};

export const deleteMemo = async (record_id: string) => {
    try {
        await client.bitable.appTableRecord.delete({
            path: {
                app_token: appToken,
                table_id: tableId,
                record_id,
            },
        });
        console.log("删除成功");
    } catch (error) {
        console.error("删除失败:", error);
        throw error;
    }
};

export const getMemoByIdAction = async (record_id: string) => {
    try {
        const { data } = await client.bitable.appTableRecord.batchGet({
            path: {
                app_token: appToken,
                table_id: tableId,
            },
            data: {
                record_ids: [record_id],
            },
        });
        return data?.records?.[0] as unknown as Memo;
    } catch (error) {
        console.error(error);
    }
};

export const updateMemoAction = async (record_id: string, content: string, fileTokens?: string[]) => {
    try {
        const fields = splitMode(content, fileTokens) as Record<string, any>;
        const { data } = await client.bitable.appTableRecord.update({
            path: {
                app_token: appToken,
                table_id: tableId,
                record_id,
            },
            data: {
                fields,
            },
        });
        return data?.record?.record_id;
    } catch (error) {
        console.error(error);
    }
};

export const getRandomImage = async () => {
    const unsplash = createApi({
        accessKey: process.env.UNSPLASH_ACCESS_CODE!,
    });
    const res = await unsplash.photos.getRandom({
        query: 'wallpapers',
        orientation: 'landscape',
    }).catch((e) => {
        console.error(e);
    });
    return (res?.response as Random).urls?.regular;
};

export const uploadImageAction = async (formData: FormData) => {
    try {
        const file = formData.get("file") as File;
        const data = await client.drive.media.uploadAll({
            data: {
                parent_node: appToken,
                parent_type: 'bitable_image',
                size: file.size,
                file: Buffer.from(await file.arrayBuffer()),
                file_name: file.name,
            },
        });
        return data?.file_token
    } catch (e) {
        console.error(e);
    }
};

// todo 改成支持多个file_token,https://github.com/larksuite/node-sdk/issues/106
export const getImageUrlAction = async (file_token: string) => {
    return ''
    const { data } = await client.drive.media.batchGetTmpDownloadUrl({
        params: {
            // sdk type错误
            file_tokens: file_token as any
        },
    },
    )
    return data?.tmp_download_urls?.[0]?.tmp_download_url ?? ''
};