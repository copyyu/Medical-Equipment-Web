import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import type { ExcelData, ExcelUploadProps } from '../../types/equipment';

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onDataImport }) => {
  const [fileName, setFileName] = useState<string>('');
  const [previewData, setPreviewData] = useState<ExcelData[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    // สร้าง template Excel ตามโครงสร้างใหม่
    const template = [
      {
        'รหัสอุปกรณ์': 'EQ-2024-001',
        'หมายเลขเครื่อง': 'SN123456789',
        'รหัสการประเมิน': 'ASSESS-2024-001',
        'แผนก': 'Emergency Room',
        'หมวดหมู่': 'X-Ray Machine',
        'ยี่ห้อ': 'Philips',
        'รุ่น': 'MX800',
        'วันที่รับอุปกรณ์': '2020-03-15',
        'ราคาซื้อ': '1500000',
        'อายุการใช้งาน': '10',
        'อายุเครื่อง': '4.75',
        'วันที่คำนวณ': '2024-12-26',
        'อายุคงเหลือ': '5.25',
        '%การใช้งาน': '47.50',
        'ปีที่ต้องเปลี่ยน': '2030',
        'คะแนนเทคโนโลยี': '85.50',
        'คะแนนสถิติการใช้งาน': '92.00',
        'คะแนนประสิทธิภาพ': '88.75',
        'หมายเหตุ': 'ต้องการอัพเกรด software',
        'ECRI Risk': 'HIGH',
        'Classification': 'Class IIb Medical Device',
        'Total CM': '5',
        'Total Cost': '125000',
        'Per Cost Price': '0.083'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');

    // ปรับความกว้างคอลัมน์
    const wscols = [
      { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
      { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 },
      { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
      { wch: 20 }, { wch: 15 }, { wch: 30 }, { wch: 12 },
      { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 15 }
    ];
    ws['!cols'] = wscols;

    XLSX.writeFile(wb, 'equipment_template.xlsx');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    setIsLoading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // แปลงข้อมูลให้ตรงกับ ExcelData type ใหม่
      const mappedData: ExcelData[] = jsonData.map((row: any) => ({
        // Basic Info
        idCode: row['รหัสอุปกรณ์'] || '',
        serialNo: row['หมายเลขเครื่อง'] || '',
        assessmentId: row['รหัสการประเมิน'] || '',

        // Relations
        department: row['แผนก'] || '',
        category: row['หมวดหมู่'] || '',
        brand: row['ยี่ห้อ'] || '',
        model: row['รุ่น'] || '',

        // Date & Price
        receiveDate: row['วันที่รับอุปกรณ์'] || '',
        purchasePrice: parseFloat(row['ราคาซื้อ']) || 0,

        // Life Cycle
        lifeExpectancy: parseFloat(row['อายุการใช้งาน']) || 10,
        equipmentAge: parseFloat(row['อายุเครื่อง']) || 0,
        computeDate: row['วันที่คำนวณ'] || '',
        remainLife: parseFloat(row['อายุคงเหลือ']) || 0,
        usefulLifetimePercent: parseFloat(row['%การใช้งาน']) || 0,
        replacementYear: parseInt(row['ปีที่ต้องเปลี่ยน']) || 0,

        // Assessment Scores
        technology: row['คะแนนเทคโนโลยี'] ? parseFloat(row['คะแนนเทคโนโลยี']) : null,
        usageStatistics: row['คะแนนสถิติการใช้งาน'] ? parseFloat(row['คะแนนสถิติการใช้งาน']) : null,
        efficiency: row['คะแนนประสิทธิภาพ'] ? parseFloat(row['คะแนนประสิทธิภาพ']) : null,
        others: row['หมายเหตุ'] || '',

        // Excel-specific fields (optional)
        ecriRisk: row['ECRI Risk'] || '',
        classification: row['Classification'] || '',
        totalCM: row['Total CM'] ? parseInt(row['Total CM']) : undefined,
        totalCost: row['Total Cost'] ? parseFloat(row['Total Cost']) : undefined,
        perCostPrice: row['Per Cost Price'] ? parseFloat(row['Per Cost Price']) : undefined
      }));

      setPreviewData(mappedData);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการอ่านไฟล์ กรุณาตรวจสอบไฟล์และลองใหม่อีกครั้ง');
      console.error('Error reading file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (previewData.length === 0) {
      setError('ไม่มีข้อมูลในไฟล์');
      return;
    }
    onDataImport(previewData);
    handleClear();
  };

  const handleClear = () => {
    setFileName('');
    setPreviewData([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Download Template Button */}
      <div className="flex justify-end">
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>ดาวน์โหลด Template</span>
        </button>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          id="excel-upload"
        />
        <label htmlFor="excel-upload" className="cursor-pointer">
          <div className="flex flex-col items-center space-y-3">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {fileName || 'เลือกไฟล์ Excel หรือลากไฟล์มาวางที่นี่'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                รองรับไฟล์ .xlsx และ .xls เท่านั้น
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">กำลังอ่านไฟล์...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Preview Data */}
      {previewData.length > 0 && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm text-green-700">
                พบข้อมูล {previewData.length} รายการ
              </p>
            </div>
          </div>

          {/* Preview Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัส</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">แผนก</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยี่ห้อ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รุ่น</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.slice(0, 5).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.idCode}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.serialNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.brand}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 5 && (
              <div className="bg-gray-50 px-4 py-3 text-sm text-gray-500 text-center">
                และอีก {previewData.length - 5} รายการ...
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClear}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleImport}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              นำเข้าข้อมูล
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUpload;