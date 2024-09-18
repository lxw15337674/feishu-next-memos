'use client'
import React from 'react';
import Editor from '@/components/Editor';
import { useRequest } from 'ahooks';
import { createNewMemo } from '../api/larkActions';
import useMemoStore from '../store/memo';

const NewMemoEditor: React.FC = () => {
    const { fetchFirstData } = useMemoStore();
    const { runAsync: createRecord } = useRequest(createNewMemo, {
        manual: true,
        onSuccess: async () => {
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
