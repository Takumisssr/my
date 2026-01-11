
import React, { useState } from 'react';
import { FacialAnalysis } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Props {
  data: FacialAnalysis;
  images: { front: string; side: string; angle: string };
}

const AnalysisDashboard: React.FC<Props> = ({ data, images }) => {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const threePartsData = [
    { name: '上庭', value: data.proportions.threeParts.upper },
    { name: '中庭', value: data.proportions.threeParts.middle },
    { name: '下庭', value: data.proportions.threeParts.lower },
  ];

  const fiveEyesData = [
    { name: '左外', value: data.proportions.fiveEyes.leftSide },
    { name: '左眼', value: data.proportions.fiveEyes.leftEye },
    { name: '间距', value: data.proportions.fiveEyes.middle },
    { name: '右眼', value: data.proportions.fiveEyes.rightEye },
    { name: '右外', value: data.proportions.fiveEyes.rightSide },
  ];

  const COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1'];

  const toggleFeature = (feature: string) => {
    setExpandedFeature(expandedFeature === feature ? null : feature);
  };

  return (
    <div className="space-y-12 pb-24 animate-fade-in">
      {/* Clinical Multi-View Header */}
      <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Frontal Perspective</span>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-slate-50">
              <img src={images.front} className="w-full h-full object-cover" alt="Front" />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lateral Perspective</span>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-slate-50">
              <img src={images.side} className="w-full h-full object-cover" alt="Side" />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Oblique Perspective</span>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-slate-50">
              <img src={images.angle} className="w-full h-full object-cover" alt="Angle" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-slate-50 pt-8">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-slate-900 mb-2">三维深度诊断报告</h2>
            <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
              结合多轴视角分析，当前面部美学均衡度评价为：<span className="text-rose-500 font-bold">"{data.summary}"</span>
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-xl shadow-slate-200">
            <div className="text-right">
              <p className="text-[10px] font-black opacity-50 uppercase">Score Index</p>
              <p className="text-xs font-bold">AESTHETIC-PRO</p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <span className="text-5xl font-black">{data.overallScore}</span>
          </div>
        </div>
      </div>

      {/* PRIMARY CLINICAL ROADMAP */}
      <div className="bg-slate-900 text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-3xl font-black flex items-center gap-4">
              <i className="fa-solid fa-syringe text-rose-500"></i> 医学整形及微调方案
            </h3>
            <div className="px-5 py-2 bg-white/10 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/10">Clinical Standard</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(data.suggestions.medicalBeauty || []).map((item, idx) => (
              <div key={idx} className="flex gap-6 p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all hover:bg-white/10 group/item">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center shrink-0 font-black text-xl shadow-lg group-hover/item:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                    <p className="text-slate-100 text-lg font-bold leading-relaxed">{item}</p>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Medical Directive</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Analysis */}
      <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h3 className="text-2xl font-black text-slate-900">器官级三维解构</h3>
            <p className="text-slate-400 mt-2 font-medium">点击展开查看多视角下的解剖结构分析</p>
          </div>
          <i className="fa-solid fa-layer-group text-slate-100 text-6xl"></i>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InteractiveFeatureCard 
            icon="fa-eye" title="眼周与眉弓 (Periorbital)" 
            content={data.features.eyes} isExpanded={expandedFeature === 'eyes'} onToggle={() => toggleFeature('eyes')}
          />
          <InteractiveFeatureCard 
            icon="fa-leaf" title="鼻部三维轴线 (Nasal Axis)" 
            content={data.features.nose} isExpanded={expandedFeature === 'nose'} onToggle={() => toggleFeature('nose')}
          />
          <InteractiveFeatureCard 
            icon="fa-lips" title="口周与唇部容量 (Perioral)" 
            content={data.features.lips} isExpanded={expandedFeature === 'lips'} onToggle={() => toggleFeature('lips')}
          />
          <InteractiveFeatureCard 
            icon="fa-user-circle" title="下颌缘及轮廓 (Jaw & Contour)" 
            content={data.features.jawline} isExpanded={expandedFeature === 'jawline'} onToggle={() => toggleFeature('jawline')}
          />
        </div>
      </div>

      {/* Proportions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ChartCard title="垂直比例 - 三庭" data={threePartsData} desc={data.proportions.threeParts.description} colors={COLORS} type="pie" />
        <ChartCard title="水平比例 - 五眼" data={fiveEyesData} desc={data.proportions.fiveEyes.description} colors={COLORS} type="bar" />
      </div>

      {/* Other recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <SuggestionBox title="专业修容及妆造" icon="fa-palette" items={data.suggestions.makeup} bg="bg-indigo-50/50" text="text-indigo-900" marker="text-indigo-400" />
        <SuggestionBox title="长期生活美学习惯" icon="fa-spa" items={data.suggestions.lifestyle} bg="bg-emerald-50/50" text="text-emerald-900" marker="text-emerald-400" />
      </div>

      <div className="flex flex-col items-center gap-8 pt-12">
        <button 
          onClick={() => window.location.reload()}
          className="px-16 py-6 bg-slate-900 text-white rounded-full font-black text-xl hover:bg-black transition-all shadow-2xl flex items-center gap-4 hover:scale-[1.02] active:scale-95"
        >
          <i className="fa-solid fa-rotate-right"></i> 重新开始诊断
        </button>
        <div className="text-center opacity-30 select-none">
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">Aesthetic Precision Medical Lab v3.0</p>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, data, desc, colors, type }: any) => (
  <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col">
    <h3 className="text-lg font-black text-slate-900 mb-10 uppercase tracking-widest flex items-center gap-4">
        <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span> {title}
    </h3>
    <div className="h-64 mb-10">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'pie' ? (
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={75} outerRadius={95} paddingAngle={10} dataKey="value">
              {data.map((_: any, index: number) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="none" />)}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        ) : (
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={60} fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" fill="#0f172a" radius={[0, 12, 12, 0]} barSize={24} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
    <div className="mt-auto bg-slate-50 p-8 rounded-3xl text-sm font-bold text-slate-600 leading-relaxed border border-slate-100">
      {desc}
    </div>
  </div>
);

const InteractiveFeatureCard = ({ icon, title, content, isExpanded, onToggle }: any) => (
  <div 
    onClick={onToggle}
    className={`group cursor-pointer flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500 ${
      isExpanded ? 'bg-slate-900 border-slate-900 shadow-2xl scale-[1.03]' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-300 shadow-sm'
    }`}
  >
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl shadow-inner flex items-center justify-center transition-all ${isExpanded ? 'bg-rose-500 text-white' : 'bg-white text-slate-400 group-hover:text-slate-900'}`}>
          <i className={`fa-solid ${icon} text-2xl`}></i>
        </div>
        <h4 className={`font-black text-xl tracking-tight ${isExpanded ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
      </div>
      <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isExpanded ? 'rotate-180 border-rose-500/30 text-rose-500' : 'border-slate-200 text-slate-300'}`}>
        <i className="fa-solid fa-chevron-down text-xs"></i>
      </div>
    </div>
    
    <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-16 opacity-40'}`}>
      <p className={`text-base leading-relaxed ${isExpanded ? 'text-slate-300' : 'text-slate-600 line-clamp-2'}`}>
        {content}
      </p>
      {isExpanded && (
        <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
           <div className="flex items-center gap-3 text-rose-500 text-[10px] font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              Clinical Insight
           </div>
           <i className="fa-solid fa-brain text-white/10 text-xl"></i>
        </div>
      )}
    </div>
  </div>
);

const SuggestionBox = ({ title, icon, items, bg, text, marker }: any) => (
  <div className={`${bg} rounded-[3rem] p-12 shadow-sm border border-slate-100`}>
    <h3 className={`text-2xl font-black ${text} mb-10 flex items-center gap-4`}>
      <i className={`fa-solid ${icon} opacity-50`}></i> {title}
    </h3>
    <ul className="space-y-8">
      {items.map((item: string, idx: number) => (
        <li key={idx} className={`flex gap-5 ${text} font-bold leading-relaxed group`}>
          <span className={`${marker} font-black text-2xl mt-[-4px] select-none`}>•</span>
          <span className="opacity-80 group-hover:opacity-100 transition-opacity">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default AnalysisDashboard;
