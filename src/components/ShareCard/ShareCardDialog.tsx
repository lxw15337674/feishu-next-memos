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
import { Download } from 'lucide-react';
import { createApi } from 'unsplash-js';
import { Random } from 'unsplash-js/dist/methods/photos/types';

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

const getRandomImage = async () => {
    const unsplash = createApi({
        accessKey: process.env.UNSPLASH_ACCESS_CODE!,
    });
    const res = await unsplash.photos.getRandom({
        query: 'wallpapers',
        orientation: 'landscape',
    }).catch((e: any) => {
        console.error(e);
    });
    return (res?.response as Random)?.urls?.regular;
};

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

export function ShareCardDialog() {
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
                <DialogFooter>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={run}
                            disabled={loading}
                        >
                            换一张
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>
                                    <Download className="mr-2" />
                                    下载
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {ShardCards.map((item, index) => (
                                    <DropdownMenuItem
                                        key={item.name}
                                        onClick={() => {
                                            imageDownload(refs.current[index]);
                                        }}
                                    >
                                        {item.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}