'use server';
import { Client } from '@notionhq/client';
import {
  CreatePageParameters,
  DatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { splitMode } from '@/utils/parser';
import { TagType } from '@/type';
import { createApi } from 'unsplash-js';
import { Random } from 'unsplash-js/dist/methods/photos/types';

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!;
const ClientNotion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDBData = async (config: {
  startCursor?: string;
  pageSize?: number;
  filter?: any;
}) => {
  const { startCursor = undefined, pageSize = 20, filter } = config;
  const listUsersResponse = await ClientNotion.databases.query({
    database_id: NOTION_DATABASE_ID,
    sorts: [
      {
        timestamp: 'created_time',
        direction: 'descending',
      },
    ],
    page_size: pageSize,
    start_cursor: startCursor,
    filter,
  });
  return listUsersResponse;
};

// export const getDBDataCount = async () => {
//     const listUsersResponse = await ClientNotion.databases.query({
//         database_id: NOTION_DATABASE_ID,
//         filter: {
//             property: "tags",
//             multi_select: {
//                 contains: "count"
//             }
//         }
//     })
//     return listUsersResponse.results as DatabaseObjectResponse[]
// }

// 
export async function createPageInDatabase(content: string, fileUrls?: string[]) {
  const newPageData: CreatePageParameters = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: splitMode(content, fileUrls) as Record<string, any>,
  };
  // 创建新页面
  return (await ClientNotion.pages.create(
    newPageData,
  )) as unknown as DatabaseObjectResponse;
}

export async function archivePage(pageId: string, archived: boolean) {
  try {
    return (await ClientNotion.pages.update({
      page_id: pageId,
      archived,
    })) as unknown as DatabaseObjectResponse;
  } catch (error) {
    console.error(error);
  }
}

export async function updatePageProperties(pageId: string, content: string, fileUrls?: string[]) {
  try {
    return (await ClientNotion.pages.update({
      page_id: pageId,
      properties: splitMode(content, fileUrls) as Record<string, any>
    })) as unknown as DatabaseObjectResponse;
  } catch (error) {
    console.error(error);
  }
}

// 获取所有标签
export async function getAllLabels() {
  const listUsersResponse = await ClientNotion.databases.retrieve({
    database_id: NOTION_DATABASE_ID,
  });
  return (listUsersResponse.properties.tags as any)?.multi_select
    ?.options as TagType[];
}


export async function validateAccessCode(password?: string) {
  if (!process.env.ACCESS_CODE) {
    return true;
  }
  return password === process.env.ACCESS_CODE;
}

export async function validateEditCode(password?: string) {
  if (!process.env.EDIT_CODE) {
    return true;
  }
  return password === process.env.EDIT_CODE;
}

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
}
