'use client';

import React, { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

interface OgImageProps {
  count: number;
  activity: string;
  language: string;
  onImageGenerated: (dataUrl: string) => void;
}

// html2canvasのオプションインターフェースを拡張
interface Html2CanvasOptions {
  scale?: number;
  useCORS?: boolean;
  backgroundColor?: string;
  logging?: boolean;
  allowTaint?: boolean;
  foreignObjectRendering?: boolean;
}

const OgImage: React.FC<OgImageProps> = ({ count, activity, language, onImageGenerated }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // コンポーネントがマウントされた直後に画像を生成するのではなく
    // 少し遅延させてDOMが確実に描画された状態にする
    const timer = setTimeout(() => {
      if (!containerRef.current) {
        console.error('OgImage: Container ref is null');
        return;
      }

      console.log('OgImage: Starting image generation...');
      
      // html2canvasオプション
      const options: Html2CanvasOptions = {
        scale: 2, // 高画質のため2倍のスケール
        useCORS: true, // クロスオリジン画像対応
        backgroundColor: '#0f172a', // 背景色
        logging: true, // デバッグのためのロギング有効化
        allowTaint: true, // 外部画像によるキャンバスの汚染を許可
        foreignObjectRendering: true // SVGやその他の外部コンテンツの描画を改善
      };

      html2canvas(containerRef.current, options)
        .then(canvas => {
          try {
            // 画像URLを生成して親に渡す
            const dataUrl = canvas.toDataURL('image/png');
            console.log(`OgImage: Generated image successfully. Canvas dimensions: ${canvas.width}x${canvas.height}, Data URL length: ${dataUrl.length}`);
            onImageGenerated(dataUrl);
          } catch (error) {
            console.error('OgImage: Error converting canvas to data URL:', error);
            onImageGenerated(''); // 空の文字列を返して呼び出し元にエラーを通知
          }
        })
        .catch(error => {
          console.error('OgImage: Error generating image with html2canvas:', error);
          onImageGenerated(''); // 空の文字列を返して呼び出し元にエラーを通知
        });
    }, 200); // 200ms遅延

    return () => clearTimeout(timer);
  }, [count, activity, language, onImageGenerated]);

  // タイトルとメッセージの多言語対応
  const title = language === 'ja' 
    ? 'あと何回？' 
    : language === 'zh' 
      ? '还能做多少次？' 
      : 'How Many Times Left?';

  const message = language === 'ja'
    ? `あなたは${activity}をあと${count}回できます`
    : language === 'zh'
      ? `你还能${activity}${count}次`
      : `You can ${activity} ${count} more times`;

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'absolute', 
        left: '-9999px',
        width: '1200px',
        height: '630px',
        backgroundColor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px',
        fontFamily: 'sans-serif'
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '20px',
        border: '2px solid rgba(100, 116, 139, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px'
      }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '60px',
          fontWeight: 'bold',
          margin: '0 0 60px 0',
          textAlign: 'center'
        }}>
          {title}
        </h1>
        
        <p style={{
          color: '#ffffff',
          fontSize: '50px',
          fontWeight: 'bold',
          margin: '0 0 50px 0',
          textAlign: 'center'
        }}>
          {message}
        </p>
        
        <span style={{
          color: '#f59e0b',
          fontSize: '120px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {count}
        </span>
      </div>
    </div>
  );
};

export default OgImage; 