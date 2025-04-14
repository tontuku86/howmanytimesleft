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
      
      // 背景描画 (紫色のグラデーション)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#5138ED');
      gradient.addColorStop(1, '#673FD7');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // テキスト設定
      ctx.textAlign = 'center';
      
      // メインメッセージ
      let mainMessage;
      if (language === 'ja') {
        mainMessage = `あと${count}回、${activity}ができる。`;
      } else if (language === 'zh') {
        mainMessage = `还能${activity} ${count}次。`;
      } else {
        mainMessage = `You can ${activity} ${count} more times.`;
      }
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 60px sans-serif';
      ctx.fillText(mainMessage, canvas.width / 2, canvas.height / 2 - 40);
      
      // 残り割合テキスト
      let progressText;
      if (language === 'ja') {
        progressText = '残り割合';
      } else if (language === 'zh') {
        progressText = '剩余比例';
      } else {
        progressText = 'Remaining';
      }
      
      ctx.font = 'normal 40px sans-serif';
      ctx.fillText(progressText, canvas.width / 4, canvas.height / 2 + 80);
      
      // パーセンテージ
      ctx.font = 'bold 50px sans-serif';
      ctx.fillText(`${100 - percentage}%`, canvas.width * 3/4, canvas.height / 2 + 80);
      
      // プログレスバー背景
      const progressBarY = canvas.height / 2 + 120;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      roundRect(ctx, 200, progressBarY, 800, 30, 15);
      ctx.fill();
      
      // プログレスバー
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      if (percentage > 0) {
        roundRect(ctx, 200, progressBarY, 800 * ((100 - percentage) / 100), 30, 15);
        ctx.fill();
      }
      
      // 合計回数
      let totalText;
      if (language === 'ja') {
        totalText = `生涯で合計${totalPossible}回`;
      } else if (language === 'zh') {
        totalText = `一生总共${totalPossible}次`;
      } else {
        totalText = `Total in lifetime: ${totalPossible} times`;
      }
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '30px sans-serif';
      ctx.fillText(totalText, canvas.width / 2, progressBarY + 80);
      
      // ハッシュタグ
      let hashtag;
      if (language === 'ja') {
        hashtag = '#あと何回';
      } else if (language === 'zh') {
        hashtag = '#还剩几次';
      } else {
        hashtag = '#howmanytimesleft';
      }
      
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(hashtag, canvas.width - 50, canvas.height - 50);
      
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
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#5138ED');
        gradient.addColorStop(1, '#673FD7');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`あと${count}回`, canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText('#あと何回', canvas.width - 50, canvas.height - 30);
        
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