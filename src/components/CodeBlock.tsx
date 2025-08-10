interface CodeBlockProps {
  code: string;
  language: 'javascript' | 'json' | 'typescript';
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="relative w-full min-w-0">
      <div className="overflow-x-auto">
        <pre className="bg-gray-900 text-gray-100 p-4 text-sm max-h-96 overflow-y-auto min-w-0">
          <code className={`language-${language} whitespace-pre block`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}