const LandingPage = ({ onStartShopping }) => {
  return (
    <div className="min-h-[calc(100vh-70px)] bg-white flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col justify-center items-center px-6 py-20 bg-gradient-to-b from-green-50 to-white text-center">
        <span className="text-green-600 font-bold tracking-wider uppercase text-sm mb-4">
          Powered by Apriori Algorithm
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 max-w-4xl tracking-tight">
          Smart Groceries, <br className="hidden md:block" /> Delivered to You.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
          Shop for fresh produce, meats, and daily essentials. Our AI-driven recommendation engine suggests what you need, before you even know you need it.
        </p>
        <button 
          onClick={onStartShopping}
          className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
        >
          Start Shopping <span>→</span>
        </button>
      </div>

      {/* Feature Section */}
      <div className="bg-white py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center w-full">
        <div className="p-6 rounded-2xl bg-gray-50 shadow-sm border border-gray-100 transition hover:shadow-md">
          <div className="text-4xl mb-4">🥬</div>
          <h3 className="text-xl font-bold mb-2">Fresh & Local</h3>
          <p className="text-gray-500">Only the highest quality produce, sourced directly from local farms.</p>
        </div>
        <div className="p-6 rounded-2xl bg-gray-50 shadow-sm border border-gray-100 transition hover:shadow-md">
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-xl font-bold mb-2">Smart Recommendations</h3>
          <p className="text-gray-500">Our machine learning engine learns from thousands of baskets.</p>
        </div>
        <div className="p-6 rounded-2xl bg-gray-50 shadow-sm border border-gray-100 transition hover:shadow-md">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
          <p className="text-gray-500">A seamless, beautiful shopping experience from start to finish.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;