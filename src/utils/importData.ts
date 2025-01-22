import * as XLSX from 'xlsx';
import { LinkType } from '../components/Editor/LinkAction';
import { NewMemo } from '../api/type';

interface MastodonData {
    orderedItems: Array<{
        object: {
            content: string
        }
    }>
}

// Convert Excel date number to timestamp
const excelDateToTimestamp = (excelDate: number): number => {
    // Excel's epoch starts from 1900-01-01
    const epoch = new Date(1900, 0, 1);
    // Subtract 2 to account for Excel's leap year bug
    const daysSinceEpoch = excelDate - 2;
    const millisecondsSinceEpoch = daysSinceEpoch * 24 * 60 * 60 * 1000;
    return epoch.getTime() + millisecondsSinceEpoch;
};

// 导入Mastodon
export const parseMastodonData = (data: MastodonData) => {
    const memos: string[] = data.orderedItems.map(item => item.object.content).filter(content => content).map(content => {
        // 去掉p标签
        return content.replace(/<br \/>/g, '\n').replace(/<p>/g, '').replace(/<\/p>/g, '')
    })
    return memos
}

export const parseExcelData = (data: ArrayBuffer): NewMemo[] => {
    // Read the Excel file
    const workbook = XLSX.read(data, { type: 'array' });

    // Get the first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Map the data to our memo format
    return jsonData.map((row: any) => {
        const memo: NewMemo = {
            content: row.content || '',
        };
        if (row.images) {
            memo.images = row.images?.split(',').map((image: string) => image.trim()) || [];
            console.log(memo.images)
        }
        if (row.link) {
            const linkData: LinkType = {
                url: row.link,
                text: null // 标题将在导入时自动获取
            };
            memo.link = linkData;
        }
        if (row.tags) {
            memo.tags = row.tags.split(',').map((tag: string) => tag.trim());
        }
        if (row.created_time) {
            // Convert Excel date number to timestamp
            memo.created_time = typeof row.created_time === 'number'
                ? excelDateToTimestamp(row.created_time)
                : row.created_time;
        }
        if (row.last_edited_time) {
            // Convert Excel date number to timestamp
            memo.last_edited_time = typeof row.last_edited_time === 'number'
                ? excelDateToTimestamp(row.last_edited_time)
                : row.last_edited_time;
        }
        return memo;
    });
}