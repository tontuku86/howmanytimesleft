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

// Simple OG Image generation component
const OgImage: React.FC<OgImageProps> = ({
  count,
  activity,
  language,
  onImageGenerated,
  options = {}
}) => {
  const [elementId] = useState(`og-image-${Date.now()}`);
  
  // Single useEffect to handle the entire process
  useEffect(() => {
    // Function for language-specific content
    const getLanguageContent = () => {
      const fontSizes = { en: 26, zh: 30, ja: 28 };
      const titles = { en: 'How Many Times Left?', zh: '还能有几次？', ja: 'あと何回？' };
      
      const messages = {
        en: `You can ${activity} ${count} more times.`,
        zh: `你还能${activity}${count}次。`,
        ja: `あと${count}回、${activity}ができる。`
      };
      
      const lang = language || 'ja';
      return {
        fontSize: fontSizes[lang as keyof typeof fontSizes] || 28,
        title: titles[lang as keyof typeof titles] || 'あと何回？',
        message: messages[lang as keyof typeof messages] || `あと${count}回、${activity}ができる。`
      };
    };
    
    // Get the content based on language
    const content = getLanguageContent();
    
    // Create a container for the OG image with simple styling
    const container = document.createElement('div');
    container.id = elementId;
    
    // Set basic styles directly as string (simpler and more reliable)
    container.setAttribute('style', `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #1e293b, #0f172a);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: sans-serif;
      padding: 40px;
      box-sizing: border-box;
      overflow: hidden;
      z-index: -1;
    `);
    
    // Create simple HTML structure
    container.innerHTML = `
      <div style="
        background: rgba(30, 41, 59, 0.8);
        border-radius: 24px;
        padding: 40px 60px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(79, 70, 229, 0.2);
        max-width: 85%;
        position: relative;
        z-index: 1;
      ">
        <h1 style="
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 30px;
          color: #f1f5f9;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        ">${content.title}</h1>
        
        <div style="
          width: 120px;
          height: 4px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 2px;
          margin: 0 auto 30px;
        "></div>
        
        <div style="
          font-size: ${content.fontSize}px;
          margin-bottom: 30px;
          color: #f8fafc;
          font-weight: 600;
          line-height: 1.4;
          padding: 12px 0;
          text-align: center;
        ">${content.message}</div>
        
        <div style="
          width: 100%;
          height: 10px;
          background: rgba(100, 116, 139, 0.2);
          border-radius: 5px;
          margin-top: 25px;
          position: relative;
          overflow: hidden;
        ">
          <div style="
            width: ${Math.max(0, Math.min(100, Math.round(count / (count + 10) * 100)))}%;
            height: 100%;
            background: linear-gradient(90deg, #4f46e5, #7c3aed);
            border-radius: 5px;
            position: absolute;
            top: 0;
            left: 0;
          "></div>
        </div>
      </div>
      
      <div style="
        position: absolute;
        bottom: 30px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 16px;
        color: #94a3b8;
      ">howmanytimesleft.com</div>
    `;
    
    document.body.appendChild(container);
    
    // Longer delay to ensure rendering is complete
    const timeoutId = setTimeout(() => {
      const element = document.getElementById(elementId);
      
      if (!element) {
        console.error(`OgImage: Element with id "${elementId}" not found`);
        return;
      }
      
      console.log(`OgImage: Generating image from element #${elementId}`);
      
      // Simplified options with sensible defaults
      html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0f172a',
        logging: true,
        allowTaint: true,
        foreignObjectRendering: true,
        onclone: (clonedDoc) => {
          // Make sure the cloned element is visible in the cloned document
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.position = 'relative';
            clonedElement.style.top = '0';
            clonedElement.style.left = '0';
            clonedElement.style.zIndex = '1';
          }
        }
      }).then(canvas => {
        try {
          // Try PNG first
          try {
            const pngDataUrl = canvas.toDataURL('image/png');
            console.log(`OgImage: PNG generated, size: ${pngDataUrl.length}`);
            onImageGenerated(pngDataUrl);
          } catch (pngError) {
            // Fallback to JPEG if PNG fails
            console.warn('OgImage: PNG generation failed, trying JPEG', pngError);
            const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            onImageGenerated(jpegDataUrl);
          }
        } catch (error) {
          console.error('OgImage: Error converting canvas to data URL:', error);
        }
        
        // Clean up
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }).catch(error => {
        console.error('OgImage: Error generating image:', error);
      });
    }, 1000); // Increased to 1000ms (1 second)
    
    // Clean up function
    return () => {
      clearTimeout(timeoutId);
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, [count, activity, language, elementId, onImageGenerated, options]);
  
  return null;
};

export default OgImage; 