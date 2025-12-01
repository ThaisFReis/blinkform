import GraphBuilder from '@/components/GraphBuilder';

export const Canvas = () => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-primary-foreground">
      <GraphBuilder />
    </div>
  );
};
