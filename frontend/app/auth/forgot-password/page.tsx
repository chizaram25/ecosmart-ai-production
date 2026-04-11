import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, Menu } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
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
                    <Link href="/auth/sign-in" className="inline-flex items-center gap-2 text-sm text-foreground sm:text-base">
                        <ArrowLeft className="size-5" />
                        Back to Sign In
                    </Link>

                    <h1 className="mt-6 text-center text-2xl sm:text-4xl font-bold tracking-tight text-primary">Forgot Password?</h1>
                    <p className="mt-3 text-center text-sm text-muted-foreground sm:text-base">No worries, we&apos;ll send you reset instructions</p>

                    <Card className="mx-auto mt-10 w-full max-w-155 rounded-[28px] border-0 bg-transparent shadow-card">
                        <CardContent className="space-y-5 p-5 sm:p-9">
                            <div className="space-y-2.5">
                                <Label htmlFor="email" className="text-sm font-semibold text-primary sm:text-base">Email Address</Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input id="email" type="email" placeholder="Enter your email" className="rounded-2xl border-2 border-input bg-background pl-12 text-lg placeholder:text-muted-foreground" />
                                </div>
                            </div>

                            <Button className="w-full text-base font-bold shadow-button sm:text-lg">Send Reset Link</Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    )
}
