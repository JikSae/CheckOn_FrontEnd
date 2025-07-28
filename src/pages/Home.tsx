const Home = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url('/bg.jpg')` }}
    >
      {/* 어두운 반투명 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* 콘텐츠 영역 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-5xl font-bold mb-6">Check.On</h1>
        <p className="text-xl md:text-2xl mb-8">
          설레는 여행, 떠나기 전 나만의 체크리스트로 완벽하게 준비하세요!
        </p>
        <button className="px-6 py-3 bg-white text-black rounded-full text-lg font-medium hover:bg-gray-200 transition">
          시작하기
        </button>
      </div>
    </div>
  )
}

export default Home

