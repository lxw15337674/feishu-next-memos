'use client'

import { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icon from '../Icon'
import { LinkType } from '../../api/type'
import { ExternalLinkIcon } from 'lucide-react'
import axios from 'axios'
import { fetchTitle } from '../../api/requestActions'

interface Props {
    link: LinkType
    setLink: (link: LinkType) => void
}

export default function LinkAction({ link, setLink }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [url, setUrl] = useState(link?.link ?? '')
    const [text, setText] = useState(link?.text ?? '')

    useEffect(() => {
        setUrl(link?.link ?? '')
        setText(link?.text ?? '')
    }, [link])

    const handleSubmit = async () => {
        const title = await fetchTitle(url);
        setLink({ link: url, text: text || title })
        setIsOpen(false)
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
        <div className='flex items-center space-x-2'>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon"
                        className={`${link.link ? 'text-blue-800 dark:text-blue-400' : ''} w-auto px-2`}>
                        {
                            link.link ? (
                                <span className="truncate max-w-[40vw]" title={text }>
                                    {text }
                                </span>
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
                                    className="flex-grow"
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
                            <Label htmlFor="text">文本 (Optional)</Label>
                            <Input
                                id="text"
                                type="text"
                                placeholder="Enter display text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleSubmit} className="w-full" disabled={!isValidUrl(url)}>
                            提交
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}