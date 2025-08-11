'use client';

import { useEffect, useRef } from 'react';
import Prism from 'prismjs';

// Import required languages and themes
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';

// Import CSS theme
import 'prismjs/themes/prism-tomorrow.css';

interface CodeBlockProps {
  code: string;
  language: 'javascript' | 'json' | 'typescript';
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className="relative w-full min-w-0">
      <div className="overflow-x-auto">
        <pre className="bg-gray-900 text-gray-100 p-4 text-sm max-h-96 overflow-y-auto min-w-0">
          <code 
            ref={codeRef}
            className={`language-${language} whitespace-pre block`}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}