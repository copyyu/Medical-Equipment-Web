// components/EquipmentForm.tsx
import React, { useState } from 'react';
import Swal from 'sweetalert2'; // ✅ อย่าลืม npm install sweetalert2
import type { EquipmentFormData, EquipmentFormProps } from '../../types/equipment';
import { createEquipment } from '../../service/equipmentService';

const EquipmentForm: React.FC<EquipmentFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<EquipmentFormData>({
    // Basic Info
    idCode: '',
    serialNo: '',
    department: '',
    brand: '',
    model: '',
    category: '',
    status: 'active',
    assetTypeName: '',
    assetName: '',
    assetId: '',
    ecriCode: '',

    // Status & Location
    assetStatusInternal: '',
    rentalStatus: '',
    borrowStatus: '',
    building: '',
    floor: '',
    room: '',
    phoneNo: '',

    // Business & Item Info
    businessName: '',
    itemNo: '',
    skuNo: '',

    // Dates
    receiveDate: '',
    purchaseDate: '',
    registrationDate: '',

    // Financial
    purchasePrice: '', // Using empty string for UI number inputs to show placeholder
    revenuePerMonth: '',

    // Lifecycle
    lifeExpectancy: 10,

    // Warranty
    warrantyPeriod: '',
    warrantyStartDate: '',
    warrantyEndDate: '',
    warrantyPm: '',
    warrantyCal: '',

    // PM & CAL
    lastPmDate: '',
    lastCalDate: '',
    pmPeriod: '',
    calPeriod: '',
    vendorPm: '',
    vendorCal: '',

    // Specs & Ownership
    powerConsumption: '',
    supplier: '',
    ownership: '',
    manufacturingCountry: '',

    // Documents
    poNo: '',
    contractNo: '',
    invoiceNo: '',
    documentNo: '',
    torNo: '',
    nsmartItemCode: '',

    // Misc
    remark: '',
    approvedBy: '',
    updatedBy: ''
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
      [name]: value === '' ? '' : parseFloat(value)
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
          idCode: '', serialNo: '', department: '', brand: '', model: '', category: '',
          status: 'active', assetTypeName: '', assetName: '', assetId: '', ecriCode: '',
          assetStatusInternal: '', rentalStatus: '', borrowStatus: '', building: '', floor: '', room: '', phoneNo: '',
          businessName: '', itemNo: '', skuNo: '',
          receiveDate: '', purchaseDate: '', registrationDate: '',
          purchasePrice: '', revenuePerMonth: '',
          lifeExpectancy: 10,
          warrantyPeriod: '', warrantyStartDate: '', warrantyEndDate: '', warrantyPm: '', warrantyCal: '',
          lastPmDate: '', lastCalDate: '', pmPeriod: '', calPeriod: '', vendorPm: '', vendorCal: '',
          powerConsumption: '', supplier: '', ownership: '', manufacturingCountry: '',
          poNo: '', contractNo: '', invoiceNo: '', documentNo: '', torNo: '', nsmartItemCode: '',
          remark: '', approvedBy: '', updatedBy: ''
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

        {/* -------- Section: Status & Location -------- */}
        <div className="md:col-span-2 pt-4 border-t border-gray-100 mt-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">สถานะ & สถานที่ตั้ง</h3>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            สถานะ (System Status)
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange as any}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
            <option value="disposed">Disposed</option>
          </select>
        </div>

        {/* Internal Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            สถานะภายใน (Internal Status)
          </label>
          <input
            type="text"
            name="assetStatusInternal"
            value={formData.assetStatusInternal}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น In-Use, In-Store"
          />
        </div>

        {/* Rental Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            สถานะการเช่า (Rental)
          </label>
          <input
            type="text"
            name="rentalStatus"
            value={formData.rentalStatus}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น เช่ามา, ให้เช่า, None"
          />
        </div>

        {/* Borrow Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            สถานะการยืม (Borrow)
          </label>
          <input
            type="text"
            name="borrowStatus"
            value={formData.borrowStatus}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น ยืมมา, ให้ยืม, None"
          />
        </div>

        {/* Building */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ตึก</label>
          <input
            type="text"
            name="building"
            value={formData.building}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น ตึกอำนวยการ"
          />
        </div>

        {/* Floor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ชั้น</label>
          <input
            type="text"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น ชั้น 3"
          />
        </div>

        {/* Room */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ห้อง</label>
          <input
            type="text"
            name="room"
            value={formData.room}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น ICU-301"
          />
        </div>

        {/* Phone No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์ (ถ้ามี)</label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น 02-123-4567 ext 301"
          />
        </div>

        {/* -------- Section: Extra Asset Info -------- */}
        <div className="md:col-span-2 pt-4 border-t border-gray-100 mt-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลเพิ่มเติม Asset</h3>
        </div>

        {/* Asset Type Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ประเภท(ชื่อเต็ม)</label>
          <input
            type="text"
            name="assetTypeName"
            value={formData.assetTypeName}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น Medical Device"
          />
        </div>

        {/* Asset Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ชื่ออุปกรณ์</label>
          <input
            type="text"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น Patient Monitor Type A"
          />
        </div>

        {/* Asset ID (Secondary ID) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asset ID ภายใน</label>
          <input
            type="text"
            name="assetId"
            value={formData.assetId}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น AST-449"
          />
        </div>

        {/* ECRI Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">รหัส ECRI</label>
          <input
            type="text"
            name="ecriCode"
            value={formData.ecriCode}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น 12-636"
          />
        </div>

        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อธุรกิจ / คลินิก</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น Corp Hospital Clinic"
          />
        </div>

        {/* Item No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Item No</label>
          <input
            type="text"
            name="itemNo"
            value={formData.itemNo}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น ITM-991"
          />
        </div>

        {/* SKU No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SKU No</label>
          <input
            type="text"
            name="skuNo"
            value={formData.skuNo}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น SKU-PH-MX400"
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
            ชื่อรุ่น <span className="text-red-500">*</span>
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

        {/* -------- Section: Documents & Financial -------- */}
        <div className="md:col-span-2 pt-4 border-t border-gray-100 mt-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลเอกสาร & การเงิน</h3>
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

        {/* Purchase Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            วันที่ซื้ออุปกรณ์
          </label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Registration Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            วันที่ลงทะเบียนทะเบียน
          </label>
          <input
            type="date"
            name="registrationDate"
            value={formData.registrationDate}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Purchase Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ราคาซื้อ (บาท)
          </label>
          <input
            type="number"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleNumberChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>

        {/* Revenue Per Month */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รายได้เฉลี่ย/เดือน (บาท)
          </label>
          <input
            type="number"
            name="revenuePerMonth"
            value={formData.revenuePerMonth}
            onChange={handleNumberChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>

        {/* PO Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PO No.</label>
          <input
            type="text"
            name="poNo"
            value={formData.poNo}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น PO-2401-449"
          />
        </div>

        {/* Contract Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contract No.</label>
          <input
            type="text"
            name="contractNo"
            value={formData.contractNo}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Invoice Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Invoice No.</label>
          <input
            type="text"
            name="invoiceNo"
            value={formData.invoiceNo}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Document Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Document No.</label>
          <input
            type="text"
            name="documentNo"
            value={formData.documentNo}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* TOR Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">TOR No.</label>
          <input
            type="text"
            name="torNo"
            value={formData.torNo}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* N-SMART Item Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">N-SMART Code</label>
          <input
            type="text"
            name="nsmartItemCode"
            value={formData.nsmartItemCode}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น NSM-888"
          />
        </div>

        {/* -------- Section: Lifecycle -------- */}
        <div className="md:col-span-2 pt-4 border-t border-gray-100 mt-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">อายุและวงจรชีวิตอุปกรณ์ (Lifecycle)</h3>
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

        {/* -------- Section: Warranty -------- */}
        <div className="md:col-span-2 pt-4 border-t border-gray-100 mt-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลประกัน (Warranty)</h3>
        </div>

        {/* Warranty Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ระยะเวลาประกัน</label>
          <input
            type="text"
            name="warrantyPeriod"
            value={formData.warrantyPeriod}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น 2 Years"
          />
        </div>

        {/* Warranty Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">วันเริ่มประกัน</label>
          <input
            type="date"
            name="warrantyStartDate"
            value={formData.warrantyStartDate}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Warranty End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">วันสิ้นสุดประกัน</label>
          <input
            type="date"
            name="warrantyEndDate"
            value={formData.warrantyEndDate}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Warranty PM */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ประกันการทำ PM</label>
          <input
            type="text"
            name="warrantyPm"
            value={formData.warrantyPm}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น Included, None"
          />
        </div>

        {/* Warranty CAL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ประกันการทำ CAL</label>
          <input
            type="text"
            name="warrantyCal"
            value={formData.warrantyCal}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น Included, None"
          />
        </div>

        {/* -------- Section: PM & CM -------- */}
        <div className="md:col-span-2 pt-4 border-t border-gray-100 mt-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลการบำรุงรักษา (PM & CAL)</h3>
        </div>

        {/* Last PM Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">วันที่ทำ PM ล่าสุด</label>
          <input
            type="date"
            name="lastPmDate"
            value={formData.lastPmDate}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Last CAL Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">วันที่ทำ CAL ล่าสุด</label>
          <input
            type="date"
            name="lastCalDate"
            value={formData.lastCalDate}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* PM Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">รอบการทำ PM</label>
          <input
            type="text"
            name="pmPeriod"
            value={formData.pmPeriod}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น 6 Months"
          />
        </div>

        {/* CAL Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">รอบการทำ CAL</label>
          <input
            type="text"
            name="calPeriod"
            value={formData.calPeriod}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น 1 Year"
          />
        </div>

        {/* Vendor PM */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ผู้รับเหมา/บริษัท ทำ PM</label>
          <input
            type="text"
            name="vendorPm"
            value={formData.vendorPm}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Vendor CAL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ผู้รับเหมา/บริษัท ทำ CAL</label>
          <input
            type="text"
            name="vendorCal"
            value={formData.vendorCal}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* -------- Section: Misc -------- */}
        <div className="md:col-span-2 pt-4 border-t border-gray-100 mt-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลจำเพาะและการตรวจประเมินอื่นๆ</h3>
        </div>

        {/* Power Consumption */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">อัตราสเปคไฟฟ้า (Power Consumption)</label>
          <input
            type="text"
            name="powerConsumption"
            value={formData.powerConsumption}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น 220V 50Hz"
          />
        </div>

        {/* Supplier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ผู้จัดจำหน่าย (Supplier)</label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น ABC Medical Devices Ltd."
          />
        </div>

        {/* Ownership */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">กรรมสิทธิ์/การครอบครอง (Ownership)</label>
          <input
            type="text"
            name="ownership"
            value={formData.ownership}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น Hospital Owned"
          />
        </div>

        {/* Manufacturing Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ประเทศที่ผลิต</label>
          <input
            type="text"
            name="manufacturingCountry"
            value={formData.manufacturingCountry}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น Germany"
          />
        </div>

        {/* Approved By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">อนุมัติโดย</label>
          <input
            type="text"
            name="approvedBy"
            value={formData.approvedBy}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น Dr. Smith"
          />
        </div>

        {/* Remarks / Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            หมายเหตุ (Remark)
          </label>
          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            disabled={loading}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            placeholder="เช่น Installed and calibrated. Ready for use."
          />
        </div>

        {/* Updated By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ผู้แก้ไขล่าสุด (Updated By)
          </label>
          <input
            type="text"
            name="updatedBy"
            value={formData.updatedBy}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="เช่น Admin User"
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