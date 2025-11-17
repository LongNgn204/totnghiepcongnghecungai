import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'sans-serif',
});

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      try {
        // Unique ID for each render
        const id = `mermaid-diagram-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: svgCode } = await mermaid.render(id, chart);
        if (isMounted) {
            setSvg(svgCode);
            setError(null);
        }
      } catch (e) {
        if (isMounted) {
            console.error(e);
            setError('Không thể hiển thị sơ đồ. Vui lòng kiểm tra cú pháp.');
        }
      }
    };

    renderDiagram();
    
    return () => {
        isMounted = false;
    }
  }, [chart]);

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default MermaidDiagram;
