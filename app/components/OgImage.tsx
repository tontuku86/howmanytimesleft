'use client';

import React, { useEffect, useRef } from 'react';

interface OgImageProps {
  count: number;
  activity: string;
  language: string;
  percentage?: number;
  totalPossible?: number;
  onImageGenerated: (dataUrl: string) => void;
}

const OgImage: React.FC<OgImageProps> = ({ 
  count, 
  activity, 
  language, 
  percentage = 0,
  totalPossible = 0,
  onImageGenerated 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // キャンバスが存在することを確認
    if (!canvasRef.current) {
      console.error('OgImage: Canvas ref is null');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('OgImage: Failed to get canvas context');
      generateFallbackImage();
      return;
    }
    
    try {
      console.log('OgImage: Starting image generation...');
      
      // キャンバスサイズを設定
      canvas.width = 1200;
      canvas.height = 630;
      
      // 背景描画
      ctx.fillStyle = '#0f172a'; // ダークブルー背景
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // カード部分の描画
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)'; // ダークブルーのカード
      roundRect(ctx, 50, 50, canvas.width - 100, canvas.height - 100, 20);
      ctx.fill();
      
      // カードの枠線
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // テキスト設定
      ctx.textAlign = 'center';
      
      // タイトル
      let title;
      if (language === 'ja') {
        title = 'あと何回？';
      } else if (language === 'zh') {
        title = '还能做多少次？';
      } else {
        title = 'How Many Times Left?';
      }
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 60px sans-serif';
      ctx.fillText(title, canvas.width / 2, 150);
      
      // サブタイトル
      let message;
      if (language === 'ja') {
        message = `あなたは${activity}をあと${count}回できます`;
      } else if (language === 'zh') {
        message = `你还能${activity}${count}次`;
      } else {
        message = `You can ${activity} ${count} more times`;
      }
      
      ctx.font = 'bold 50px sans-serif';
      ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 30);
      
      // 結果
      ctx.fillStyle = '#f59e0b'; // オレンジ色
      ctx.font = 'bold 120px sans-serif';
      ctx.fillText(count.toString(), canvas.width / 2, canvas.height / 2 + 100);
      
      // プログレスバー背景
      const progressBarY = canvas.height / 2 + 170;
      ctx.fillStyle = '#4b5563'; // グレー
      roundRect(ctx, 200, progressBarY, 800, 20, 10);
      ctx.fill();
      
      // プログレスバー
      ctx.fillStyle = '#6366f1'; // インディゴ
      if (percentage > 0) {
        roundRect(ctx, 200, progressBarY, 800 * ((100 - percentage) / 100), 20, 10);
        ctx.fill();
      }
      
      // 進捗率テキスト
      ctx.fillStyle = '#e5e7eb';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`${100 - percentage}%`, canvas.width / 2, progressBarY + 50);
      
      // 合計可能回数
      let totalText;
      if (language === 'ja') {
        totalText = `合計で${totalPossible}回可能`;
      } else if (language === 'zh') {
        totalText = `一共可以${totalPossible}次`;
      } else {
        totalText = `Total possible: ${totalPossible} times`;
      }
      
      ctx.fillStyle = '#9ca3af';
      ctx.font = '24px sans-serif';
      ctx.fillText(totalText, canvas.width / 2, progressBarY + 90);
      
      // 画像URLを生成して親に渡す
      try {
        const dataUrl = canvas.toDataURL('image/png');
        console.log(`OgImage: Generated image successfully. Canvas dimensions: ${canvas.width}x${canvas.height}, Data URL length: ${dataUrl.length}`);
        onImageGenerated(dataUrl);
      } catch (error) {
        console.error('OgImage: Error converting canvas to data URL:', error);
        generateFallbackImage();
      }
    } catch (error) {
      console.error('OgImage: Error generating image:', error);
      generateFallbackImage();
    }
    
    // フォールバック画像生成
    function generateFallbackImage() {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('OgImage: Failed to get canvas context for fallback image');
        onImageGenerated(''); // 空の文字列を返して呼び出し元にエラーを通知
        return;
      }
      
      try {
        console.log('OgImage: Generating fallback image...');
        // シンプルな画像を作成
        canvas.width = 800;
        canvas.height = 400;
        
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('How Many Times Left?', canvas.width / 2, canvas.height / 2 - 60);
        
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 60px sans-serif';
        ctx.fillText(count.toString(), canvas.width / 2, canvas.height / 2 + 20);
        
        const dataUrl = canvas.toDataURL('image/png');
        console.log('OgImage: Generated fallback image URL of length:', dataUrl.length);
        onImageGenerated(dataUrl);
      } catch (error) {
        console.error('OgImage: Error generating fallback image:', error);
        onImageGenerated(''); // 空の文字列を返して呼び出し元にエラーを通知
      }
    }
    
    // 角丸長方形を描画する関数
    function roundRect(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
    
  }, [count, activity, language, percentage, totalPossible, onImageGenerated]);

  return (
    <div style={{ display: 'none' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default OgImage; 