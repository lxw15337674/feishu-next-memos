import { useState } from "react";
import { uploadFile } from "../../utils/file";
import { toast } from "../ui/use-toast";
import { createNewMemo } from "../../api/dbActions";
import { parseExcelData } from "../../utils/importData";

const useImportMemos = () => {
    const [loading, setLoading] = useState(false);
    const [memos, setMemos] = useState(0);
    const [importedMemos, setImportedMemos] = useState(0);

    const importData = () => {
        uploadFile({
            accept: '.json,.xlsx,.xls',
            multiple: false,
            onSuccess: (files) => {
                setLoading(true);
                const file: File = files[0];
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        let memos;
                        if (file.name.endsWith('.json')) {
                            // Handle JSON files
                            memos = JSON.parse(event.target?.result as string);
                        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                            // Handle Excel files
                            memos = parseExcelData(event.target?.result as ArrayBuffer);
                        } else {
                            throw new Error('Unsupported file format');
                        }

                        setMemos(memos.length);
                        for (let i = 0; i < memos.length; i++) {
                            await createNewMemo(memos[i]);
                            setImportedMemos((prev) => prev + 1);
                        }
                        toast({
                            title: "导入成功",
                            description: `成功导入${memos.length}条数据`,
                            duration: 1000
                        });
                        setLoading(false);
                    } catch (error: any) {
                        toast({
                            variant: "destructive",
                            title: "导入失败",
                            description: error?.message,
                            duration: 1000
                        });
                        setLoading(false);
                    }
                };

                if (file.name.endsWith('.json')) {
                    reader.readAsText(file);
                } else {
                    reader.readAsArrayBuffer(file);
                }
            },
            onError: (error) => {
                toast({
                    variant: "destructive",
                    title: "上传失败",
                    description: "请检查文件是否正确",
                    duration: 1000
                });
                console.error("Error during file upload:", error);
                setLoading(false);
            },
        });
    }

    return {
        loading,
        memos,
        importedMemos,
        importData
    }
}

export default useImportMemos;