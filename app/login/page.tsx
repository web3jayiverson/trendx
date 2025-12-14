'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false) // 切换注册/登录模式

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isSignUp) {
      // 注册逻辑
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: email.split('@')[0] } // 默认用邮箱前缀当昵称
        }
      })
      if (error) alert(error.message)
      else alert('注册成功！请检查邮箱验证链接 (或直接登录)')
    } else {
      // 登录逻辑
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) alert(error.message)
      else {
        router.push('/') // 登录成功，跳转回首页
        router.refresh() // 刷新页面以更新状态
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            Trend<span className="text-lime-400">X</span>
          </h1>
          <p className="text-zinc-500">登录以接入趋势网络</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="邮箱地址"
              required
              className="w-full bg-black border border-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:border-lime-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="密码"
              required
              className="w-full bg-black border border-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:border-lime-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 rounded-lg transition transform active:scale-95 disabled:opacity-50"
          >
            {loading ? '处理中...' : (isSignUp ? '注册账号' : '立即登录')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="hover:text-white underline decoration-zinc-700 underline-offset-4"
          >
            {isSignUp ? '已有账号？去登录' : '没有账号？创建新身份'}
          </button>
        </div>
      </div>
    </div>
  )
}