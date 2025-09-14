const Index = () => {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 float" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-white/10 float" style={{ animationDelay: '-1s' }}></div>
      </div>
      
      {/* Main content */}
      <div className="text-center text-white relative z-10 fade-in">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 transition-smooth hover:scale-105">
            Hello
          </h1>
          <h2 className="text-4xl md:text-6xl font-light opacity-90 transition-smooth hover:opacity-100">
            World
          </h2>
        </div>
        
        <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto leading-relaxed px-4">
          Welcome to your beautiful new application. This is where amazing things begin.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center px-4">
          <button className="px-8 py-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-white font-medium transition-smooth hover:bg-white/30 hover:scale-105 active:scale-95">
            Get Started
          </button>
          <button className="px-8 py-4 bg-transparent rounded-xl border border-white/50 text-white font-medium transition-smooth hover:bg-white/10 hover:scale-105 active:scale-95">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
