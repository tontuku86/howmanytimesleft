'use client';

import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';

interface OgImageProps {
  count: number;
  activity: string;
  language: string;
  onImageGenerated: (dataUrl: string) => void;
  options?: any;
}

const OgImage: React.FC<OgImageProps> = ({
  count,
  activity,
  language,
  onImageGenerated,
  options = {}
}) => {
  const [elementId] = useState(`og-image-${Date.now()}`);
  const [trigger, setTrigger] = useState(false);
  
  // 画像を生成するための要素を作成
  useEffect(() => {
    // 言語によってフォントサイズを調整
    const getFontSize = () => {
      if (language === 'zh') return 30;
      if (language === 'en') return 26;
      return 28; // ja
    };
    
    // 言語によってタイトルとテキストを設定
    const getTitle = () => {
      if (language === 'en') return 'How Many Times Left?';
      if (language === 'zh') return '还能有几次？';
      return 'あと何回？'; // ja
    };
    
    const getText = () => {
      if (language === 'en') return `You can ${activity} ${count} more times.`;
      if (language === 'zh') return `你还能${activity}${count}次。`;
      return `あと${count}回、${activity}ができる。`; // ja
    };
    
    // 要素を作成
    const container = document.createElement('div');
    container.id = elementId;
    container.style.width = '1200px';
    container.style.height = '630px';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.background = 'linear-gradient(135deg, #1e293b, #0f172a)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.color = 'white';
    container.style.fontFamily = '"Helvetica Neue", Arial, "Hiragino Sans", "Hiragino Kaku Gothic ProN", sans-serif';
    container.style.padding = '40px';
    container.style.textAlign = 'center';
    container.style.boxSizing = 'border-box';
    container.style.overflow = 'hidden';
    
    // 背景グラデーションを追加
    const bgGradient = document.createElement('div');
    bgGradient.style.position = 'absolute';
    bgGradient.style.top = '0';
    bgGradient.style.left = '0';
    bgGradient.style.width = '100%';
    bgGradient.style.height = '100%';
    bgGradient.style.background = 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.15) 0%, transparent 50%)';
    bgGradient.style.zIndex = '0';
    
    // カード
    const card = document.createElement('div');
    card.style.background = 'rgba(30, 41, 59, 0.8)';
    card.style.borderRadius = '24px';
    card.style.padding = '40px 60px';
    card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    card.style.backdropFilter = 'blur(10px)';
    card.style.border = '1px solid rgba(79, 70, 229, 0.2)';
    card.style.maxWidth = '85%';
    card.style.zIndex = '1';
    card.style.position = 'relative';
    
    // タイトル
    const title = document.createElement('h1');
    title.textContent = getTitle();
    title.style.fontSize = '48px';
    title.style.fontWeight = '700';
    title.style.marginBottom = '30px';
    title.style.color = '#f1f5f9';
    title.style.textShadow = '0 2px 4px rgba(0,0,0,0.1)';
    
    // 結果
    const result = document.createElement('div');
    result.style.fontSize = `${getFontSize()}px`;
    result.style.marginBottom = '30px';
    result.style.color = '#f8fafc';
    result.style.fontWeight = '600';
    result.style.lineHeight = '1.4';
    result.style.padding = '12px 0';
    
    // 結果テキスト
    const resultText = document.createElement('span');
    resultText.textContent = getText();
    
    // 装飾ライン
    const line = document.createElement('div');
    line.style.width = '120px';
    line.style.height = '4px';
    line.style.background = 'linear-gradient(90deg, #6366f1, #8b5cf6)';
    line.style.borderRadius = '2px';
    line.style.margin = '0 auto 30px';
    
    // 進捗バー背景
    const progressBg = document.createElement('div');
    progressBg.style.width = '100%';
    progressBg.style.height = '10px';
    progressBg.style.background = 'rgba(100, 116, 139, 0.2)';
    progressBg.style.borderRadius = '5px';
    progressBg.style.marginTop = '25px';
    progressBg.style.position = 'relative';
    progressBg.style.overflow = 'hidden';
    
    // 進捗バー
    const progress = document.createElement('div');
    // 100からパーセンテージを引いて残りを表示（例: 残り70%）
    const remainingPercentage = Math.max(0, Math.min(100, Math.round(count / (count + 10) * 100)));
    progress.style.width = `${remainingPercentage}%`;
    progress.style.height = '100%';
    progress.style.background = 'linear-gradient(90deg, #4f46e5, #7c3aed)';
    progress.style.borderRadius = '5px';
    progress.style.position = 'absolute';
    progress.style.top = '0';
    progress.style.left = '0';
    
    // フッター
    const footer = document.createElement('div');
    footer.textContent = 'howmanytimesleft.com';
    footer.style.fontSize = '16px';
    footer.style.color = '#94a3b8';
    footer.style.position = 'absolute';
    footer.style.bottom = '30px';
    footer.style.left = '0';
    footer.style.right = '0';
    footer.style.textAlign = 'center';
    
    // 装飾要素（円）
    const circle1 = document.createElement('div');
    circle1.style.position = 'absolute';
    circle1.style.width = '300px';
    circle1.style.height = '300px';
    circle1.style.borderRadius = '50%';
    circle1.style.background = 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)';
    circle1.style.top = '-100px';
    circle1.style.right = '-50px';
    circle1.style.zIndex = '0';
    
    const circle2 = document.createElement('div');
    circle2.style.position = 'absolute';
    circle2.style.width = '200px';
    circle2.style.height = '200px';
    circle2.style.borderRadius = '50%';
    circle2.style.background = 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)';
    circle2.style.bottom = '-50px';
    circle2.style.left = '-70px';
    circle2.style.zIndex = '0';
    
    // 要素を組み立て
    result.appendChild(resultText);
    progressBg.appendChild(progress);
    
    card.appendChild(title);
    card.appendChild(line);
    card.appendChild(result);
    card.appendChild(progressBg);
    
    container.appendChild(bgGradient);
    container.appendChild(circle1);
    container.appendChild(circle2);
    container.appendChild(card);
    container.appendChild(footer);
    
    document.body.appendChild(container);
    
    // 要素が追加された後に画像生成をトリガー
    setTimeout(() => setTrigger(true), 500);
    
    // クリーンアップ
    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, [count, activity, language, elementId]);
  
  // 画像生成処理
  useEffect(() => {
    if (!trigger) return;
    
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`OgImage: Element with id "${elementId}" not found`);
      return;
    }
    
    console.log(`OgImage: Generating image from element #${elementId}`);
    
    const defaultOptions = {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0f172a',
      logging: true,
      allowTaint: true,
      foreignObjectRendering: true
    };
    
    html2canvas(element, { ...defaultOptions, ...options })
      .then(canvas => {
        try {
          const dataUrl = canvas.toDataURL('image/png');
          console.log(`OgImage: Image generated successfully. Canvas size: ${canvas.width}x${canvas.height}, dataUrl length: ${dataUrl.length}`);
          onImageGenerated(dataUrl);
          
          // 生成完了後、要素を削除
          const el = document.getElementById(elementId);
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        } catch (error) {
          console.error('OgImage: Error converting canvas to data URL:', error);
        }
      }).catch(error => {
        console.error('OgImage: Error generating image:', error);
      });
  }, [elementId, onImageGenerated, options, trigger]);

  return null;
};

export default OgImage; 