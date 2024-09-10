'use client'
import React from 'react';
import Editor from '@/components/Editor';
import { useRequest } from 'ahooks';
import { createPageInDatabase } from '@/api/actions';
import useMemoStore from '@/store/memo';

const NewMemoEditor: React.FC = () => {
    const { insertMemo } = useMemoStore();
    const { runAsync: createRecord } = useRequest(createPageInDatabase, {
        manual: true,
        onSuccess: (data) => {
            insertMemo(data);
        }
    })
    return (
        <div >
            <Editor onSubmit={createRecord} />
        </div>
    );
};

export default NewMemoEditor;
