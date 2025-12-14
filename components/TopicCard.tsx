'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Zap, Flame, Snowflake } from 'lucide-react'

export default function TopicCard({ topic }: { topic: any }) {
  const [loading, setLoading] = useState(false)
  // 本地暂存数据，为了让你点按钮时看到即时变化
  const [localTopic, setLocalTopic] = useState(topic)

  // 计算 Hype (流行度) 算法
  const total = localTopic.pool_hype + localTopic.pool_flop
  // 防止除以0
  const hypePercent = total === 0 ? 50 : Math.round((localTopic.pool_hype / total) * 100)

  // 助力函数
  const handleBoost = async (side: 'hype' | 'flop') => {
    setLoading(true)
    
    // 调用我们在数据库写的 SQL 函数
    const { error } = await supabase.rpc('boost_topic', {
      p_topic_id: localTopic.id,
      p_amount: 100, // 每次点击注入 100 热度
      p_side: side
    })

    if (error) {
      alert('出错啦: ' + error.message)
    } else {
      // 模拟数据更新动画，让用户觉得很丝滑
      if (side === 'hype') {
        setLocalTopic({ ...localTopic, pool_hype: localTopic.pool_hype + 100 })
      } else {
        setLocalTopic({ ...localTopic, pool_flop: localTopic.pool_flop + 100 })
      }
    }
    setLoading(false)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all shadow-lg mb-6">
      
      {/* 上半部分：信息展示 */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase border border-zinc-700 px-2 py-1 rounded">
            {localTopic.category}
          </span>
          {hypePercent >= 60 && (
            <span className="flex items-center text-xs text-lime-400 font-bold gap-1 animate-pulse">
              <Zap size={14} fill="currentColor" /> TRENDING
            </span>
          )}
        </div>
        
        <h3 className="text-xl md:text-2xl font-black text-white mb-6 leading-tight">
          {localTopic.title}
        </h3>

        {/* 流行度进度条 (Spotify 风格) */}
        <div className="flex justify-between text-xs font-mono font-bold mb-2">
          <span className="text-lime-400">HYPE {hypePercent}%</span>
          <span className="text-zinc-500">FLOP {100 - hypePercent}%</span>
        </div>
        
        <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden flex">
          {/* Hype 绿色条 */}
          <div 
            className="bg-lime-400 h-full transition-all duration-500 ease-out shadow-[0_0_10px_#84cc16]" 
            style={{ width: `${hypePercent}%` }}
          ></div>
        </div>
        
        <div className="mt-2 text-xs text-zinc-600 text-right">
          总热度: {(total/1000).toFixed(1)}k
        </div>
      </div>

      {/* 下半部分：操作按钮 */}
      <div className="grid grid-cols-2 border-t border-zinc-800">
        <button 
          onClick={() => handleBoost('hype')}
          disabled={loading}
          className="py-4 bg-zinc-900 hover:bg-zinc-800 active:bg-lime-900/20 text-lime-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors border-r border-zinc-800"
        >
          <Flame size={18} /> 
          {loading ? '注入中...' : 'HYPE (爆)'}
        </button>
        
        <button 
          onClick={() => handleBoost('flop')}
          disabled={loading}
          className="py-4 bg-zinc-900 hover:bg-zinc-800 active:bg-red-900/20 text-zinc-400 hover:text-red-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Snowflake size={18} /> 
          {loading ? '注入中...' : 'FLOP (糊)'}
        </button>
      </div>
    </div>
  )
}