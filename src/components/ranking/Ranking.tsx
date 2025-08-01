import React from 'react'

const Ranking = () => {
  return (
          <table className="w-100% text-sm border-t border-b border-gray-400">
          <thead>
            <tr className="border-b border-gray-300 text-center">
              <th className="w-12 py-2">No</th>
              <th className="w-32">카테고리</th>
              <th className="w-[40%] text-center">준비물</th>
              <th className="w-24 text-right pr-2">추천수</th>
            </tr>
          </thead>

          <tbody>
              <tr
                className="border-t border-gray-200 hover:bg-gray-50 text-center"
              >
                <td className="py-2">1</td>
                <td>
                    <input
                      type="checkbox"
                    />
                </td>
                <td>ㅋㅋ</td>
                <td className="text-center text-blue-600 hover:underline">   
                    ㅋㅋㅋ
                </td>
              </tr>
          </tbody>

        </table>
  )
}

export default Ranking