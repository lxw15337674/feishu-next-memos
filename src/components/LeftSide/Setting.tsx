'use client';
import * as React from 'react';
import { Settings } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from '../ui/switch';
import useConfigStore from '@/store/config';
import PasswordInput from '../PasswordInput';
import { Separator } from '../ui/separator';
import { useRouter } from 'next/navigation';
import { useThrottleFn } from 'ahooks';
import { useToast } from '../ui/use-toast';
import { useState } from 'react';
import { downloadFile, uploadFile } from '../../utils/file';
import { parseMastodonData } from '../../utils/importData';
import useImportMemos from './useImportMemos';
import Icon from '../Icon';
export function Setting() {
    const { config, setConfig, resetGeneralConfig, setEditCodePermission } = useConfigStore()
    const { toast } = useToast()
    const [editCode, setEditCode] = useState(config.codeConfig.editCode)
    const { run: debounceSetEditCodePermission } = useThrottleFn(async () => {
        const hasEditCodePermission = await setEditCodePermission(editCode)
        if (hasEditCodePermission) {
            toast({
                title: "密码正确",
                description: "已获得编辑权限",
                duration: 1000
            })
            return
        } else {
            toast({
                variant: "destructive",
                title: "密码错误",
                description: "请检查密码是否正确",
                duration: 1000
            })
            return
        }
    }, { wait: 500 })
    const router = useRouter()
    const { importData, memos, importedMemos, loading } = useImportMemos()

    const formatMastodonData = () => {
        uploadFile({
            accept: '.json',
            multiple: false,
            onSuccess: (files) => {
                const file: File = files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const jsonData = JSON.parse(event.target?.result as string);
                        const memosJsonData = parseMastodonData(jsonData)
                        downloadFile({
                            data: JSON.stringify(memosJsonData, null, 2),
                            filename: "formatted-mastodon-data.json"
                        })
                        toast({
                            title: "解析成功",
                            description: `已生成可导入的JSON文件，共${memosJsonData.length}条有效数据`,
                            duration: 1000
                        })
                    } catch (error) {
                        toast({
                            variant: "destructive",
                            title: "解析失败",
                            description: "请检查文件内容是否正确",
                            duration: 1000
                        });
                        console.error("Error parsing JSON file:", error);
                    }
                };
                reader.readAsText(file);
            },
            onError: (error) => {
                toast({
                    variant: "destructive",
                    title: "上传失败",
                    description: "请检查文件是否正确",
                    duration: 1000
                })
                console.error("Error during file upload:", error);
                // Your code to handle the error here 
            },
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" suppressHydrationWarning>
                    <Settings size={20} className="rotate-0 scale-100 transition-all" />
                    <span className="sr-only">Settings</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-68 max-h-[80vh] overflow-auto no-scrollbar" >
                <DialogHeader>
                    <DialogTitle>设置</DialogTitle>
                    <DialogDescription>
                        个性化设置
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between space-x-4">
                        <Label className="flex flex-col space-y-1">
                            <span>
                                简洁模式
                            </span>
                            <span className="text-xs font-normal leading-snug text-muted-foreground">
                                简洁模式下，不显示笔记的创建时间和修改时间,默认为关闭
                            </span>
                        </Label>
                        <Switch checked={
                            config.generalConfig.isSimpleMode
                        } onCheckedChange={(checked) => {
                            setConfig(config => {
                                config.generalConfig.isSimpleMode = checked
                                return config
                            })
                        }} />
                    </div>
                    <Button type="reset" className="w-full" variant="destructive" onClick={resetGeneralConfig}>
                        重置设置
                    </Button>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                        <Label className="flex flex-col space-y-1 ">
                            <span>
                                访问密码
                            </span>
                            <span className="text-xs font-normal leading-snug text-muted-foreground">
                                如果设置了访问密码，只有输入密码才能查看笔记
                            </span>
                        </Label>
                        <PasswordInput disabled className="w-full  " value={config.codeConfig.accessCode} />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex flex-col space-y-1 ">
                            <span>
                                编辑密码
                            </span>
                            <span className="text-xs font-normal leading-snug text-muted-foreground">
                                如果设置了编辑密码，只有输入密码才能编辑笔记
                            </span>
                        </Label>
                        <PasswordInput className="w-full" value={editCode} onChange={(e) => {
                            setEditCode(e.target.value)
                        }} />
                    </div>
                    <Button type="submit" className="w-full" onClick={debounceSetEditCodePermission}>
                        校验编辑密码
                    </Button>
                    <Button type="submit" className="w-full" variant="destructive" onClick={() => {
                        resetGeneralConfig()
                        router.push('/login')
                    }}>
                        重置密码
                    </Button>
                    <Separator className="my-4" />

                    <div className="space-y-2">
                        <Label className="flex flex-col space-y-1 ">
                            <span>
                                格式化Mastodon数据
                            </span>
                            <span className="text-xs font-normal leading-snug text-muted-foreground">
                                上传从Mastodon导出的JSON文件，将其格式化为支持导入的JSON文件
                            </span>
                        </Label>
                    </div>
                    <Button type="submit" className="w-full" onClick={formatMastodonData} >
                        上传Mastodon数据文件
                    </Button>
                    <div className="space-y-2">
                        <Label className="flex flex-col space-y-1 ">
                            <span>
                                导入数据
                            </span>
                            <span className="text-xs font-normal leading-snug text-muted-foreground">
                                导入格式化后的JSON数据
                            </span>
                        </Label>
                        <Button type="submit" className="w-full" onClick={importData} disabled={loading}>
                            {
                                loading ? (<><Icon.Loader2 size={20} className="animate-spin mr-1" />{`已上传${importedMemos}/${memos}条数据`}</>) : '导入数据文件'
                            }
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
