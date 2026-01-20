// components/EquipmentForm.tsx
import React, { useState } from 'react';
import type { EquipmentFormData, EquipmentFormProps } from '../types/equipment';

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
      alert('กรุณาระบุวันที่รับอุปกรณ์ก่อน');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="เช่น EQ-001"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="เช่น Emergency Room"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="เช่น X-Ray Machine"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="เช่น Philips"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="เช่น HC-5000"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            step="0.01"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10"
            step="0.01"
          />
          <p className="text-xs text-gray-500 mt-1">ถ้าผู้ใช้ตั้งค่ารุ่น เริ่ม 10 ปี</p>
        </div>

        {/* Calculate Age Button */}
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={calculateAge}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">ปีรับเครื่อง + อายุคาดหวัง</p>
        </div>

        {/* Technology Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            คะแนนเทคโนโลยี (0-100)
          </label>
          <input
            type="number"
            name="technology"
            value={formData.technology || ''}
            onChange={handleNumberChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            min="0"
            max="100"
            step="0.01"
          />
        </div>

        {/* Usage Statistics Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            คะแนนสถิติการใช้งาน (0-100)
          </label>
          <input
            type="number"
            name="usageStatistics"
            value={formData.usageStatistics || ''}
            onChange={handleNumberChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            min="0"
            max="100"
            step="0.01"
          />
        </div>

        {/* Efficiency Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            คะแนนประสิทธิภาพ (0-100)
          </label>
          <input
            type="number"
            name="efficiency"
            value={formData.efficiency || ''}
            onChange={handleNumberChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            min="0"
            max="100"
            step="0.01"
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
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ระบุรายละเอียดเพิ่มเติม..."
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          บันทึก
        </button>
      </div>
    </form>
  );
};

export default EquipmentForm;