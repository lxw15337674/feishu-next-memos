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
import useFilterStore, { ImageFilter } from '@/store/filter';

export function FilterDropMenu() {
    const {
        setHasImageFilter,
    } = useFilterStore();
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild >
                <Button variant="outline" size="sm">
                    高级筛选
                    <Icon.ChevronDown className="w-4 h-auto ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent suppressHydrationWarning>
                <DropdownMenuItem onClick={() => setHasImageFilter(ImageFilter.HAS_IMAGE)}>
                    仅显示有图片
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHasImageFilter(ImageFilter.NO_IMAGE)}>
                    仅显示没有图片
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
