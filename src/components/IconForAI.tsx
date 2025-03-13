import { Gemini, Grok, Doubao, Qwen } from '@lobehub/icons';

export default function IconForAI(props: { name: string }) {
  switch (props.name) {
    case 'gemini':
      return <Gemini.Color />;
    case 'grok':
      return <Grok />;
    case 'doubao':
      return <Doubao.Color />;
    case 'qwen':
      return <Qwen.Color />;
  }
};
