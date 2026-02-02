// components/EquipmentForm.tsx
import React, { useState } from 'react';
import Swal from 'sweetalert2'; // ✅ อย่าลืม npm install sweetalert2
import type { EquipmentFormData, EquipmentFormProps } from '../../types/equipment';
import { createEquipment } from '../../service/equipmentService';

const EquipmentForm: React.FC<EquipmentFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<EquipmentFormData>({
    idCode: '',
    serialNo: '',
    assessmentId: '',
    department: '',
    brand: '',
    model: '',
    category: '',
    receiveDate: '',
    purchasePrice: 0,
    equipmentAge: 0,
    computeDate: '',
    lifeExpectancy: 10,
    remainLife: 0,
    usefulLifetimePercent: 0,
    replacementYear: 0,
    technology: null,
    usageStatistics: null,
    efficiency: null,
    others: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : parseFloat(value)
    }));
  };

  const calculateAge = () => {
    if (!formData.receiveDate) {
      // 🔔 Alert แจ้งเตือน: กรณียังไม่ใส่วันที่
      Swal.fire({
        icon: 'warning',
        title: 'แจ้งเตือน',
        text: 'กรุณาระบุ "วันที่รับอุปกรณ์" ก่อนกดคำนวณครับ',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f59e0b', // สีส้ม
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'rounded-lg px-6'
        }
      });
      return;
    }

    const receiveDate = new Date(formData.receiveDate);
    const computeDate = new Date();

    // อายุเครื่อง = ปีปัจจุบัน - ปีรับเครื่อง
    const equipmentAge = parseFloat(
      ((computeDate.getTime() - receiveDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2)
    );

    // อายุคาดหวัง (default = 10 ปี)
    const lifeExpectancy = formData.lifeExpectancy || 10;

    // อายุคงเหลือ = อายุคาดหวัง - อายุเครื่อง
    const remainLife = parseFloat((lifeExpectancy - equipmentAge).toFixed(2));

    // %การใช้งาน = (อายุเครื่อง / อายุคาดหวัง) × 100
    const usefulLifetimePercent = parseFloat(((equipmentAge / lifeExpectancy) * 100).toFixed(2));

    // ปีที่ต้องเปลี่ยน = ปีรับเครื่อง + อายุคาดหวัง
    const replacementYear = receiveDate.getFullYear() + Math.ceil(lifeExpectancy);

    setFormData(prev => ({
      ...prev,
      equipmentAge: equipmentAge,
      computeDate: computeDate.toISOString().split('T')[0],
      remainLife: remainLife,
      usefulLifetimePercent: usefulLifetimePercent,
      replacementYear: replacementYear
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // เรียกใช้ service function
      const result = await createEquipment(formData);

      if (result.success) {
        // ✨ Alert สำเร็จ: แสดงข้อมูลสรุปสวยงาม
        await Swal.fire({
          title: 'บันทึกข้อมูลสำเร็จ!',
          html: `
            <div class="mt-2 p-4 bg-gray-50 rounded-lg text-left border border-gray-200">
              <p class="mb-1 text-sm text-gray-600">รหัสอุปกรณ์:</p>
              <p class="text-xl font-bold text-blue-600 mb-3">${result.data.id_code}</p>
              <div class="flex items-center">
                 <span class="text-sm text-gray-600 mr-2">สถานะ:</span>
                 <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                   ${result.data.status}
                 </span>
              </div>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#2563eb', // สีฟ้า
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: 'rounded-2xl shadow-xl',
            title: 'text-2xl font-bold text-gray-800'
          }
        });

        // เรียก callback function ที่ส่งมาจาก parent
        onSubmit(formData);

        // Reset form
        setFormData({
          idCode: '', serialNo: '', assessmentId: '', department: '', brand: '', model: '', category: '',
          receiveDate: '', purchasePrice: 0, equipmentAge: 0, computeDate: '', lifeExpectancy: 10,
          remainLife: 0, usefulLifetimePercent: 0, replacementYear: 0, technology: null,
          usageStatistics: null, efficiency: null, others: ''
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      
      // ❌ Alert ผิดพลาด: แจ้งเตือนชัดเจน
      Swal.fire({
        icon: 'error',
        title: 'บันทึกไม่สำเร็จ',
        text: errorMessage,
        confirmButtonText: 'ลองใหม่อีกครั้ง',
        confirmButtonColor: '#ef4444', // สีแดง
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'rounded-lg px-6'
        }
      });
      
      setError(errorMessage);
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message (เก็บไว้แสดงผลหน้าจอด้วย เพื่อความชัดเจน) */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md shadow-sm flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-bold">เกิดข้อผิดพลาด</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ID Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รหัสอุปกรณ์ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="idCode"
            value={formData.idCode}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น EQ-2024-001"
          />
        </div>

        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            หมายเลขเครื่อง <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="serialNo"
            value={formData.serialNo}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น SN123456789"
          />
        </div>

        {/* Assessment ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รหัสการประเมิน
          </label>
          <input
            type="text"
            name="assessmentId"
            value={formData.assessmentId}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น ASSESS-2024-001"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            แผนก <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น Radiology"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            หมวดหมู่ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น MRI Scanner"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ยี่ห้อ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น Siemens"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รุ่น <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น MAGNETOM Sola"
          />
        </div>

        {/* Receive Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            วันที่รับอุปกรณ์ <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="receiveDate"
            value={formData.receiveDate}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Purchase Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ราคาซื้อ (บาท) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleNumberChange}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>

        {/* Life Expectancy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            อายุการใช้งาน (ปี)
          </label>
          <input
            type="number"
            name="lifeExpectancy"
            value={formData.lifeExpectancy}
            onChange={handleNumberChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="10"
            step="0.1"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">ค่าเริ่มต้น 10 ปี</p>
        </div>

        {/* Calculate Age Button */}
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={calculateAge}
            disabled={loading || !formData.receiveDate}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-sm"
          >
            คำนวณอายุอุปกรณ์
          </button>
          <p className="text-xs text-gray-500 mt-2">
            คลิกเพื่อคำนวณ: อายุเครื่อง, อายุคงเหลือ, %การใช้งาน, ปีที่ต้องเปลี่ยน
          </p>
        </div>

        {/* Equipment Age (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            อายุเครื่อง (ปี)
          </label>
          <input
            type="number"
            value={formData.equipmentAge}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
            step="0.01"
          />
          <p className="text-xs text-gray-500 mt-1">ปีปัจจุบัน - ปีรับเครื่อง</p>
        </div>

        {/* Compute Date (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            วันที่คำนวณ
          </label>
          <input
            type="date"
            value={formData.computeDate}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Remain Life (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            อายุคงเหลือ (ปี)
          </label>
          <input
            type="number"
            value={formData.remainLife}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
            step="0.01"
          />
          <p className="text-xs text-gray-500 mt-1">อายุคาดหวัง - อายุเครื่อง</p>
        </div>

        {/* Useful Lifetime Percent (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            %การใช้งาน
          </label>
          <input
            type="number"
            value={formData.usefulLifetimePercent}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
            step="0.01"
          />
          <p className="text-xs text-gray-500 mt-1">(อายุเครื่อง / อายุคาดหวัง) × 100</p>
        </div>

        {/* Replacement Year (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ปีที่ต้องเปลี่ยน
          </label>
          <input
            type="number"
            value={formData.replacementYear}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">ปีรับเครื่อง + อายุคาดหวัง</p>
        </div>

        {/* Technology Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            คะแนนเทคโนโลยี (0-5)
          </label>
          <input
            type="number"
            name="technology"
            value={formData.technology ?? ''}
            onChange={handleNumberChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="0.0"
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        {/* Usage Statistics Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            คะแนนสถิติการใช้งาน (0-5)
          </label>
          <input
            type="number"
            name="usageStatistics"
            value={formData.usageStatistics ?? ''}
            onChange={handleNumberChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="0.0"
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        {/* Efficiency Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            คะแนนประสิทธิภาพ (0-5)
          </label>
          <input
            type="number"
            name="efficiency"
            value={formData.efficiency ?? ''}
            onChange={handleNumberChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="0.0"
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        {/* Others / Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            หมายเหตุเพิ่มเติม
          </label>
          <textarea
            name="others"
            value={formData.others}
            onChange={handleChange}
            disabled={loading}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            placeholder="ระบุรายละเอียดเพิ่มเติม..."
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium shadow-sm flex items-center min-w-[120px] justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังบันทึก...
            </>
          ) : (
            <>บันทึก</>
          )}
        </button>
      </div>
    </form>
  );
};

export default EquipmentForm;