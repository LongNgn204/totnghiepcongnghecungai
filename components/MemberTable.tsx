
import React from 'react';
import { MemberAssignment } from '../types';

interface MemberTableProps {
  assignments: MemberAssignment[];
}

const MemberTable: React.FC<MemberTableProps> = ({ assignments }) => {
  return (
    <div className="bg-white  p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300  flex items-center">
        <i className="fas fa-users mr-3 text-teal-500"></i>Bảng phân công thành viên
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                Thành viên
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                Câu trắc nghiệm 4 lựa chọn
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                Câu trắc nghiệm Đúng/Sai
              </th>
            </tr>
          </thead>
          <tbody className="bg-white  divide-y divide-gray-200 ">
            {assignments.map((assignment, index) => (
              <tr key={index} className="hover:bg-gray-50 :bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ">
                  {assignment.memberName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                  {`Câu ${assignment.mcQuestions.join(', ')}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                  {`Câu ${assignment.tfQuestions.join(', ')}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTable;
