export interface Properties {
  content: {
    rich_text: {
      type: string;
      text: {
        content: string;
      };
    }[];
  };
  tags: {
    multi_select: {
      name: string;
    }[];
  };
  images?:{
    rich_text?: {
      type: string;
      text: {
        content: string;
        link:{
          url:string
        }
      };
    }[];
  }
}

export interface TagType {
  id: string;
  name: string;
  color: number;
}
