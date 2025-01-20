'use client'

import { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icon from '../Icon'
import { ExternalLinkIcon } from 'lucide-react'
import { fetchTitle } from '../../api/requestActions'
export interface LinkType {
    url: string;
    text: string | null;
    id?: string;
    memoId?: string;
    createdAt?: Date;
}
interface Props {
    link: LinkType | undefined
    setLink: (link: LinkType | undefined) => void
}

export default function LinkAction({ link, setLink }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [url, setUrl] = useState(link?.url ?? '')
    const [text, setText] = useState(link?.text ?? '')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setUrl(link?.url ?? '')
        setText(link?.text ?? '')
    }, [link])

    const handleSubmit = async () => {
        setLoading(true)
        setIsOpen(false)
        const title = await fetchTitle(url)
        setLink({ url, text: text || title })
        setLoading(false)
    }

    const isValidUrl = (string: string) => {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon"
                    className={`${link?.url ? 'text-blue-800 dark:text-blue-400' : ''} px-2 w-auto md:max-w-[10vw] max-w-[30vw]`}>
                    {
                        loading ? (
                            <Icon.Loader2 className="animate-spin" size={20} />
                        ) : link?.url ? (
                            <div className="inline-block truncate " title={text}>
                                {text}
                            </div>
                        ) : (
                            <Icon.Link size={20} />
                        )
                    }
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="url">超链接</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="url"
                                type="url"
                                placeholder="Enter URL"
                                value={url}
                                className="flex-grow truncate"
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            {url && (
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                                    aria-label="Open link in new tab"
                                >
                                    <ExternalLinkIcon className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="text">标题</Label>
                        <Input
                            disabled
                            id="text"
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSubmit} className="w-full" disabled={!isValidUrl(url) || loading}>
                        提交
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}