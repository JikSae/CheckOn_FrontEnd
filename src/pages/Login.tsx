import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="w-screen h-screen  text-white flex flex-col">

         {/* TODO: 헤더 컴포넌트 자리 (추후 <Header /> 위치) */}
      <div className="h-20 w-full">
        {/* Header 자리입니다. 나중에 <Header /> 컴포넌트로 교체 예정 */}
      </div>

      {/* 로그인 영역 (나머지 전체를 차지) */}
      <main className="flex-1 flex justify-center items-center bg-[#FEFEFE]">
        <div className="w-full max-w-xl px-6 sm:px-12 mt-[-400px]">
          <h1 className="text-7xl font-bold text-center text-[#FF0000] mb-20">Check .On</h1>

          <div className="space-y-12">
            <div>
              <label className="block mb-3 text-lg text-[#1F2937] font-semibold" htmlFor="email">
                아이디        
              </label>
              <input
                type="email"
                id="email"
                placeholder="예) test123@check.com"
                className="w-full bg-[#FEFEFE] border-b border-gray-400 placeholder-gray-400 py-4 px-2 text-lg text-[#1F2937] focus:outline-none"
              />
            </div>

          
              <div>
                <label className="block mb-3 text-lg text-[#1F2937] font-semibold" htmlFor="password">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full bg-[#FEFEFE] border-b border-gray-400 py-4 px-2 text-lg text-[#1F2937] focus:outline-none"
                />
              </div>
              <button className="w-full py-5 text-lg bg-[#3B82F6] text-white font-bold rounded-lg hover:bg-blue-700 transition">
                로그인
              </button>
          </div>

          <div className="flex justify-center gap-6 text-lg text-[#1F2937] mt-12">
            <Link to="/signup" className="hover:underline text-[#1F2937]">회원가입</Link>
            <span>|</span>
            <Link to="/account-recovery?type=find-id" className="hover:underline text-[#1F2937]">아이디 찾기</Link>
            <span>|</span>
            <Link to="/account-recovery" className="hover:underline text-[#1F2937]">비밀번호 변경</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
