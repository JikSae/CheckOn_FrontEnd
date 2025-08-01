import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFEFE] text-gray-800">
      
      {/* TODO: 헤더 컴포넌트 자리 */}
      <div className="h-20 w-full">{/* <Header /> 자리 */}</div>

      {/* 로그인 영역 */}
      <main className="flex-1 flex justify-center pt-12 sm:pt-2">
        <div className="w-full max-w-md px-4 sm:px-6">
          <h1 className="text-4xl sm:text-6xl font-bold text-center text-red-500 mb-12 sm:mb-16">
            Check .On
          </h1>

          <form className="space-y-10">
            <div>
              <label htmlFor="email" className="block mb-2 text-base sm:text-lg font-semibold">
                아이디
              </label>
              <input
                type="email"
                id="email"
                placeholder="예) test123@check.com"
                className="w-full bg-white border-b border-gray-400 placeholder-gray-400 py-3 px-2 text-base sm:text-lg focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-base sm:text-lg font-semibold">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                className="w-full bg-white border-b border-gray-400 py-3 px-2 text-base sm:text-lg focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 text-base sm:text-lg bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
            >
              로그인
            </button>
          </form>

          <div className="flex justify-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-700 mt-10">
            <Link to="/signup" className="hover:underline">회원가입</Link>
            <span>|</span>
            <Link to="/account-recovery?type=rest-id" className="hover:underline">아이디 찾기</Link>
            <span>|</span>
            <Link to="/account-recovery?type=reset-password" className="hover:underline">비밀번호 변경</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
