import MatrixTerminal from '@/components/matrix/MatrixTerminal';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-black via-orange-950/5 to-black p-4">
      <div className="w-full max-w-6xl relative">
        <div className="absolute inset-0 -top-20 -bottom-20 bg-orange-500/5 blur-[100px] rounded-full" />
        <MatrixTerminal />
      </div>
    </main>
  );
}