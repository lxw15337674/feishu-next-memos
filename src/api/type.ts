export interface PageProperty {
  id: string;
  type: string;
  title?: { text: { content: string } }[];
}

export interface CreatePageData {
  Parent: { database_id: string };
  Properties: { [key: string]: PageProperty };
}
