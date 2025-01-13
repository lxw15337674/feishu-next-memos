'use server';
import * as lark from '@larksuiteoapi/node-sdk';
import { Bitable, Filter, LinkType, Memo } from './type';
import { createApi } from 'unsplash-js';
import { Random } from 'unsplash-js/dist/methods/photos/types';
import { NewMemo, parseFields } from '../utils/parser';
import { unstable_cache } from 'next/cache';
const APP_ID = process.env.APP_ID as string
const APP_SECRET = process.env.APP_SECRET as string
const APP_TOKEN = process.env.APP_TOKEN as string
const TABLE_ID = process.env.TABLE_ID as string

const client = new lark.Client({
    appId: APP_ID,
    appSecret: APP_SECRET,
    appType: lark.AppType.SelfBuild,
    domain: lark.Domain.Feishu,
});

export const getRecordsActions = async (config: {
    page_token?: string;
    page_size?: number;
    filter?: Filter;
    desc?: boolean;
}) => {
    const { page_token = undefined, page_size = 200, filter, desc=true } = config;
    try {
        const { data } = await client.bitable.appTableRecord.search({
            params: {
                page_size,
                page_token,
            },
            data: {
                sort: [{ field_name: 'created_time', desc }],
                filter,
            },
            path: {
                app_token: APP_TOKEN,
                table_id: TABLE_ID,
            },
        });
        return data as unknown as Bitable;
    } catch (error) {
        console.error("数据获取失败:", error);
        throw error;
    }
};


interface GetMemosDataParams {
    page_token?: string;
    filter?: Filter;
    desc?: boolean;
}
export const getMemosDataActions = async ({ page_token, filter, desc = true }: GetMemosDataParams = {}) => {
    try {
        const data = await getRecordsActions({
            page_token,
            desc,
            page_size: 20 * 3,
            filter
        })
        return data!
    } catch (error) {
        console.error("memos获取失败:", error);
        throw error;
    }
};

// 一次性获取所有笔记
// export const getAllMemosActions = unstable_cache(async () => {
//     const allMemos: Memo[] = [];
//     let page_token: string | undefined = undefined;
//     do {
//         const data = await getMemosDataActions({ page_token });
//         allMemos.push(...data?.items ?? []);
//         if (data?.page_token) {
//             page_token = data?.page_token;
//         }
//     } while (page_token);
//     console.log("所有数据获取成功");
//     return allMemos;
// }, [], {
//     tags: ['memos'],
//     revalidate: 24 * 60 * 60
// })

export const getAllFields = async () => {
    try {
        const { data } = await client.bitable.appTableField.list({
            path: {
                app_token: APP_TOKEN,
                table_id: TABLE_ID,
            },
        });
        console.log("标签获取成功");
        return data;
    } catch (error) {
        console.error("标签获取失败:", error);
        throw error;
    }
}



export const createNewMemo = async (newMemo: NewMemo) => {
    try {
        const fields = parseFields(newMemo) as Record<string, any>;
        const { data } = await client.bitable.appTableRecord.create({
            path: {
                app_token: APP_TOKEN,
                table_id: TABLE_ID,
            },
            data: {
                fields,
            },
        });
        if (data) {
            console.log("添加成功");
        } else {
            throw new Error("添加失败");
        }
    } catch (error) {
        console.error("添加失败:", error);
        throw error;
    }
};

export const deleteMemo = async (record_id: string) => {
    try {
        await client.bitable.appTableRecord.delete({
            path: {
                app_token: APP_TOKEN,
                table_id: TABLE_ID,
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
                app_token: APP_TOKEN,
                table_id: TABLE_ID,
            },
            data: {
                record_ids: [record_id],
            },
        });
        console.log("数据获取成功");
        return data?.records?.[0] as unknown as Memo;
    } catch (error) {
        console.error(error);
    }
};

export const updateMemoAction = async (record_id: string, newMemo: NewMemo) => {
    try {
        const fields = parseFields(newMemo)
        const { data } = await client.bitable.appTableRecord.update({
            path: {
                app_token: APP_TOKEN,
                table_id: TABLE_ID,
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
    }).catch((e: any) => {
        console.error(e);
    });
    return (res?.response as Random).urls?.regular;
};

export const uploadImageAction = async (formData: FormData) => {
    try {
        const file = formData.get("file") as File;
        const data = await client.drive.media.uploadAll({
            data: {
                parent_node: APP_TOKEN,
                parent_type: 'bitable_image',
                size: file.size,
                file: Buffer.from(await file.arrayBuffer()),
                file_name: file.name,
            },
        });
        console.log(`file_token: ${data?.file_token}`);
        return data?.file_token
    } catch (e) {
        console.error(e);
    }
};
interface ImageData {
    file_token: string;
    tmp_download_url: string;
}

export const getImageUrlAction = unstable_cache(async (file_tokens: string[]) => {
    // 处理多个 file_token，将它们拼接成 "file_tokens={token1}&file_tokens={token2}" 的形式
    const queryString = file_tokens.map(token => `file_tokens=${token}`).join('&');

    const { data } = await client.request({
        method: 'get',
        url: `https://open.feishu.cn/open-apis/drive/v1/medias/batch_get_tmp_download_url?${queryString}`,
    });
    console.log("图片获取成功");
    return data?.tmp_download_urls as ImageData[]
}, [], {
    tags: ['images'],
    revalidate: 12 * 60 * 60
})