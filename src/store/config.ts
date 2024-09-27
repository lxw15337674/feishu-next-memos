import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { validateAccessCode, validateEditCode } from '../api/validActions';
interface CodeConfig {
    accessCode: string;
    editCode: string;
}

interface Config {
    codeConfig: CodeConfig;
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
    validateAccessCode: () => Promise<boolean>;
    hasAccessCodePermission: boolean;
    hasEditCodePermission: boolean;
}

const defaultConfig: Config = {
    codeConfig: {
        accessCode: '',
        editCode: '',
    },
   
};

const useConfigStore = create<SettingStore>()(
    devtools(
        persist(immer<SettingStore>(
            (set, get) => ({
                config: defaultConfig,
                hasAccessCodePermission: process.env.EDIT_CODE===undefined,
                hasEditCodePermission: process.env.EDIT_CODE===undefined,
                resetCodeConfig: () => {
                    set((state) => {
                        state.config.codeConfig = { ...defaultConfig.codeConfig }
                    })
                },
                resetAllConfig: () => {
                    set((state) => {
                        state.config = { ...defaultConfig }
                    })
                },
                resetGeneralConfig: () => {
                    set((state) => {
                        state.config.generalConfig = { ...defaultConfig.generalConfig }
                    })
                },
                setConfig: (callback) => {
                    set(state => {
                        callback(state.config)
                    })
                },
                validateAccessCode: async () => {
                    const hasAccessCodePermission = await validateAccessCode(get().config.codeConfig.accessCode)
                    set((state) => {
                        state.hasAccessCodePermission = hasAccessCodePermission
                    })
                    return hasAccessCodePermission
                },
                setAccessCodePermission: async (code) => {
                    const hasAccessCodePermission = await validateAccessCode(code)
                    if (hasAccessCodePermission) {
                        set((state) => {
                            state.config.codeConfig.accessCode = code
                            state.hasAccessCodePermission = true
                        })
                    }
                    return hasAccessCodePermission
                },
                setEditCodePermission: async (code) => {
                    const hasEditCodePermission = await validateEditCode(code)
                    if (hasEditCodePermission) {
                        set((state) => {
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
                partialize: state => {
                    return { config: state.config }
                }
            },
        ),
        {
            name: 'configStore',
        }
    ),
)

export default useConfigStore;
