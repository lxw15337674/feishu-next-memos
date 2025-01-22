import { Memo } from "@prisma/client";
import { Tag } from "@prisma/client";
import { Link } from "@prisma/client";
import { LinkType } from "../components/Editor/LinkAction";

interface Filter {
  conjunction?: "and" | "or";
  conditions?: Array<{
    field_name: string;
    operator: "is" | "isNot" | "contains" | "doesNotContain" | "isEmpty" | "isNotEmpty" | "isGreater" | "isGreaterEqual" | "isLess" | "isLessEqual" | "like" | "in";
    value: Array<string>;
  }>;
  children?: Array<{
    conjunction: "and" | "or";
    conditions?: Array<{
      field_name: string;
      operator: "is" | "isNot" | "contains" | "doesNotContain" | "isEmpty" | "isNotEmpty" | "isGreater" | "isGreaterEqual" | "isLess" | "isLessEqual" | "like" | "in";
      value: Array<string>;
    }>;
  }>;
};
export interface DailyStats {
  date: string;
  count: number;
}

export interface MemosCount {
  dailyStats: DailyStats[];
  total: number;
  daysCount: number;
}


type Note = Memo & {
  tags: Tag[];
  link?: Link;
}

export interface NewMemo {
  content: string;
  images?: string[];
  link?: LinkType
  created_time?: string;
  last_edited_time?: string;
  tags?: string[];
}
export interface TagWithCount extends Tag {
  memoCount: number;
}
export type { Filter, Note };