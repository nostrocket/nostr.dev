interface CodeBlockProps {
  code: string;
  language: 'javascript' | 'json' | 'typescript';
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto max-h-96 overflow-y-auto">
        <code className={`language-${language} whitespace-pre-wrap break-words`}>
          {code}
        </code>
      </pre>
    </div>
  );
}