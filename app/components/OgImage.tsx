'use client';

import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

// html2canvasの型定義を拡張
interface Html2CanvasOptions {
  scale?: number;
  useCORS?: boolean;
  backgroundColor?: string;
  logging?: boolean;
  allowTaint?: boolean;
  foreignObjectRendering?: boolean;
}

interface OgImageProps {
  count: number;
  activity: string;
  language: string;
  onImageGenerated?: (dataUrl: string) => void;
}

export default function OgImage({ count, activity, language, onImageGenerated }: OgImageProps) {
  const ogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ogRef.current && onImageGenerated) {
      console.log('OgImage: Generating image for', activity, count, language);
      
      // DOMが完全にレンダリングされるまで少し待つ
      setTimeout(() => {
        if (!ogRef.current) return;
        
        html2canvas(ogRef.current, { 
          scale: 2, // 高品質化のためスケールを上げる
          useCORS: true, 
          backgroundColor: '#4F46E5', // 背景色をindigo-600に設定
          logging: true, // デバッグ用ロギングを有効化
          allowTaint: true, // 外部リソースの使用を許可
          foreignObjectRendering: true // 可能であればforeign objectレンダリングを使用
        } as Html2CanvasOptions).then(canvas => {
          try {
            const dataUrl = canvas.toDataURL('image/png');
            console.log('OgImage: Image generated successfully', { 
              canvasWidth: canvas.width,
              canvasHeight: canvas.height,
              dataUrlLength: dataUrl.length
            });
            onImageGenerated(dataUrl);
          } catch (err) {
            console.error('OgImage: Error converting canvas to dataURL', err);
          }
        }).catch(error => {
          console.error('OgImage: Error generating image', error);
        });
      }, 200); // 200msの遅延を追加
    }
  }, [count, activity, language, onImageGenerated]);

  const getLanguageTitle = () => {
    switch(language) {
      case 'en': return 'How Many Times Left?';
      case 'zh': return '还剩几次？';
      default: return 'あと何回？';
    }
  };

  const getLanguageText = () => {
    switch(language) {
      case 'en': return `You can ${activity} ${count} more times.`;
      case 'zh': return `你还能${activity}${count}次。`;
      default: return `あと${count}回、${activity}ができる。`;
    }
  };

  console.log('OgImage: Rendering component', { count, activity, language });

  return (
    <div
      ref={ogRef}
      style={{
        width: '1200px',
        height: '630px',
        position: 'relative',
        backgroundColor: '#4F46E5', // indigo-600
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'sans-serif',
        padding: '40px'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(129, 140, 248, 0.6), transparent)',
          zIndex: '1'
        }}
      />
      
      <h1
        style={{
          fontSize: '72px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
          zIndex: '2',
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }}
      >
        {getLanguageTitle()}
      </h1>
      
      <p
        style={{
          fontSize: '96px',
          fontWeight: 'bold',
          maxWidth: '80%',
          textAlign: 'center',
          lineHeight: 1.3,
          zIndex: '2',
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }}
      >
        {getLanguageText()}
      </p>
      
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '0',
          width: '100%',
          padding: '0 40px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          zIndex: '2'
        }}
      >
        <div
          style={{
            fontSize: '24px',
            opacity: 0.8,
            display: 'none'
          }}
        >
          #HowManyTimesLeft
        </div>
      </div>
    </div>
  );
} 