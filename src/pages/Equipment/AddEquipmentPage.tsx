// pages/AddEquipmentPage.tsx
import React, { useState } from 'react';

import EquipmentForm from '../../components/form/EquipmentForm';
import ExcelUpload from '../../components/form/ExcelUpload';
import type { EquipmentFormData } from '../../types/equipment';

interface EquipmentData {
  equipmentCode: string;
  equipmentName: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  price: string;
  location: string;
  status: string;
  description: string;
}

type TabType = 'manual' | 'excel';

const AddEquipmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('manual');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // ฟังก์ชันสำหรับเพิ่มข้อมูลทีละรายการ
  const handleFormSubmit = async (data: EquipmentData) => {
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

  // ฟังก์ชันสำหรับนำเข้าข้อมูลจาก Excel
  const handleExcelImport = async (data: EquipmentFormData[]) => {
    try {
      // TODO: เรียก API เพื่อบันทึกข้อมูลแบบ bulk
      console.log('Excel data to import:', data);

      // จำลองการเรียก API
      // const response = await fetch('/api/equipment/bulk', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ items: data })
      // });

      // แสดงข้อความสำเร็จ
      setSuccessMessage(`นำเข้าข้อมูลสำเร็จ ${data.length} รายการ`);
      setShowSuccessModal(true);

      // ซ่อนข้อความหลัง 3 วินาที
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);

    } catch (error) {
      console.error('Error importing data:', error);
      alert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล');
    }
  };

  const handleCancel = () => {
    // TODO: กลับไปหน้าก่อนหน้า หรือ redirect ไปหน้ารายการอุปกรณ์
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">เพิ่มข้อมูลเครื่องมือแพทย์</h1>
          <p className="mt-2 text-gray-600">กรอกข้อมูลเครื่องมือแพทย์ใหม่ หรือนำเข้าข้อมูลจากไฟล์ Excel</p>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
            <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('manual')}
                className={`py-4 px-8 text-sm font-medium border-b-2 transition-colors ${activeTab === 'manual'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>กรอกข้อมูลด้วยตนเอง</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('excel')}
                className={`py-4 px-8 text-sm font-medium border-b-2 transition-colors ${activeTab === 'excel'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>นำเข้าจาก Excel</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'manual' ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">กรอกข้อมูลเครื่องมือ</h2>
                <p className="text-sm text-gray-500 mt-1">กรุณากรอกข้อมูลให้ครบถ้วน (<span className="text-red-500">*</span> = จำเป็นต้องกรอก)</p>
              </div>
              <EquipmentForm
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
              />
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">นำเข้าข้อมูลจาก Excel</h2>
                <p className="text-sm text-gray-500 mt-1">ดาวน์โหลด Template และกรอกข้อมูลให้ครบถ้วนก่อนนำเข้า</p>
              </div>
              <ExcelUpload onDataImport={handleExcelImport} />
            </div>
          )}
        </div>

        {/* Info Box */}
        {/* <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="ml-3 text-sm text-blue-700">
              <p className="font-medium">คำแนะนำ:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>กรอกข้อมูลด้วยตนเอง: เหมาะสำหรับการเพิ่มข้อมูลทีละรายการ</li>
                <li>นำเข้าจาก Excel: เหมาะสำหรับการเพิ่มข้อมูลจำนวนมากพร้อมกัน</li>
                <li>กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนบันทึก</li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>

    </div>
  );
};

export default AddEquipmentPage;