interface ItemFields {
  content: {
    text: string;
    type: string;
    link?: string;
  }[];
  images?: {
    file_token: string;
    name: string;
    size: number;
    tmp_url: string;
    type: string;
    url: string;
  }[],
  tags: string[];
  "created_time"?: number;
  "last_edited_time?": number;
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

export type { Bitable, Memo, ItemFields, Filter };