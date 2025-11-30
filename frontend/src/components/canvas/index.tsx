import GraphBuilder from '@/components/GraphBuilder';

export const Canvas = () => {
  return (
    <div className="flex-1 relative overflow-hidden bg-primary-foreground decoration-dotted">
      <GraphBuilder />
    </div>
  );
};
