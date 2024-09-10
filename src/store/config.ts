import { validateAccessCode, validateEditCode } from '@/api/actions';
import { create } from 'zustand';
import computed from 'zustand-middleware-computed';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { merge } from 'lodash-es';
import { immer } from 'zustand/middleware/immer';
// interface Config {
//     // memo正文是否显示标签
//     isShowTags: boolean;
//     // 分享卡片默认是否显示标签
//     isShowTagsInShareCard: boolean;
//     // 访问密码
//     accessCode: string;
//     // 编辑密码
//     editCode: string;
// }
interface CodeConfig {
    accessCode: string;
    editCode: string;
}
interface GeneralConfig {
    isShowTags: boolean;
    isShowTagsInShareCard: boolean;
}
interface Config {
    codeConfig: CodeConfig;
    generalConfig: GeneralConfig;
}
interface SettingStore {
    config: Config;
    // 重置通用配置
    resetGeneralConfig: () => void;
    resetCodeConfig: () => void;
    resetAllConfig: () => void;
    setConfig: (callback: (config: Config) => void) => void;
    setAccessCodePermission: (accessCode: string) => Promise<boolean>;
    setEditCodePermission: (editCode: string) => Promise<boolean>;
    hasAccessCodePermission: boolean;
    hasEditCodePermission: boolean;
}

const defaultConfig: Config = {
    codeConfig: {
        accessCode: '',
        editCode: '',
    },
    generalConfig: {
        isShowTags: true,
        isShowTagsInShareCard: false,
    }
};

const useConfigStore = create<SettingStore>()(
    devtools(
        persist(immer<SettingStore>(
            (set, get) => ({
                config: defaultConfig,
                hasAccessCodePermission: false,
                hasEditCodePermission: false,
                resetCodeConfig: () => {
                    set((state)=>{
                        state.config.codeConfig = { ...defaultConfig.codeConfig }
                    })
                },
                resetAllConfig: () => {
                    set((state)=>{
                        state.config = { ...defaultConfig }
                    })
                },
                resetGeneralConfig: () => {
                    set((state)=>{
                        state.config.generalConfig = { ...defaultConfig.generalConfig }
                    })
                },
                setConfig: (callback) => {
                    set(state=>{
                        callback(state.config)
                    })
                },
                setAccessCodePermission: async (code) => {
                    const hasAccessCodePermission = await validateAccessCode(code)
                    if (hasAccessCodePermission) {
                        set((state)=>{
                            state.config.codeConfig.accessCode = code
                            state.hasAccessCodePermission = true
                        })
                    }
                    return hasAccessCodePermission
                },
                setEditCodePermission: async (code) => {
                    const hasEditCodePermission = await validateEditCode(code)
                    if (hasEditCodePermission) {
                        set((state)=>{
                            state.config.codeConfig.editCode = code
                            state.hasEditCodePermission = true
                        })
                    }
                    return hasEditCodePermission
                }
            })),
            {
                name: 'configStore',
                storage: createJSONStorage(() => localStorage),
                partialize: state => ({ config: state.config }),
            },
        ),
        {
            name: 'configStore',
        }
    ),
)

export default useConfigStore;
