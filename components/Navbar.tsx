'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Flame, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [heat, setHeat] = useState(0)

  // 监听登录状态
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        // 获取用户的真实热度值
        const { data: profile } = await supabase
          .from('profiles')
          .select('heat')
          .eq('id', session.user.id)
          .single()
        if (profile) setHeat(profile.heat)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-900/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="bg-lime-400 w-8 h-8 rounded flex items-center justify-center">
             <span className="text-black font-black text-lg">T</span>
          </div>
          <div className="text-2xl font-black tracking-tighter text-white">
            Trend<span className="text-lime-400">X</span>
          </div>
        </Link>

        {/* 右侧状态栏 */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* 登录后显示热度 */}
              <div className="bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 text-xs font-mono font-bold text-lime-400 flex items-center gap-2 shadow-[0_0_15px_-5px_#84cc16]">
                <Flame size={14} fill="currentColor" /> {heat.toLocaleString()} Heat
              </div>
              {/* 登出按钮 (模拟头像点击) */}
              <button onClick={handleLogout} className="text-zinc-500 hover:text-white text-xs font-bold">
                [登出]
              </button>
            </>
          ) : (
            /* 未登录显示按钮 */
            <Link href="/login">
              <button className="bg-zinc-100 hover:bg-white text-black px-5 py-2 rounded-full text-sm font-bold transition">
                登录 / 注册
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}