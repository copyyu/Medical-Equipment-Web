// pages/AddEquipmentPage.tsx
import React, { useState } from 'react';
import EquipmentForm from '../../components/form/EquipmentForm';
import ExcelUpload from '../../components/form/ExcelUpload';
import type { EquipmentFormData } from '../../types/equipment';

type TabType = 'manual' | 'excel';

const AddEquipmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('manual');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // ฟังก์ชันสำหรับเพิ่มข้อมูลทีละรายการ
  const handleFormSubmit = async (data: EquipmentFormData) => {
    try {
      // TODO: เรียก API เพื่อบันทึกข้อมูล
      console.log('Form data to submit:', data);

      // จำลองการเรียก API
      // const response = await fetch('/api/equipment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      // แสดงข้อความสำเร็จ
      setSuccessMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
      setShowSuccessModal(true);

      // ซ่อนข้อความหลัง 3 วินาที
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  // ฟังก์ชันสำหรับจัดการหลังจากนำเข้า Excel สำเร็จ
  const handleImportComplete = () => {
    // Refresh data หรือทำอะไรต่อหลัง import สำเร็จ
    console.log('Import completed successfully');
    
    // อาจจะ refresh หน้าหรือโหลดข้อมูลใหม่
    // window.location.reload();
  };

  const handleCancel = () => {
    // TODO: กลับไปหน้าก่อนหน้า หรือ redirect ไปหน้ารายการอุปกรณ์
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">เพิ่มข้อมูลเครื่องมือแพทย์</h1>
              <p className="mt-1 text-gray-600">กรอกข้อมูลเครื่องมือแพทย์ใหม่ หรือนำเข้าข้อมูลจากไฟล์ Excel</p>
            </div>
          </div>
        </div>

        {/* Success Notification */}
        {showSuccessModal && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 min-w-[320px]">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold">สำเร็จ!</p>
                <p className="text-sm text-white/90">{successMessage}</p>
              </div>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-5 px-8 text-sm font-medium border-b-2 transition-all relative group ${
                  activeTab === 'manual'
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    activeTab === 'manual' ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <span className="font-semibold">กรอกข้อมูลด้วยตนเอง</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('excel')}
                className={`flex-1 py-5 px-8 text-sm font-medium border-b-2 transition-all relative group ${
                  activeTab === 'excel'
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    activeTab === 'excel' ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <span className="font-semibold">นำเข้าจาก Excel</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {activeTab === 'manual' ? (
            <div>
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="w-1 h-8 bg-blue-500 rounded-full mr-3"></span>
                  กรอกข้อมูลเครื่องมือ
                </h2>
                <p className="text-sm text-gray-500 mt-2 ml-4">
                  กรุณากรอกข้อมูลให้ครบถ้วน (<span className="text-red-500 font-semibold">*</span> = จำเป็นต้องกรอก)
                </p>
              </div>
              <EquipmentForm
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
              />
            </div>
          ) : (
            <div>
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="w-1 h-8 bg-blue-500 rounded-full mr-3"></span>
                  นำเข้าข้อมูลจาก Excel
                </h2>
                <p className="text-sm text-gray-500 mt-2 ml-4">
                  ดาวน์โหลด Template และกรอกข้อมูลให้ครบถ้วนก่อนนำเข้า
                </p>
              </div>
              <ExcelUpload onImportComplete={handleImportComplete} />
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="font-bold text-blue-900 text-lg mb-3">💡 คำแนะนำการใช้งาน</p>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>กรอกข้อมูลด้วยตนเอง:</strong> เหมาะสำหรับการเพิ่มข้อมูลทีละรายการ มีการตรวจสอบข้อมูลแบบ Real-time</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>นำเข้าจาก Excel:</strong> เหมาะสำหรับการเพิ่มข้อมูลจำนวนมากพร้อมกัน รองรับการนำเข้าหลายรายการในคลิกเดียว</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>ตรวจสอบความถูกต้อง:</strong> กรุณาตรวจสอบข้อมูลให้ครบถ้วนและถูกต้องก่อนบันทึกเพื่อป้องกันข้อผิดพลาด</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddEquipmentPage;