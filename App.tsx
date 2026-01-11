
import React, { useState, useRef } from 'react';
import { AnalysisStatus, FacialAnalysis } from './types';
import { analyzeFaceImages } from './services/geminiService';
import AnalysisDashboard from './components/AnalysisDashboard';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [images, setImages] = useState<{ front: string | null; side: string | null; angle: string | null }>({
    front: null,
    side: null,
    angle: null,
  });
  const [report, setReport] = useState<FacialAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputs = {
    front: useRef<HTMLInputElement>(null),
    side: useRef<HTMLInputElement>(null),
    angle: useRef<HTMLInputElement>(null),
  };

  const handleImageUpload = (type: 'front' | 'side' | 'angle') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setImages(prev => ({ ...prev, [type]: base64 }));
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!images.front || !images.side || !images.angle) return;
    
    setStatus(AnalysisStatus.ANALYZING);
    try {
      const result = await analyzeFaceImages(images.front, images.side, images.angle);
      setReport(result);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError("诊断系统暂时不可用，请稍后重试。");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const isReady = images.front && images.side && images.angle;

  return (
    <div className="min-h-screen">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <i className="fa-solid fa-microscope text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Pro Aesthetic Lab</h1>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Medical Grade AI</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-xs font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-2"><i className="fa-solid fa-check text-rose-500"></i> 三视角融合</span>
            <span className="flex items-center gap-2"><i className="fa-solid fa-check text-rose-500"></i> 骨相诊断</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR ? (
          <div className="animate-fade-in space-y-16">
            <div className="text-center space-y-6">
              <h2 className="text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                解构美学真相 <br />
                <span className="text-rose-500">全维三维诊断</span>
              </h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                为了获得最精准的临床级诊断建议，请分别上传您的正脸、90度正侧位及45度斜侧位照片。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <UploadBox 
                label="正面标准照 (Frontal)" desc="分析比例、对称性及轮廓平滑度"
                image={images.front} onClick={() => fileInputs.front.current?.click()} 
                refEl={fileInputs.front} onChange={handleImageUpload('front')}
              />
              <UploadBox 
                label="90° 正侧位 (Lateral)" desc="分析鼻唇角、下颌缘及四高三低"
                image={images.side} onClick={() => fileInputs.side.current?.click()} 
                refEl={fileInputs.side} onChange={handleImageUpload('side')}
              />
              <UploadBox 
                label="45° 斜侧位 (Oblique)" desc="分析中面部容量及面部平整度"
                image={images.angle} onClick={() => fileInputs.angle.current?.click()} 
                refEl={fileInputs.angle} onChange={handleImageUpload('angle')}
              />
            </div>

            {error && (
              <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-[2rem] text-center max-w-md mx-auto animate-shake font-bold">
                <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
              </div>
            )}

            <div className="flex flex-col items-center gap-8 pb-12">
              <button
                disabled={!isReady}
                onClick={startAnalysis}
                className={`w-full max-w-md py-6 rounded-full font-black text-xl transition-all shadow-2xl ${
                  isReady 
                  ? 'bg-slate-900 text-white hover:bg-black active:scale-95 shadow-slate-300' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                }`}
              >
                {isReady ? '生成临床级诊断报告' : '请补全三张诊断影像'}
              </button>
              <div className="flex gap-10 text-slate-300 text-xs font-black uppercase tracking-[0.2em]">
                 <span className="flex items-center gap-2"><i className="fa-solid fa-shield-halved"></i> 隐私加密传输</span>
                 <span className="flex items-center gap-2"><i className="fa-solid fa-dna"></i> 生物识别模型</span>
              </div>
            </div>
          </div>
        ) : status === AnalysisStatus.ANALYZING ? (
          <div className="max-w-md mx-auto text-center py-32 space-y-10">
            <div className="relative w-56 h-56 mx-auto">
               <div className="absolute inset-0 border-[16px] border-slate-50 rounded-full"></div>
               <div className="absolute inset-0 border-[16px] border-slate-900 rounded-full border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <i className="fa-solid fa-dna text-6xl text-rose-500 animate-pulse"></i>
               </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-slate-900">正在进行多轴视角诊断...</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">AI is synthesizing frontal, lateral, and oblique data</p>
            </div>
          </div>
        ) : (
          report && images.front && images.side && images.angle && 
          <AnalysisDashboard 
            data={report} 
            images={{ front: images.front, side: images.side, angle: images.angle }} 
          />
        )}
      </main>
    </div>
  );
};

const UploadBox = ({ label, desc, image, onClick, refEl, onChange }: any) => (
  <div 
    onClick={onClick}
    className="group relative cursor-pointer aspect-[3/4] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center bg-white hover:border-rose-500 hover:bg-rose-50/10 transition-all duration-500 shadow-xl shadow-slate-200/50 overflow-hidden"
  >
    {image ? (
      <>
        <img src={image} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt={label} />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <span className="bg-white/90 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">Update Photo</span>
        </div>
      </>
    ) : (
      <div className="text-center p-10 space-y-6">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-rose-500 group-hover:text-white transition-all shadow-inner">
          <i className="fa-solid fa-camera-retro text-3xl opacity-40 group-hover:opacity-100"></i>
        </div>
        <div className="space-y-2">
          <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">{label}</p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">{desc}</p>
        </div>
      </div>
    )}
    <input type="file" ref={refEl} onChange={onChange} className="hidden" accept="image/*" />
    {image && (
      <div className="absolute top-6 right-6 bg-rose-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl ring-4 ring-white">
        <i className="fa-solid fa-check-double"></i>
      </div>
    )}
  </div>
);

export default App;
