'use server';
import * as lark from '@larksuiteoapi/node-sdk';

// You need to provide your Feishu App ID and App Secret
const appId = 'cli_a66aa8de55e4d00c';
const appSecret = 'yB2jYZls1J9Y0KxHY8BwJfLqmfmrfMgT';

// Create a new Lark Client instance
const client = new lark.Client({
    appId: appId,
    appSecret: appSecret,
    appType: lark.AppType.SelfBuild,
    domain: lark.Domain.Feishu,
});


export const getMemosData = async (appToken: string, tableId: string) => {
    try {
        const { data } = await client.bitable.appTableRecord.search({
            path: {
                app_token: appToken,
                table_id: tableId,
            },
        });
        console.log("数据获取成功");
        return data;
    } catch (error) {
        console.error("数据获取失败:", error);
        throw error;
    }
};

// const addTableRecord = async (appToken: string, tableId: string, records: BitableRecord[]) => {
//     try {
//         const { data } = await client.bitable.appTableRecord.batchCreate({
//             path: {
//                 app_token: appToken,
//                 table_id: tableId,
//             },
//             data: {
//                 records: records,
//             },
//         });
//         console.log("添加成功");
//         return data;
//     } catch (error) {
//         console.error("添加失败:", error);
//         throw error;
//     }
// };