'use client';

import React, { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

interface OgImageProps {
  elementId: string;
  onImageGenerated: (dataUrl: string) => void;
  options?: Html2CanvasOptions;
  trigger?: boolean;
}

interface Html2CanvasOptions {
  scale?: number;
  useCORS?: boolean;
  backgroundColor?: string;
  logging?: boolean;
  allowTaint?: boolean;
  foreignObjectRendering?: boolean;
}

const OgImage: React.FC<OgImageProps> = ({
  elementId,
  onImageGenerated,
  options = {},
  trigger = false,
}) => {
  useEffect(() => {
    if (!trigger) return;

    // 少し遅延させてDOM要素が完全にレンダリングされるのを待つ
    const timeoutId = setTimeout(() => {
      const element = document.getElementById(elementId);
      
      if (element) {
        console.log(`OgImage: Generating image from element #${elementId}`);
        
        html2canvas(element, {
          scale: options.scale || 2,
          useCORS: options.useCORS || true,
          backgroundColor: options.backgroundColor || '#ffffff',
          logging: options.logging || true,
          allowTaint: options.allowTaint || true,
          foreignObjectRendering: options.foreignObjectRendering || true,
        }).then(canvas => {
          try {
            const dataUrl = canvas.toDataURL('image/png');
            console.log(`OgImage: Image generated successfully. Canvas size: ${canvas.width}x${canvas.height}, dataUrl length: ${dataUrl.length}`);
            onImageGenerated(dataUrl);
          } catch (error) {
            console.error('OgImage: Error converting canvas to data URL:', error);
          }
        }).catch(error => {
          console.error('OgImage: Error generating image:', error);
        });
      } else {
        console.error(`OgImage: Element with id "${elementId}" not found`);
      }
    }, 200); // 200ms遅延

    return () => clearTimeout(timeoutId);
  }, [elementId, onImageGenerated, options, trigger]);

  return null;
};

export default OgImage; 