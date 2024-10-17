'use client'
import React from 'react';
import Editor from '@/components/Editor';
import { useRequest } from 'ahooks';
import { createNewMemo } from '../api/larkActions';
import useMemoStore from '../store/memo';
import { useToast } from '../components/ui/use-toast';

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
            fetchFirstData()
        }
    })
    return (
        <div >
            <Editor onSubmit={createRecord} />
        </div>
    );
};

export default NewMemoEditor;
