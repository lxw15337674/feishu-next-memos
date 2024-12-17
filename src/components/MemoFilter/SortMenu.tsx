'use client';
import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '../Icon';
import useFilterStore from '@/store/filter';

export function SortMenu() {
    const {
        desc,
        setDesc,
    } = useFilterStore();
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild >
                <Button variant="outline" size="sm">
                    {
                        desc === false ? '升序排列' : desc === true ? '降序排列' : '乱序排列'
                    }
                    <Icon.ChevronDown className="w-4 h-auto ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent suppressHydrationWarning>
                <DropdownMenuItem onClick={() => setDesc('random')}>
                    乱序排列
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDesc(false)}>
                    时间升序排列
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDesc(true)}>
                    时间降序排列
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
