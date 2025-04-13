'use client';

import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

// html2canvasの型定義を拡張
interface Html2CanvasOptions {
  scale?: number;
  useCORS?: boolean;
  backgroundColor?: string;
  logging?: boolean;
  allowTaint?: boolean;
  foreignObjectRendering?: boolean;
  width?: number;
  height?: number;
  windowWidth?: number;
  windowHeight?: number;
  x?: number;
  y?: number;
  scrollX?: number;
  scrollY?: number;
  proxy?: string;
}

interface OgImageProps {
  count: number;
  activity: string;
  language: string;
  onImageGenerated?: (dataUrl: string) => void;
}

export default function OgImage({ count, activity, language, onImageGenerated }: OgImageProps) {
  const ogRef = useRef<HTMLDivElement>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // 5回までの再試行を許可
    if (attempts > 5) {
      console.error('OgImage: Maximum attempts reached');
      return;
    }

    if (ogRef.current && onImageGenerated) {
      console.log('OgImage: Generating image for', activity, count, language, 'attempt:', attempts + 1);
      
      // DOMが完全にレンダリングされるまで待つ（時間を長めに）
      const timer = setTimeout(() => {
        if (!ogRef.current) return;
        
        const options: Html2CanvasOptions = {
          scale: 1.5, // 高解像度を維持しつつ、サイズ適正化
          useCORS: true, 
          backgroundColor: '#4F46E5', // 背景色をindigo-600に設定
          logging: true, // デバッグ用ロギングを有効化
          allowTaint: true, // 外部リソースの使用を許可
          foreignObjectRendering: false, // トラブルシューティングのため無効化
          width: 1200, // 明示的に幅を指定
          height: 630, // 明示的に高さを指定
          scrollX: 0, // スクロール位置を設定
          scrollY: 0
        };
        
        try {
          html2canvas(ogRef.current, options)
            .then(canvas => {
              try {
                // キャンバス情報をログ出力
                console.log('OgImage: Canvas created', {
                  width: canvas.width,
                  height: canvas.height,
                  context: canvas.getContext('2d') ? 'available' : 'not available'
                });
                
                // 複数の方法でDataURLを試行
                let dataUrl = '';
                try {
                  // 方法1: 標準的なtoDataURL
                  dataUrl = canvas.toDataURL('image/png');
                } catch (e) {
                  console.error('OgImage: Standard toDataURL failed', e);
                  try {
                    // 方法2: 品質パラメータ付きtoDataURL
                    dataUrl = canvas.toDataURL('image/png', 0.8);
                  } catch (e2) {
                    console.error('OgImage: Quality param toDataURL failed', e2);
                    try {
                      // 方法3: JPEGフォーマットを試す
                      dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    } catch (e3) {
                      console.error('OgImage: JPEG toDataURL failed', e3);
                    }
                  }
                }
                
                if (dataUrl && dataUrl.length > 100) {
                  console.log('OgImage: Image generated successfully', { 
                    canvasWidth: canvas.width,
                    canvasHeight: canvas.height,
                    dataUrlLength: dataUrl.length,
                    dataUrlStartsWith: dataUrl.substring(0, 30) + '...'
                  });
                  onImageGenerated(dataUrl);
                } else {
                  console.error('OgImage: Generated dataUrl is invalid', { 
                    length: dataUrl?.length || 0,
                    startsWith: dataUrl?.substring(0, 30) || 'empty'
                  });
                  // 再試行
                  setAttempts(prev => prev + 1);
                }
              } catch (err) {
                console.error('OgImage: Error processing canvas', err);
                // 再試行
                setAttempts(prev => prev + 1);
              }
            })
            .catch(error => {
              console.error('OgImage: Error generating image with html2canvas', error);
              // 再試行
              setAttempts(prev => prev + 1);
            });
        } catch (error) {
          console.error('OgImage: Exception during html2canvas call', error);
          // 再試行
          setAttempts(prev => prev + 1);
        }
      }, 800); // より長い遅延を追加（800ms）
      
      return () => clearTimeout(timer);
    }
  }, [count, activity, language, onImageGenerated, attempts]);

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
        padding: '40px',
        overflow: 'hidden'
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