import { PrismaClient, AttendanceStatus } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

const CSV_FILE_PATH = path.join(__dirname, '../import-data/Zihwa-attendance.csv');

// Clean names: Removes dots, special chars, and extra spaces
const clean = (name: string) => {
  return name.toLowerCase().replace(/\./g, ' ').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
};

async function main() {
  console.log('🚀 Starting Final Global Import for Jan 2026...');
  
  const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
  const records = parse(fileContent, { columns: false, skip_empty_lines: true });

  // 1. Fetch ALL employees and their associated Company details
  const allDbEmployees = await prisma.employee.findMany({
    include: { company: true } 
  });

  let totalCount = 0;

  for (const row of records) {
    const excelId = row[1]?.trim() || "";
    const excelName = row[2]?.trim() || "";

    if (!excelId || excelId === 'Employee No' || excelId === 'sl no' || !excelName || excelName === 'Name') continue;

    const targetName = clean(excelName);

    // 2. SEARCH: Find the person anywhere in the database
    const employee = allDbEmployees.find(emp => {
      const dbFirst = clean(emp.firstName || "");
      const dbLast = clean(emp.lastName || "");
      const dbFull = `${dbFirst} ${dbLast}`.trim();

      return dbFull === targetName || 
             dbFull.includes(targetName) || 
             targetName.includes(dbFull) ||
             (targetName.split(' ')[0] === dbFirst && dbFirst.length > 2);
    });

    if (!employee) {
      console.log(`❌ SKIP: "${excelName}" - Not found in any company.`);
      continue;
    }

    // This log shows you which company the DB is putting them in
    console.log(`✅ MATCH: "${excelName}" -> ${employee.company.name}`);

    // 3. Process Attendance
    for (let day = 1; day <= 31; day++) {
      const val = row[13 + day]?.trim().toUpperCase();
      if (!val || val === '-' || val === '') continue;

      let status: AttendanceStatus = 'PRESENT';
      if (val === 'A') status = 'ABSENT';
      else if (val.includes('EL') || val.includes('SL') || val === 'L') status = 'LEAVE';

      await prisma.attendanceRecord.upsert({
        where: { employeeId_date: { employeeId: employee.id, date: new Date(2026, 0, day, 12, 0, 0) } },
        update: { status },
        create: { 
          employeeId: employee.id, 
          date: new Date(2026, 0, day, 12, 0, 0), 
          status, 
          notes: `Imported Jan 2026: ${val}` 
        },
      });
      totalCount++;
    }
  }

  console.log(`🎉 FINISHED! Successfully updated ${totalCount} records.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());