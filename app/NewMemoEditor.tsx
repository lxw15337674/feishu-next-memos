'use client'
import React from 'react';
import Editor from '@/components/Editor';
import { useRequest } from 'ahooks';
import { createNewMemo } from '../src/api/dbActions';
import useMemoStore from '../src/store/memo';
import { useToast } from '../src/components/ui/use-toast';
import { startConfettiAnimation } from '../src/lib/utils';

const NewMemoEditor: React.FC = () => {
    const { fetchFirstData } = useMemoStore();
    const { toast } = useToast();
    const { runAsync: createRecord } = useRequest(createNewMemo, {
        manual: true,
        onSuccess: async () => {
            toast({
                title: '创建成功',
                description: '已成功创建新笔记',
            });
            startConfettiAnimation();
            fetchFirstData()
        }
    })
    return (
        <Editor onSubmit={createRecord} />
    );
};

export default NewMemoEditor;
