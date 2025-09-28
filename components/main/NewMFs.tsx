"use client";

import { Loader2, Sparkle } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import moment from "moment";

const NewMFs = () => {
  const [newMFData, setNewMFData] = useState([]);

  const refDate = new Date()

  useEffect(() => {
    const fetchNewMFData = async () => {
      const res = await fetch("/api/newmfs");
      const result = await res.json();

      setNewMFData(result);
    };

    fetchNewMFData();
  }, []);

  return (
    <div className="flex flex-col gap-8 py-6 px-6 border rounded-2xl">
      <div className="flex flex-col gap-1">
        <h1 className="flex gap-2 items-center">
          <Sparkle className="text-emerald-500 w-4" />
          <p>กองทุนมาใหม่</p>
        </h1>

        <p className="text-xs opacity-50 pl-6">
          <span>อัพเดตล่าสุด </span>
          <span>{moment(refDate.toISOString()).format("YYYY-MM-DD")}</span>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {newMFData.length <= 0 ? (
          <div className="w-full flex justify-center items-center h-[100px]">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="overflow-auto h-[310px]">
            <Table className="text-sm">
              <TableCaption>{`จำนวนทั้งหมด ${Math.max(
                newMFData.length - 1,
                0
              )} กองทุน`}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">ชื่อย่อกองทุน</TableHead>
                  <TableHead className="font-semibold">วันที่เสนอขาย</TableHead>
                  <TableHead className="font-semibold">
                    วันที่สิ้นสุดการขาย
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newMFData.map((item, index) => {
                  if (index > 0) {
                    return (
                      <TableRow key={index}>
                        <TableCell className="opacity-50">{index}</TableCell>
                        <TableCell>
                          <Link
                            className="text-sky-600 hover:cursor-pointer hover:text-sky-400"
                            href={item["Filing"]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <div className="text-sm">
                                  {item["ชื่อย่อกองทุน"]}
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="flex justify-center gap-4">
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">
                                      {item["ชื่อกองทุน"]}
                                    </h4>
                                    <p className="text-sm">
                                      {item["บริษัทจัดการ"]}
                                    </p>
                                    <div className="text-muted-foreground text-xs">
                                      {item["ประเภทกองทุน"]}
                                    </div>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </Link>
                        </TableCell>
                        <TableCell>{item["วันที่เริ่มการเสนอขาย"]}</TableCell>
                        <TableCell>{item["วันที่สิ้นสุดการขาย"]}</TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};
export default NewMFs;
