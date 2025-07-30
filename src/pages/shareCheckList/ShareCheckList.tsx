import React from 'react'

const DUMMY_ITEMS = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  category: '교통',
  tag: '중요',
  text: `준비물 ${i + 1}`,
  date: '2025-07-28',
}));

const ShareCheckList = () => {
   // 페이징용 더미(1~5 페이지)
  const pages = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">

      {/* 메인 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <header className="bg-black p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">준비물 목록 공유</h1>
            <div className="text-sm">test123 님 반갑습니다.</div>
          </div>
        </header>

        {/* 본문 */}
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white text-black rounded-lg shadow p-6">
            {/* 테이블 */}
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">카테고리</th>
                  <th className="border px-4 py-2">태그</th>
                  <th className="border px-4 py-2">준비물</th>
                  <th className="border px-4 py-2">날짜</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_ITEMS.map(({ id, category, tag, text, date }) => (
                  <tr key={id} className="even:bg-gray-50">
                    <td className="border px-4 py-2 text-center">{id}</td>
                    <td className="border px-4 py-2">{category}</td>
                    <td className="border px-4 py-2">{tag}</td>
                    <td className="border px-4 py-2">{text}</td>
                    <td className="border px-4 py-2 text-center">{date}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이징 */}
            <div className="mt-6 flex justify-center space-x-2">
              {pages.map((p) => (
                <button
                  key={p}
                  className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ShareCheckList