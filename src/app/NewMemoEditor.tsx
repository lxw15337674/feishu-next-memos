'use client'
import React from 'react';
import Editor from '@/components/Editor';
import { useRequest } from 'ahooks';
import { createNewMemo } from '../api/larkActions';

const NewMemoEditor: React.FC = () => {
    const { runAsync: createRecord } = useRequest(createNewMemo, {
        manual: true,
    })
    return (
        <div >
            <Editor onSubmit={createRecord} />
        </div>
    );
};

export default NewMemoEditor;
