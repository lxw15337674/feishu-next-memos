"use client";
import { useMemo, useRef } from "react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useBoolean, useRequest } from "ahooks";
import useShareCardStore from "@/store/shareCard";
import ImageBackgroundCard from "./ImageBackgroundCard";
import XiaohongshuCard from "./XiaohongshuCard";
import { toBlob } from "html-to-image";
import SpotifyCard from "./SpotifyCard";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { getRandomImage } from "@/api/actions";
import Icon from "../Icon";
import { getRandomImage } from "@/api/larkActions";

const ShardCards = [
    {
        name: '小红书风格',
        component: XiaohongshuCard
    },
    {
        name: '图片背景风格',
        component: ImageBackgroundCard
    },
    {
        name: 'Spotify风格',
        component: SpotifyCard
    }
]
const userName = process.env.USERNAME ?? 'Bhwa233'
const imageDownload = async (card: HTMLDivElement) => {
    if (!card) return;
    try {
        const blob = await toBlob(card, {
            width: card.clientWidth * 2,
            height: card.clientHeight * 2,
            cacheBust: true,
            style: {
                transform: "scale(2)",
                transformOrigin: "top left",
            },
        });

        if (!blob) return;
        const name = `${format(new Date(), 'yyyy-MM-dd')}`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.png`;
        a.click();
    } catch (e) {

    }
};
const ShareCardDialog = () => {
    const { text, open, setOpen } = useShareCardStore();
    const { data: url, run, loading } = useRequest(getRandomImage, {
        manual: false
    })
    const content = useMemo(() => {
        return text.map((content) => {
            return content.filter((item) => item.type === 'text' || item.type === 'tag')
        }).map((item) => {
            return item.map((i) => i.text).join('')
        });
    }, [text])
    const refs = useRef<HTMLDivElement[]>([]);

    return <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="md:max-w-[100vw] w-auto overflow-auto">
                <DialogHeader>
                    <DialogTitle>生成分享图</DialogTitle>
                    <DialogDescription>
                        <div className="mt-2 flex  overflow-auto max-h-[80vh] max-w-[80vw]">
                            {
                                ShardCards.map((item, index) => {
                                    const { name, component: Card } = item;
                                    return <div className="mr-4 " key={index}>
                                        <div className="text-center md:text-base mb-2 text-white">{name}</div>
                                        <div className="border">
                                            <Card
                                                url={url}
                                                cardRef={ref => {
                                                    if (ref) {
                                                        refs.current[index] = ref
                                                    }
                                                }}
                                                userName={userName}
                                                content={content}
                                                date={format(new Date(), 'yyyy-MM-dd')}
                                            />
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="space-y-4 md:space-y-0  md:space-x-2 space-x-0">
                    <Button variant="destructive"
                        onClick={() => setOpen(false)} className="w-full md:w-auto">
                        关闭
                    </Button>
                    <Button variant="outline" onClick={() => run()} disabled={loading} className="w-full md:w-auto">
                        {
                            loading && <Icon.Loader2 size={20} className="animate-spin " />
                        }
                        更换背景图
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button
                                variant="outline"
                                className="w-full md:w-auto"
                                disabled={loading}
                            >

                                下载
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {
                                ShardCards.map((item, index) => {
                                    return <DropdownMenuItem
                                        key={index}
                                        className="cursor-pointer"
                                        onClick={() => imageDownload(refs.current[index])}
                                    >
                                        下载{item.name}
                                    </DropdownMenuItem>
                                }
                                )
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>

                </DialogFooter>
            </DialogContent>
        </Dialog >
    </>
};


export default ShareCardDialog;