import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import type { ExcelData, ExcelUploadProps } from '../../types/equipment';
import { importExcelFile } from '../../service/equipmentService';

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onImportComplete }) => {
  const [fileName, setFileName] = useState<string>('');
  const [previewData, setPreviewData] = useState<ExcelData[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    // Template ตามโครงสร้างที่ Backend ต้องการ
    const template = [
      {
        'รหัสอุปกรณ์': 'EQ-2024-001',
        'หมายเลขเครื่อง': 'SN123456789',
        'รหัสการประเมิน': 'ASSESS-2024-001',
        'แผนก': 'Radiology',
        'หมวดหมู่': 'MRI Scanner',
        'ยี่ห้อ': 'Siemens',
        'รุ่น': 'MAGNETOM Sola',
        'วันที่รับอุปกรณ์': '2020-01-15',
        'ราคาซื้อ': '2500000',
        'อายุการใช้งาน': '10',
        'อายุเครื่อง': '5.05',
        'วันที่คำนวณ': '2025-02-02',
        'อายุคงเหลือ': '4.95',
        '%การใช้งาน': '50.50',
        'ปีที่ต้องเปลี่ยน': '2030',
        'คะแนนเทคโนโลยี': '4.5',
        'คะแนนสถิติการใช้งาน': '4.0',
        'คะแนนประสิทธิภาพ': '4.2',
        'หมายเหตุ': 'Regular maintenance required',
        'ECRI Risk': 'HIGH',
        'Classification': 'Class IIb Medical Device'
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
      { wch: 25 }
    ];
    ws['!cols'] = wscols;

    XLSX.writeFile(wb, 'equipment_import_template.xlsx');
  };

  const getColumnValue = (row: any, thaiName: string, englishName: string): any => {
    return row[thaiName] || row[englishName] || '';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('กรุณาเลือกไฟล์ Excel (.xlsx หรือ .xls)');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setError('');
    setIsLoading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // แปลงข้อมูลให้ตรงกับ ExcelData type
      const mappedData: ExcelData[] = jsonData.map((row: any) => {
        const mapped: ExcelData = {
          // Basic Info - รองรับทั้งภาษาไทยและอังกฤษ
          idCode: getColumnValue(row, 'รหัสอุปกรณ์', 'ID CODE'),
          serialNo: getColumnValue(row, 'หมายเลขเครื่อง', 'Serial No'),
          assessmentId: getColumnValue(row, 'รหัสการประเมิน', 'Assessment ID'),

          // Relations
          department: getColumnValue(row, 'แผนก', 'Department'),
          category: getColumnValue(row, 'หมวดหมู่', 'Equipment Category'),
          brand: getColumnValue(row, 'ยี่ห้อ', 'Brand'),
          model: getColumnValue(row, 'รุ่น', 'Model'),

          // Date & Price
          receiveDate: parseExcelDate(getColumnValue(row, 'วันที่รับอุปกรณ์', 'Receive Date')),
          purchasePrice: parseFloat(getColumnValue(row, 'ราคาซื้อ', 'Purchase price')) || 0,

          // Life Cycle
          lifeExpectancy: parseFloat(getColumnValue(row, 'อายุการใช้งาน', 'Life Expect')) || 10,
          equipmentAge: parseFloat(getColumnValue(row, 'อายุเครื่อง', 'Equipment Age')) || 0,
          computeDate: parseExcelDate(getColumnValue(row, 'วันที่คำนวณ', 'Compute Date')),
          remainLife: parseFloat(getColumnValue(row, 'อายุคงเหลือ', 'Remain Life')) || 0,
          usefulLifetimePercent: parseFloat(getColumnValue(row, '%การใช้งาน', '% of useful lifetime')) || 0,
          replacementYear: parseInt(getColumnValue(row, 'ปีที่ต้องเปลี่ยน', 'Replacement Year')) || 0,

          // Assessment Scores (0-5)
          technology: row['คะแนนเทคโนโลยี'] ? parseFloat(row['คะแนนเทคโนโลยี']) : null,
          usageStatistics: row['คะแนนสถิติการใช้งาน'] ? parseFloat(row['คะแนนสถิติการใช้งาน']) : null,
          efficiency: row['คะแนนประสิทธิภาพ'] ? parseFloat(row['คะแนนประสิทธิภาพ']) : null,
          others: getColumnValue(row, 'หมายเหตุ', 'Note'),

          // Excel-specific fields (optional)
          ecriRisk: row['ECRI Risk'] || '',
          classification: row['Classification'] || '',
          totalCM: row['Total of CM'] ? parseInt(row['Total of CM']) : undefined,
          totalCost: row['Total Cost'] ? parseFloat(row['Total Cost']) : undefined,
          perCostPrice: row['Per Cost Price'] ? parseFloat(row['Per Cost Price']) : undefined
        };

        return mapped;
      });
      setPreviewData(mappedData);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการอ่านไฟล์ กรุณาตรวจสอบไฟล์และลองใหม่อีกครั้ง');
      console.error('Error reading file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse Excel date to YYYY-MM-DD
  const parseExcelDate = (dateValue: any): string => {
    if (!dateValue) return '';

    // ถ้าเป็น "-" ให้คืนค่าว่าง
    if (dateValue === '-') return '';

    // If already in YYYY-MM-DD format
    if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateValue;
    }

    // If Excel serial date (number)
    if (typeof dateValue === 'number') {
      const date = new Date((dateValue - 25569) * 86400 * 1000);
      return date.toISOString().split('T')[0];
    }

    // Try parsing as date string
    try {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (err) {
      console.log('Date parse error:', err);
    }

    return '';
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('ไม่มีไฟล์ที่เลือก');
      return;
    }

    if (previewData.length === 0) {
      setError('ไม่มีข้อมูลในไฟล์');
      return;
    }

    setIsImporting(true);
    setError('');

    try {
      // เรียก API ด้วย FormData
      const result = await importExcelFile(selectedFile);

      // แสดงผลลัพธ์
      const successMsg = buildSuccessMessage(result.data);
      alert(successMsg);

      // Clear form
      handleClear();

      // Callback
      if (onImportComplete) {
        onImportComplete();
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล';
      setError(errorMessage);
      console.error('Error importing file:', err);
    } finally {
      setIsImporting(false);
    }
  };

  const buildSuccessMessage = (result: any): string => {
    const lines = [
      `นำเข้าข้อมูลสำเร็จ!`,
      ``,
      `สรุปผลการนำเข้า:`,
      `- ทั้งหมด: ${result.total_rows} รายการ`,
      `- สำเร็จ: ${result.success_count} รายการ`,
      `- ล้มเหลว: ${result.failed_count} รายการ`,
      `- ข้าม: ${result.skipped_count} รายการ`,
    ];

    if (result.new_brands > 0 || result.new_categories > 0 || result.new_departments > 0 || result.new_models > 0) {
      lines.push(``);
      lines.push(`ข้อมูลหลักที่สร้างใหม่:`);
      if (result.new_brands > 0) lines.push(`- ยี่ห้อ: ${result.new_brands}`);
      if (result.new_categories > 0) lines.push(`- หมวดหมู่: ${result.new_categories}`);
      if (result.new_departments > 0) lines.push(`- แผนก: ${result.new_departments}`);
      if (result.new_models > 0) lines.push(`- รุ่น: ${result.new_models}`);
    }

    if (result.failed_count > 0 && result.error_messages?.length > 0) {
      lines.push(``);
      lines.push(`ข้อผิดพลาด:`);
      result.error_messages.slice(0, 5).forEach((msg: string) => {
        lines.push(`- ${msg}`);
      });
      if (result.error_messages.length > 5) {
        lines.push(`... และอีก ${result.error_messages.length - 5} ข้อผิดพลาด`);
      }
    }

    return lines.join('\n');
  };

  const handleClear = () => {
    setFileName('');
    setPreviewData([]);
    setError('');
    setSelectedFile(null);
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
          disabled={isLoading || isImporting}
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
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">เกิดข้อผิดพลาด</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Data */}
      {previewData.length > 0 && !isLoading && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm text-green-700">
                พบข้อมูล {previewData.length} รายการพร้อมนำเข้า
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
              disabled={isImporting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleImport}
              disabled={isImporting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center min-w-[120px] justify-center"
            >
              {isImporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังนำเข้า...
                </>
              ) : (
                <>นำเข้าข้อมูล</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUpload;