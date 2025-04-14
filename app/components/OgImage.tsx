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
      if (language === 'zh') return 28;
      if (language === 'en') return 24;
      return 26; // ja
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
    container.style.background = 'linear-gradient(45deg, #1a202c, #2d3748)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.color = 'white';
    container.style.fontFamily = '"Helvetica Neue", Arial, sans-serif';
    container.style.padding = '40px';
    container.style.textAlign = 'center';
    
    // タイトル
    const title = document.createElement('h1');
    title.textContent = getTitle();
    title.style.fontSize = '48px';
    title.style.marginBottom = '30px';
    title.style.color = '#f0f0f0';
    
    // 結果
    const result = document.createElement('h2');
    result.textContent = getText();
    result.style.fontSize = `${getFontSize()}px`;
    result.style.marginBottom = '40px';
    result.style.color = '#f8f8f8';
    result.style.background = 'rgba(79, 70, 229, 0.7)';
    result.style.padding = '20px 40px';
    result.style.borderRadius = '16px';
    result.style.maxWidth = '90%';
    
    // フッター
    const footer = document.createElement('div');
    footer.textContent = 'howmanytimesleft.com';
    footer.style.fontSize = '20px';
    footer.style.color = '#a0aec0';
    footer.style.position = 'absolute';
    footer.style.bottom = '30px';
    
    // 要素を組み立て
    container.appendChild(title);
    container.appendChild(result);
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
      backgroundColor: '#1a202c',
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