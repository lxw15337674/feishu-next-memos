'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import useConfigStore from "@/store/config"
import { useState } from "react"
import { useRouter } from 'next/navigation';
import { useMount } from "ahooks"
import PasswordInput from "@/components/PasswordInput"

export default function Login() {
    const { setAccessCodePermission, validateAccessCode } = useConfigStore();
    const [password, setPassword] = useState('')
    const { toast } = useToast();
    const router = useRouter()
    useMount(async () => {
        validateAccessCode().then((hasAccessCodePermission) => {
            if (hasAccessCodePermission) {
                router.push('/')
                return
            }
        });
    })
    const onSubmit = async () => {
        const hasAccessCodePermission = await setAccessCodePermission(password ?? '')
        if (!hasAccessCodePermission) {
            toast({
                variant: "destructive",
                title: "密码错误",
                description: "请检查密码是否正确",
                duration: 1000
            })
            return
        }
        router.push('/')
    }

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>访问密码</DialogTitle>
                    <DialogDescription>
                        需要输入密码才能查看
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button type="submit" className="w-full" onClick={onSubmit}>
                        确定
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
