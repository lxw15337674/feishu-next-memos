interface ItemFields {
  content: {
    text: string;
    type: string;
    link?: string;
  }[];
  images?: ImageType[],
  tags: string[];
  "created_time"?: number;
  "last_edited_time"?: number;
}
 interface ImageType  {
  file_token: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface newMemo {
  content: string;
  images?: {
    file_token: string;
  }[],
  tags?: string[];
}

interface Memo {
  fields: ItemFields;
  record_id: string;
}

interface Bitable {
  has_more: boolean;
  items: Memo[];
  page_token: string;
  total: number;
}


interface Filter {
  conjunction?: "and" | "or";
  conditions?: Array<{
    field_name: string;
    operator: "is" | "isNot" | "contains" | "doesNotContain" | "isEmpty" | "isNotEmpty" | "isGreater" | "isGreaterEqual" | "isLess" | "isLessEqual" | "like" | "in";
    value?: Array<string>;
  }>;
  children?: Array<{
    conjunction: "and" | "or";
    conditions?: Array<{
      field_name: string;
      operator: "is" | "isNot" | "contains" | "doesNotContain" | "isEmpty" | "isNotEmpty" | "isGreater" | "isGreaterEqual" | "isLess" | "isLessEqual" | "like" | "in";
      value?: Array<string>;
    }>;
  }>;
};

export type { Bitable, Memo, ItemFields, Filter, ImageType };