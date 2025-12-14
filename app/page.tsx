import { supabase } from '@/lib/supabase'
import TopicCard from '@/components/TopicCard'
import { Flame } from 'lucide-react'
import Navbar from '@/components/Navbar'

// 强制动态渲染：保证用户每次刷新都能看到最新的热度数据
export const dynamic = 'force-dynamic'

export default async function Home() {
  // 1. 从数据库拉取话题数据
  const { data: topics, error } = await supabase
    .from('topics')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching topics:', error)
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-lime-400 selection:text-black">
      
      {/* 顶部导航栏 (Spotify 风格) */}
      <Navbar />git init

      {/* 主内容区 */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        
        {/* 巨大的标题 (Hero Section) */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
            定义<span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">流行趋势</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl">
            不要预测未来，去创造时间线。用你的热度值 (Heat) 决定什么是 Hype，什么是 Flop。
          </p>
        </div>

        {/* 分类标签 */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm hover:scale-105 transition">🔥 全部热榜</button>
          <button className="px-6 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold rounded-full text-sm hover:text-white hover:border-zinc-600 transition">🎮 竞技场</button>
          <button className="px-6 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold rounded-full text-sm hover:text-white hover:border-zinc-600 transition">🎬 名利场</button>
          <button className="px-6 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold rounded-full text-sm hover:text-white hover:border-zinc-600 transition">🕹️ 极客湾</button>
        </div>

        {/* 话题列表网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics && topics.length > 0 ? (
            topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))
          ) : (
            <div className="text-zinc-500 col-span-full text-center py-20">
              加载中... 如果长时间未显示，请检查数据库连接。
            </div>
          )}
        </div>

      </main>
    </div>
  )
}