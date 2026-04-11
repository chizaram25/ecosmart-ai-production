import Image from "next/image"
import { Eye, Lock, Menu } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-background px-4 py-3 sm:px-5 sm:py-4">
            <header className="flex items-center justify-between border-b border-border px-3 py-2 sm:px-3 sm:py-2">
                    <Image
                        src="/images/logo.png"
                        alt="EcoSmart AI logo"
                        width={130}
                        height={38}
                        priority
                        className="h-8 w-auto sm:h-9"
                    />
                    <button type="button" aria-label="Open menu" title="Open menu" className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
                        <Menu size={20} />
                    </button>
                </header>
            <section className="">
                <div className="px-4 py-8 sm:px-10 sm:py-12">
                    <h1 className="text-center text-2xl sm:text-4xl font-bold tracking-tight text-primary">Set New Password</h1>
                    <p className="mt-3 text-center text-base text-muted-foreground sm:text-xl">Create a strong password for your account</p>

                    <Card className="mx-auto mt-10 w-full max-w-155 rounded-[28px] border-0 bg-transparent shadow-card">
                        <CardContent className="space-y-5 p-5 sm:p-9">
                            <div className="space-y-2.5">
                                <Label htmlFor="password" className="text-sm font-semibold text-primary sm:text-base">New Password</Label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input id="password" type="password" placeholder="Enter new password" className="rounded-2xl border-2 border-input bg-background pl-12 pr-12 text-lg placeholder:text-muted-foreground" />
                                    <Eye className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="confirm-password" className="text-sm font-semibold text-primary sm:text-base">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input id="confirm-password" type="password" placeholder="Confirm new password" className="rounded-2xl border-2 border-input bg-background pl-12 pr-12 text-lg placeholder:text-muted-foreground" />
                                    <Eye className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="rounded-2xl bg-accent p-4 text-sm text-foreground sm:text-base">
                                <p className="font-medium">Password must contain:</p>
                                <ul className="mt-2 list-disc pl-6">
                                    <li className="text-primary">At least 8 characters</li>
                                    <li className="text-primary">One uppercase letter</li>
                                    <li className="text-primary">One number</li>
                                    <li className="text-primary">One special character (!@#$%^&*)</li>
                                </ul>
                            </div>

                            <Button className="w-full text-base font-bold shadow-button sm:text-lg">Reset Password</Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    )
}
