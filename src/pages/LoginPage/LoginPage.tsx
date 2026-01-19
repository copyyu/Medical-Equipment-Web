import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineShieldCheck } from 'react-icons/hi2'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Mock login
        setTimeout(() => {
            setIsLoading(false)
            navigate('/')
        }, 1500)
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-dark">
                <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
            </div>

            {/* Floating Shapes */}
            <div className="floating-shape floating-shape-1"></div>
            <div className="floating-shape floating-shape-2"></div>
            <div className="floating-shape floating-shape-3"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            ></div>

            <div className="w-full max-w-md px-6 relative z-10 animate-scale-in">
                {/* Logo & Header */}
                <div className="text-center mb-8 animate-slide-up">
                    {/* Logo with Glow */}
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-50 animate-pulse-glow"></div>
                        <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl font-['Outfit']">ME</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-white font-['Outfit'] mb-2">
                        Medical Equipment
                    </h1>
                    <p className="text-gray-400 text-sm">
                        ระบบจัดการอุปกรณ์การแพทย์สำหรับผู้ดูแล
                    </p>
                </div>

                {/* Login Card - Glassmorphism */}
                <div className="card-glass p-8 animate-slide-up delay-200">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="animate-slide-up delay-300">
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                อีเมล
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                                <div className="relative">
                                    <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-accent-400 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@hospital.com"
                                        className="w-full py-3.5 pl-12 pr-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="animate-slide-up delay-400">
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                รหัสผ่าน
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                                <div className="relative">
                                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-accent-400 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••"
                                        className="w-full py-3.5 pl-12 pr-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between text-sm animate-slide-up delay-500">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 rounded-md border-2 border-gray-500 peer-checked:border-accent-500 peer-checked:bg-accent-500 transition-all flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">จดจำฉัน</span>
                            </label>
                            <a href="#" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
                                ลืมรหัสผ่าน?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group overflow-hidden py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed animate-slide-up delay-500"
                        >
                            {/* Button Background */}
                            <div className="absolute inset-0 bg-gradient-primary group-hover:scale-105 transition-transform duration-300"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                            {/* Button Content */}
                            <span className="relative flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        กำลังเข้าสู่ระบบ...
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineShieldCheck className="w-5 h-5" />
                                        เข้าสู่ระบบ
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}