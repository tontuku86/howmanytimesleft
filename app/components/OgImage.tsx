'use client';

import { useEffect, useRef } from 'react';

interface OgImageProps {
  count: number;
  activity: string;
  language: string;
  onImageGenerated?: (dataUrl: string) => void;
}

export default function OgImage({ count, activity, language, onImageGenerated }: OgImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && onImageGenerated) {
      console.log('OgImage: Creating image directly with canvas for', activity, count, language);
      
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error('OgImage: Could not get 2D context');
          return;
        }
        
        // キャンバスサイズ設定
        const width = 1200;
        const height = 630;
        canvas.width = width;
        canvas.height = height;
        
        // 背景グラデーション
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#4F46E5');  // indigo-600
        gradient.addColorStop(1, '#4338CA');  // indigo-700
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // デコレーション要素の追加
        ctx.fillStyle = 'rgba(129, 140, 248, 0.3)';
        ctx.beginPath();
        ctx.arc(width * 0.2, height * 0.2, width * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // タイトル
        const title = getLanguageTitle();
        ctx.font = 'bold 60px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(title, width / 2, height * 0.3);
        
        // 結果テキスト
        const resultText = getLanguageText();
        ctx.font = 'bold 72px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        
        // 長いテキストを複数行に分割
        const maxLineWidth = width * 0.8;
        const words = resultText.split(' ');
        let currentLine = '';
        let lines = [];
        
        // 英語と中国語の場合は単語分割
        if (language === 'en') {
          for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxLineWidth && i > 0) {
              lines.push(currentLine);
              currentLine = words[i] + ' ';
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine) lines.push(currentLine);
        } 
        // 日本語と中国語は文字数で分割
        else {
          const charsPerLine = language === 'zh' ? 12 : 14;
          for (let i = 0; i < resultText.length; i += charsPerLine) {
            lines.push(resultText.substr(i, charsPerLine));
          }
        }
        
        // 複数行のテキストを描画
        const lineHeight = 90;
        let yPos = height * 0.5;
        if (lines.length > 1) {
          yPos = height * 0.5 - ((lines.length - 1) * lineHeight) / 2;
        }
        
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], width / 2, yPos + i * lineHeight);
        }
        
        // ハッシュタグ（オプション）
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        const hashtag = language === 'en' ? '#HowManyTimesLeft' : 
                        language === 'zh' ? '#还剩几次' : '#あと何回';
        ctx.fillText(hashtag, width - 40, height - 40);
        
        // 画像をDataURLに変換して返す
        try {
          const dataUrl = canvas.toDataURL('image/png');
          console.log('OgImage: Canvas image generated successfully', {
            width: canvas.width,
            height: canvas.height,
            dataUrlLength: dataUrl.length
          });
          
          if (dataUrl && dataUrl.length > 100) {
            onImageGenerated(dataUrl);
          } else {
            console.error('OgImage: Invalid dataUrl generated');
          }
        } catch (err) {
          console.error('OgImage: Error converting canvas to dataURL', err);
          
          // JPEGフォーマットで再試行
          try {
            const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            console.log('OgImage: JPEG image generated as fallback', {
              dataUrlLength: jpegDataUrl.length
            });
            onImageGenerated(jpegDataUrl);
          } catch (jpegErr) {
            console.error('OgImage: JPEG fallback also failed', jpegErr);
          }
        }
      } catch (error) {
        console.error('OgImage: Canvas rendering error', error);
      }
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

  return (
    <div className="hidden">
      <canvas 
        ref={canvasRef} 
        width="1200" 
        height="630"
      />
    </div>
  );
} 