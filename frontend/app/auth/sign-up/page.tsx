import Link from "next/link"
import Image from "next/image"
import { Eye, Lock, Mail, Menu, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
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
                    <h1 className="text-center text-2xl sm:text-4xl font-bold tracking-tight text-primary">Create Account</h1>
                    <p className="mt-3 text-center text-sm text-muted-foreground sm:text-base">Start making smarter eco decisions</p>

                    <Card className="mx-auto mt-10 w-full max-w-155 rounded-[28px] border-0 bg-transparent shadow-card">
                        <CardContent className="space-y-5 p-5 sm:p-9">
                            <div className="space-y-2.5">
                                <Label htmlFor="name" className="text-sm font-semibold text-primary sm:text-base">Full Name</Label>
                                <div className="relative">
                                    <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input id="name" placeholder="Enter your full name" className="rounded-2xl border-2 border-input bg-background pl-12 text-lg placeholder:text-muted-foreground" />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="email" className="text-sm font-semibold text-primary sm:text-base">Email</Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input id="email" type="email" placeholder="Enter your email" className="rounded-2xl border-2 border-input bg-background pl-12 text-lg placeholder:text-muted-foreground" />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="password" className="text-sm font-semibold text-primary sm:text-base">Password</Label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input id="password" type="password" placeholder="Create a password" className="rounded-2xl border-2 border-input bg-background pl-12 pr-12 text-lg placeholder:text-muted-foreground" />
                                    <Eye className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="confirm-password" className="text-sm font-semibold text-primary sm:text-base">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input id="confirm-password" type="password" placeholder="Confirm your password" className="rounded-2xl border-2 border-input bg-background pl-12 pr-12 text-lg placeholder:text-muted-foreground" />
                                    <Eye className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <input
                                    id="agree-terms" 
                                    name="agree-terms"
                                    type="checkbox"
                                    className="mt-0.5 h-4 w-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                <label htmlFor="agree-terms" className="text-xs text-muted-foreground sm:text-sm">
                                    I agree to the <Link href="#" className="font-semibold text-primary">Terms &amp; Conditions</Link> and <Link href="#" className="font-semibold text-primary">Privacy Policy</Link>
                                </label>
                            </div>

                            <Button className="w-full text-base font-bold shadow-button sm:text-lg">Create Account</Button>
                        </CardContent>
                    </Card>

                    <p className="mt-8 text-center text-xs text-muted-foreground sm:text-sm">
                        Already have an account? <Link href="/auth/sign-in" className="font-semibold text-primary">Sign in</Link>
                    </p>
                </div>
            </section>
        </main>
    )
}
