'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
}

export function MathRenderer({ content, className = '' }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const text = content;
    
    // Regular expression to match LaTeX expressions
    // Matches both inline $...$ and block $$...$$
    const inlineRegex = /\$([^$\n]+?)\$/g;
    const blockRegex = /\$\$([^$]+?)\$\$/g;

    let processedText = text;
    const fragments: Array<{ type: 'text' | 'math'; content: string; display: boolean }> = [];
    let lastIndex = 0;

    // Process block math first ($$...$$)
    let match;
    const blockMatches: Array<{ start: number; end: number; content: string }> = [];
    
    while ((match = blockRegex.exec(text)) !== null) {
      blockMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1]
      });
    }

    // Process inline math ($...$)
    const inlineMatches: Array<{ start: number; end: number; content: string }> = [];
    while ((match = inlineRegex.exec(text)) !== null) {
      // Check if this match is not inside a block math
      const isInsideBlock = blockMatches.some(
        bm => match!.index >= bm.start && match!.index < bm.end
      );
      if (!isInsideBlock) {
        inlineMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[1]
        });
      }
    }

    // Combine and sort all matches
    const allMatches = [
      ...blockMatches.map(m => ({ ...m, display: true })),
      ...inlineMatches.map(m => ({ ...m, display: false }))
    ].sort((a, b) => a.start - b.start);

    // Build fragments
    allMatches.forEach((match, idx) => {
      // Add text before match
      if (match.start > lastIndex) {
        fragments.push({
          type: 'text',
          content: text.substring(lastIndex, match.start),
          display: false
        });
      }

      // Add math
      fragments.push({
        type: 'math',
        content: match.content,
        display: match.display
      });

      lastIndex = match.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      fragments.push({
        type: 'text',
        content: text.substring(lastIndex),
        display: false
      });
    }

    // Render
    container.innerHTML = '';
    fragments.forEach(fragment => {
      if (fragment.type === 'text') {
        const textNode = document.createTextNode(fragment.content);
        container.appendChild(textNode);
      } else {
        try {
          const mathElement = document.createElement(fragment.display ? 'div' : 'span');
          mathElement.style.display = fragment.display ? 'block' : 'inline';
          mathElement.style.margin = fragment.display ? '1em 0' : '0';
          mathElement.style.textAlign = fragment.display ? 'center' : 'inherit';
          
          katex.render(fragment.content, mathElement, {
            throwOnError: false,
            displayMode: fragment.display,
          });
          
          container.appendChild(mathElement);
        } catch (error) {
          // If rendering fails, show the original LaTeX
          const errorSpan = document.createElement('span');
          errorSpan.textContent = fragment.display 
            ? `$$${fragment.content}$$` 
            : `$${fragment.content}$`;
          errorSpan.style.color = 'red';
          container.appendChild(errorSpan);
        }
      }
    });
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
      suppressHydrationWarning
    />
  );
}

