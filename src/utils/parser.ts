import { Properties } from '@/type';

enum ContentType {
  Text = 'text',
  Tag = 'tag',
}
export interface Content {
  text: string;
  type: ContentType
}

export function parseContent(text: string): Content[] {
  const res: Content[] = [];
  let buffer = '';
  let isTag = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // Check for '#' character to start a tag
    if (char === '#') {
      if (isTag && buffer.endsWith('#')) {
        buffer += '#';
      } else {
        if (buffer) {
          res.push({ text: buffer, type: isTag ? ContentType.Tag : ContentType.Text });
        }
        buffer = '#';
        isTag = true;
      }
    }
    // Check for ' ' to end a tag
    else if ([' '].includes(char) && isTag) {
      if (buffer !== '#') {
        res.push({ text: buffer, type: ContentType.Tag });
        buffer = '';
      }
      buffer += ' ';
      isTag = false; // We are now outside a tag
    }
    // Append other characters to buffer
    else {
      buffer += char;
    }
  }

  // Push the last buffer content if it's not empty
  if (buffer.length > 0) {
    if (buffer.split('').every((item) => item === '#')) {
      isTag = false;
    }
    res.push({ text: buffer, type: isTag ? ContentType.Tag : ContentType.Text });
  }
  return res;
}

export function extractTags(text: string): string[] {
  // 使用正则表达式匹配标签（#开头，后跟字母数字字符）
  const labelRegex = /#[a-zA-Z0-9\u4e00-\u9fa5]+/g;
  const tags = text.match(labelRegex)?.map((label) => label.slice(1));

  // 如果找到标签，则返回标签数组，否则返回空数组
  return tags ? tags : [];
}

export function convertGMTDateToLocal(gmtDateString: string) {
  // Parse the GMT date string
  const gmtDate = new Date(gmtDateString);

  // Get the local date and time components
  const year = gmtDate.getFullYear();
  const month = (gmtDate.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month (0-indexed)
  const day = gmtDate.getDate().toString().padStart(2, '0');
  const hours = gmtDate.getHours().toString().padStart(2, '0');
  const minutes = gmtDate.getMinutes().toString().padStart(2, '0');
  const seconds = gmtDate.getSeconds().toString().padStart(2, '0');

  // Create the local datetime string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// 拆分模式：标签和文本分开。
export function splitMode(content: string, fileUrls?: string[]): Properties {
  // 将字符串按换行符分割成数组
  const lines = content.split('\n');
  const tags: string[] = []
  const richTexts = lines.map((line) => {
    let text = ''
    const content = parseContent(line)
    for (const item of content) {
      if (item.type === 'tag') {
        tags.push(item.text.slice(1))
      }
      text += item.text
    }
    return text
  })
  let imagesContent: { type: string; text: { content: string; link: { url: string; }; }; }[] = []
  if (fileUrls){
    imagesContent = fileUrls.map((url) => ({
      type:'text',
      text:{
        "content": url,
        "link": {
          url
        }
      }
    }))
  }
  return {
    content: {
      rich_text: richTexts.map((text) => ({
        type: 'text',
        text: {
          content: text,
        },
      })),
    },
    tags: {
      multi_select: tags.map((tag) => ({
        name: tag,
      })),
    },
    images:{
      rich_text: imagesContent
    }
  };
} 