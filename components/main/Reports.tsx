"use client";

import { Download, Loader2, NotepadText } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import moment from "moment";

const Reports = () => {
  const refDate = new Date()

  const reportData = [
    {
      title: "ภาพรวมกองทุนไทย",
      link: "https://dividend.sec.or.th/stat-report/TH_MF_Overview.pdf",
    },
    {
      title: "Dashboard ข้อมูลสถิติตลาดทุน ✨",
      link: "https://www.sec.or.th/TH/Pages/MarketData/MarketStatisticsDashboard.aspx",
    },
    {
      title: "รายละเอียดกองทุนรวมที่จดทะเบียนกับสำนักงาน จำแนกรายกองทุน",
      link: "https://dividend.sec.or.th/stat-report/MF_REGIS_TH.xls",
    },
    {
      title: "เงินลงทุนของกองทุนรวมทั่วไป จำแนกตามประเภทสินทรัพย์",
      link: "https://dividend.sec.or.th/stat-report/MF_PORT_TH.xls",
    },
    {
      title:
        "เงินลงทุนในต่างประเทศของกองทุนรวม จำแนกตามประเทศและภูมิภาคที่ไปลงทุน",
      link: "https://dividend.sec.or.th/stat-report/MF_PORTFIF_1_TH.xls",
    },
    {
      title:
        "เงินลงทุนในต่างประเทศของกองทุนรวม จำแนกตามประเภททรัพย์สินที่มีการลงทุน",
      link: "https://dividend.sec.or.th/stat-report/MF_PORTFIF_2_TH.xls",
    },
  ];

  return (
    <div className="flex flex-col gap-8 py-6 px-6 border rounded-2xl">
      <div className="flex flex-col gap-1">
        <h1 className="flex gap-2 items-center">
          <NotepadText className="text-sky-500 w-4" />
          <Link href="https://market.sec.or.th/public/idisc/th/CapitalMarketReport/PP28">
            <p>รายงานสถิติที่น่าสนใจ</p>
          </Link>
        </h1>

        <p className="text-xs opacity-50 pl-6">
          <span>อัพเดตล่าสุด </span>
          <span>{moment(refDate.toISOString()).format("YYYY-MM-DD")}</span>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {reportData.length <= 0 ? (
          <div className="w-full flex justify-center items-center h-[100px]">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="overflow-auto h-[315px]">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="font-bold">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">หัวข้อ</TableHead>
                  <TableHead className="font-semibold">ดาวน์โหลด</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="opacity-50 w-8">
                        {index + 1}
                      </TableCell>
                      <TableCell className="whitespace-normal break-words">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={item.link}
                          className="flex justify-center items-center"
                        >
                          <Download className="w-5 text-sky-600 hover:text-sky-400 duration-300" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};
export default Reports;
