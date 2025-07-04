// npx prisma db seed
// https://sec.gdcatalog.go.th/api/3/action/datastore_search?resource_id=1e3f090f-0b24-4f47-8d8b-d3de1c49414b&limit=10000&offset=0

import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { readFile } from "fs/promises";
import path from "path";

interface FundTypeProps {
  id: number;
  asOfDate: string;
  regisIdYear1: string;
  type: string;
  projThaiName: string;
  projAbbrName: string;
  compThaiName: string;
  isinCode: string;
  projType: string;
  numSell: string;
  projOfferPlace: string;
  projRetailType: string;
  unitMulticlass: string;
  classList: string;
  policyThaiDesc: string;
  specGrDesc: string;
  mainFeederFund: string;
  feederCountry: string;
  mainFeederFundUcits: string;
  futureFlag: string;
  futureReason: string;
  riskFlag: string;
  globalExposureLimitMethod: string;
  noteFlag: string;
  policySpecDesc: string;
  currentRmfPvdType: string;
  managementStyleTh: string;
  fundCompare: string;
  mutualInvType: string;
  investCountryFlagEng: string;
  redempPeriodEng: string;
  redempPeriodOth: string;
  projTermTh: string;
  trackingError: string;
  benchmarkDescTh: string;
  benchmarkRatio: string;
  yieldPaying: string;
  dividendPolicy: string;
  riskSpectrum: string;
  supervisorNameEng: string;
  apprDate: string;
  regisDate: string;
  sellVal: string;
  pcancDate: string;
  cancCancNav: string;
  cancDate: string;
}

type FundDetailCreateManyInput = Prisma.FundDetailCreateManyInput;

async function isFundsData(): Promise<FundDetailCreateManyInput[]> {
  const json = JSON.parse(
    await readFile(path.join(__dirname, "../data/fundData.json"), "utf8")
  );

  const records = json?.result?.records;

  if (Array.isArray(records) && records.length > 0) {
    console.log("🌟 Data found !!");
    console.log("💬 Please wait...");
    console.log("🧹️ Cleansing data...");

    // insert to new obj
    const totalRecords = records.length;
    console.log(totalRecords);

    const recordsFund: FundTypeProps[] = [];

    records.forEach((record) => {
      if (record["canc_date"] === "-" && record.TYPE !== ("จดทะเบียนเลิก")) {
        recordsFund.push({
          id: +record?._id,
          asOfDate: record["As of date"],
          regisIdYear1: record.regis_id_year1,
          type: record.TYPE,
          projThaiName: record.PROJ_THAI_NAME,
          projAbbrName: record.PROJ_ABBR_NAME,
          compThaiName: record.COMP_THAI_NAME,
          isinCode: record.isin_code,
          projType: record.PROJ_TYPE,
          numSell: record.NUM_SELL,
          projOfferPlace: record.PROJ_OFFER_PLACE,
          projRetailType: record.PROJ_RETAIL_TYPE,
          unitMulticlass: record.unit_multiclass,
          classList: record.class_list,
          policyThaiDesc: record.POLICY_THAI_DESC,
          specGrDesc: record.SPEC_GR_DESC.substring(0, 499),
          mainFeederFund: record.main_feeder_fund,
          feederCountry: record.feeder_country,
          mainFeederFundUcits: record.main_feeder_fund_ucits,
          futureFlag: record.FUTURE_FLAG,
          futureReason: record.future_reas,
          riskFlag: record.risk_flag,
          globalExposureLimitMethod: record.global_exposure_limit_method,
          noteFlag: record.NOTE_FLAG,
          policySpecDesc: record.policyspec_desc.substring(0, 999),
          currentRmfPvdType: record.current_rmf_pvd_type,
          managementStyleTh: record.management_style_th,
          fundCompare: record.fund_compare,
          mutualInvType: record.MUTUAL_INV_TYPE,
          investCountryFlagEng: record.INVEST_COUNTRY_FLAG_ENG,
          redempPeriodEng: record.redemp_period_eng,
          redempPeriodOth: record.redemp_period_oth.substring(0, 199),
          projTermTh: record.proj_term_th,
          trackingError: record.tracking_error,
          benchmarkDescTh: record.benchmark_desc_th,
          benchmarkRatio: record.benchmark_ratio,
          yieldPaying: record.yield_paying,
          dividendPolicy: record.dividend_policy,
          riskSpectrum: record.risk_spectrum,
          supervisorNameEng: record.SUPERVISOR_NAME_ENG,
          apprDate: record.APPR_DATE,
          regisDate: record.REGIS_DATE,
          sellVal: record.SELL_VAL,
          pcancDate: record.pcanc_date,
          cancCancNav: record.canc_canc_nav,
          cancDate: record.canc_date,
        });
        console.log(record._id, "/", totalRecords, record.PROJ_ABBR_NAME);
      }
    });

    console.log("total records we used:", recordsFund.length);

    return recordsFund;
  } else {
    console.error("❌ No records found or data is invalid");
    return [];
  }
}

isFundsData().catch(console.error);

const riskAssessmentResultData = [
  {
    minScore: 0,
    maxScore: 14,
  },
  {
    minScore: 15,
    maxScore: 21,
  },
  {
    minScore: 22,
    maxScore: 29,
  },
  {
    minScore: 30,
    maxScore: 36,
  },
  {
    minScore: 37,
    maxScore: 100,
  },
];

const riskAssessmentQuestionData = [
  {
    question: "ปัจจุบันคุณอายุ",
    option1: "มากกว่า 55 ปี",
    option2: "45-55 ปี",
    option3: "35-44 ปี",
    option4: "น้อยกว่า 35 ปี",
  },
  {
    question:
      "ปัจจุบันคุณมีภาระทางการเงินและค่าใช้จ่ายประจำ เช่น ค่าผ่อนบ้าน รถ ค่าใช้จ่ายส่วนตัว และค่าเลี้ยงดูครอบครัว",
    option1: "มากกว่าร้อยละ 75 ของรายได้ทั้งหมด",
    option2: "ระหว่างร้อยละ 50 ถึง 75 ของรายได้ทั้งหมด",
    option3: "ระหว่างร้อยละ 25 ถึง 50 ของรายได้ทั้งหมด",
    option4: "น้อยกว่าร้อยละ 25 ของรายได้ทั้งหมด",
  },
  {
    question: "คุณมีสถานภาพทางการเงินในปัจจุบันอย่างไร",
    option1: "มีทรัพย์สินน้อยกว่าหนี้สิน",
    option2: "มีทรัพย์สินเท่ากับหนี้สิน",
    option3: "มีทรัพย์สินมากกว่าหนี้สิน",
    option4:
      "มีความมั่นใจว่ามีเงินออมหรือเงินลงทุนเพียงพอสำหรับการใช้ชีวิตหลังเกษียณอายุแล้ว",
  },
  {
    question:
      "คุณเคยมีประสบการณ์ หรือมีความรู้ในการลงทุนในทรัพย์สินที่เสี่ยงที่สุดกลุ่มใด",
    option1: "เงินฝากธนาคาร",
    option2: "พันธบัตรรัฐบาลหรือกองทุนรวมพันธบัตรรัฐบาล",
    option3: "หุ้นกู้หรือกองทุนรวมตราสารหนี้",
    option4: "หุ้นสามัญหรือกองทุนรวมหุ้น หรือทรัพย์สินอื่นที่มีความเสี่ยงสูง",
  },
  {
    question: "ระยะเวลาที่คุณคาดว่าจะไม่มีความจำเป็นที่ต้องใช้เงินลงทุนนี้",
    option1: "ไม่เกิน 1 ปี",
    option2: "1 ถึง 3 ปี",
    option3: "3 ถึง 5 ปี",
    option4: "มากกว่า 5 ปี",
  },
  {
    question: "วัตถุประสงค์หลักในการลงทุนของคุณ คือ",
    option1: "เน้นเงินต้นต้องปลอดภัยและได้รับผลตอบแทนสม่ำเสมอแต่ต่ำได้",
    option2:
      "เน้นโอกาสได้รับผลตอบแทนที่สม่ำเสมอ แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้บ้าง",
    option3:
      "เน้นโอกาสได้รับผลตอบแทนที่สูงขึ้น แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้มากขึ้น",
    option4:
      "เน้นผลตอบแทนสูงสุดในระยะยาว แต่อาจเสี่ยงที่จะสูญเงินต้นส่วนใหญ่ได้",
  },
  {
    question: "คุณเต็มใจที่จะลงทุนในกลุ่มการลงทุนใด",
    option1: "กลุ่มการลงทุนที่ 1 มีโอกาสได้รับผลตอบแทน 2.5% โดยไม่ขาดทุนเลย",
    option2:
      "กลุ่มการลงทุนที่ 2 มีโอกาสได้รับผลตอบแทนสูงสุด 7% แต่อาจมีผลขาดทุนได้ถึง 1%",
    option3:
      "กลุ่มการลงทุนที่ 3 มีโอกาสได้รับผลตอบแทนสูงสุด 15% แต่อาจมีผลขาดทุนได้ถึง 5%",
    option4:
      "กลุ่มการลงทุนที่ 4 มีโอกาสได้รับผลตอบแทนสูงสุด 25% แต่อาจมีผลขาดทุนได้ถึง 15%",
  },
  {
    question:
      "ถ้าคุณเลือกลงทุนในทรัพย์สินที่มีโอกาสได้รับผลตอบแทนมาก แต่มีโอกาสขาดทุนสูงด้วยเช่นกัน คุณจะรู้สึกอย่างไร",
    option1: "กังวลและตื่นตระหนกกลัวขาดทุน",
    option2: "ไม่สบายใจแต่พอเข้าใจได้บ้าง",
    option3: "เข้าใจและรับความผันผวนได้ในระดับหนึ่ง",
    option4:
      "ไม่กังวลกับโอกาสขาดทุนสูง และหวังกับผลตอบแทนที่อาจจะได้รับสูงขึ้น",
  },
  {
    question:
      "คุณจะรู้สึกกังวล/รับไม่ได้ เมื่อมูลค่าเงินลงทุนของคุณมีการปรับตัวลดลงในสัดส่วนเท่าใด",
    option1: "5% หรือน้อยกว่า",
    option2: "มากกว่า 5%-10%",
    option3: "มากกว่า 10%-20%",
    option4: "มากกว่า 20% ขึ้นไป",
  },
  {
    question:
      "หากปีที่แล้วคุณลงทุนไป 100,000 บาท ปีนี้คุณพบว่ามูลค่าเงินลงทุนลดลงเหลือ 85,000 บาท คุณจะทำอย่างไร",
    option1: "ตกใจ และต้องการขายการลงทุนที่เหลือทิ้ง",
    option2:
      "กังวลใจ และจะปรับเปลี่ยนการลงทุนบางส่วนไปในทรัพย์สินที่เสี่ยงน้อยลง",
    option3: "อดทนถือต่อไปได้ และรอผลตอบแทนปรับตัวกลับมา",
    option4:
      "ยังมั่นใจ เพราะเข้าใจว่าต้องลงทุนระยะยาว และจะเพิ่มเงินลงทุนในแบบเดิมเพื่อเฉลี่ยต้นทุน",
  },
];

const riskLevelMappingData = [
  {
    userRiskLevelId: 1,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนเฉพาะในประเทศ",
  },
  {
    userRiskLevelId: 2,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนเฉพาะในประเทศ",
  },
  {
    userRiskLevelId: 2,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนในต่างประเทศบางส่วน",
  },
  {
    userRiskLevelId: 2,
    fundRiskLevelName: "กองทุนรวมพันธบัตรรัฐบาล",
  },
  {
    userRiskLevelId: 2,
    fundRiskLevelName: "กองทุนรวมตราสารหนี้",
  },
  {
    userRiskLevelId: 3,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนเฉพาะในประเทศ",
  },
  {
    userRiskLevelId: 3,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนในต่างประเทศบางส่วน",
  },
  {
    userRiskLevelId: 3,
    fundRiskLevelName: "กองทุนรวมพันธบัตรรัฐบาล",
  },
  {
    userRiskLevelId: 3,
    fundRiskLevelName: "กองทุนรวมตราสารหนี้",
  },
  {
    userRiskLevelId: 3,
    fundRiskLevelName: "กองทุนรวมผสม",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนเฉพาะในประเทศ",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนในต่างประเทศบางส่วน",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมพันธบัตรรัฐบาล",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมตราสารหนี้",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมผสม",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมตราสารแห่งทุน(กองทุนรวมหุ้น)",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมหมวดอุตสาหกรรม",
  },

  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนเฉพาะในประเทศ",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนในต่างประเทศบางส่วน",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมพันธบัตรรัฐบาล",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมตราสารหนี้",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมผสม",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมตราสารแห่งทุน(กองทุนรวมหุ้น)",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมหมวดอุตสาหกรรม",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมที่ลงทุนในสินทรัพย์ทางเลือก",
  },
];

const recommendPortData = [
  {
    userRiskLevelId: 1,
    investmentType: "กองทุนรวมพันธบัตรรัฐบาลระยะสั้น",
    weight: 0.3,
  },
  {
    userRiskLevelId: 1,
    investmentType: "กองทุนรวมตลาดเงินที่ลงทุนในประเทศ",
    weight: 0.4,
  },
  {
    userRiskLevelId: 1,
    investmentType: "กองทุนรวมตราสารหนี้ระยะยาว",
    weight: 0.2,
  },
  {
    userRiskLevelId: 1,
    investmentType: "กองทุนรวมตราสารทุน",
    weight: 0.1,
  },

  {
    userRiskLevelId: 2,
    investmentType: "กองทุนรวมพันธบัตรรัฐบาลระยะสั้น",
    weight: 0.3,
  },
  {
    userRiskLevelId: 2,
    investmentType: "กองทุนรวมตลาดเงินที่ลงทุนในประเทศ",
    weight: 0.2,
  },
  {
    userRiskLevelId: 2,
    investmentType: "กองทุนรวมตราสารหนี้ระยะยาว",
    weight: 0.3,
  },
  {
    userRiskLevelId: 2,
    investmentType: "กองทุนรวมตราสารทุน",
    weight: 0.2,
  },

  {
    userRiskLevelId: 3,
    investmentType: "กองทุนรวมพันธบัตรรัฐบาลระยะสั้น",
    weight: 0.2,
  },
  {
    userRiskLevelId: 3,
    investmentType: "กองทุนรวมตลาดเงินที่ลงทุนในประเทศ",
    weight: 0.1,
  },
  {
    userRiskLevelId: 3,
    investmentType: "กองทุนรวมตราสารหนี้ระยะยาว",
    weight: 0.3,
  },
  {
    userRiskLevelId: 3,
    investmentType: "กองทุนรวมตราสารทุน",
    weight: 0.3,
  },
  {
    userRiskLevelId: 3,
    investmentType: "กองทุนรวมทองคำ",
    weight: 0.1,
  },

  {
    userRiskLevelId: 4,
    investmentType: "กองทุนรวมพันธบัตรรัฐบาลระยะสั้น",
    weight: 0.1,
  },
  {
    userRiskLevelId: 4,
    investmentType: "กองทุนรวมตราสารหนี้ระยะยาว",
    weight: 0.3,
  },
  {
    userRiskLevelId: 4,
    investmentType: "กองทุนรวมตราสารทุน",
    weight: 0.4,
  },
  {
    userRiskLevelId: 4,
    investmentType: "กองทุนรวมทองคำ",
    weight: 0.2,
  },

  {
    userRiskLevelId: 5,
    investmentType: "กองทุนรวมตราสารหนี้ระยะยาว",
    weight: 0.1,
  },
  {
    userRiskLevelId: 5,
    investmentType: "กองทุนรวมตราสารทุน",
    weight: 0.7,
  },
  {
    userRiskLevelId: 5,
    investmentType: "กองทุนรวมทองคำ",
    weight: 0.2,
  },
];

const recommendCriteriaData = [
  {
    userRiskLevelId: 1,
    fundAssetType:
      "เงินฝากและตราสารหนี้ระยะสั้น และตราสารหนี้ภาครัฐอายุมากกว่า 1 ปี",
    percentInvest: "65% ขึ้นไป",
  },
  {
    userRiskLevelId: 1,
    fundAssetType: "หุ้นกู้",
    percentInvest: "ไม่เกิน 20%",
  },
  {
    userRiskLevelId: 1,
    fundAssetType: "หุ้น",
    percentInvest: "ไม่เกิน 10%",
  },
  {
    userRiskLevelId: 1,
    fundAssetType: "การลงทุนทางเลือก",
    percentInvest: "ไม่เกิน 5%",
  },

  {
    userRiskLevelId: 2,
    fundAssetType: "เงินฝากและตราสารหนี้ระยะสั้น",
    percentInvest: "ไม่เกิน 20%",
  },
  {
    userRiskLevelId: 2,
    fundAssetType: "ตราสารหนี้ภาครัฐอายุมากกว่า 1 ปี และหุ้นกู้",
    percentInvest: "ไม่เกิน 70%",
  },
  {
    userRiskLevelId: 2,
    fundAssetType: "หุ้น",
    percentInvest: "ไม่เกิน 20%",
  },
  {
    userRiskLevelId: 2,
    fundAssetType: "การลงทุนทางเลือก",
    percentInvest: "ไม่เกิน 10%",
  },

  {
    userRiskLevelId: 3,
    fundAssetType: "เงินฝากและตราสารหนี้ระยะสั้น",
    percentInvest: "ไม่เกิน 10%",
  },
  {
    userRiskLevelId: 3,
    fundAssetType: "ตราสารหนี้ภาครัฐอายุมากกว่า 1 ปี และหุ้นกู้",
    percentInvest: "ไม่เกิน 60%",
  },
  {
    userRiskLevelId: 3,
    fundAssetType: "หุ้น",
    percentInvest: "ไม่เกิน 30%",
  },
  {
    userRiskLevelId: 3,
    fundAssetType: "การลงทุนทางเลือก",
    percentInvest: "ไม่เกิน 10%",
  },

  {
    userRiskLevelId: 4,
    fundAssetType: "เงินฝากและตราสารหนี้ระยะสั้น",
    percentInvest: "ไม่เกิน 10%",
  },
  {
    userRiskLevelId: 4,
    fundAssetType: "ตราสารหนี้ภาครัฐอายุมากกว่า 1 ปี และหุ้นกู้",
    percentInvest: "ไม่เกิน 40%",
  },
  {
    userRiskLevelId: 4,
    fundAssetType: "หุ้น",
    percentInvest: "ไม่เกิน 40%",
  },
  {
    userRiskLevelId: 4,
    fundAssetType: "การลงทุนทางเลือก",
    percentInvest: "ไม่เกิน 20%",
  },

  {
    userRiskLevelId: 5,
    fundAssetType: "เงินฝากและตราสารหนี้ระยะสั้น",
    percentInvest: "ไม่เกิน 5%",
  },
  {
    userRiskLevelId: 5,
    fundAssetType: "ตราสารหนี้ภาครัฐอายุมากกว่า 1 ปี และหุ้นกู้",
    percentInvest: "ไม่เกิน 30%",
  },
  {
    userRiskLevelId: 5,
    fundAssetType: "หุ้น",
    percentInvest: "60% ขึ้นไป",
  },
  {
    userRiskLevelId: 5,
    fundAssetType: "การลงทุนทางเลือก",
    percentInvest: "ไม่เกิน 30%",
  },
];

// const fundRiskLevelData = [
//   {
//     fundRiskLevelName: "กองทุนรวมตลาดเงินในประเทศ",
//     fundInvestment: "เงินฝากและตราสารหนี้ที่มีอายุเฉลี่ยไม่เกิน 3 เดือน",
//   },
//   {
//     fundRiskLevelName: "กองทุนรวมตลาดเงินในประเทศผสมต่างประเทศ",
//     fundInvestment:
//       "กองทุนที่ลงทุนในสินทรัพย์เหมือนระดับ 1 แต่ลงทุนในต่างประเทศไม่เกินร้อยละ 50 ของสินทรัพย์สุทธิ",
//   },
//   {
//     fundRiskLevelName: "กองทุนรวมพันธบัตรรัฐบาล",
//     fundInvestment: "กองทุนที่ลงทุนในพันธบัตรรัฐบาล",
//   },
//   {
//     fundRiskLevelName: "กองทุนรวมตราสารหนี้",
//     fundInvestment: "กองทุนที่ลงทุนในตราสารหนี้ทั่วไป",
//   },
//   {
//     fundRiskLevelName: "กองทุนรวมผสม",
//     fundInvestment: "กองทุนที่ลงทุนในทั้งหุ้นและตราสารหนี้",
//   },
//   {
//     fundRiskLevelName: "กองทุนรวมตราสารทุน",
//     fundInvestment: "กองทุนที่ลงทุนในหุ้น",
//   },
//   {
//     fundRiskLevelName: "กองทุนรวมหมวดอุตสาหกรรม",
//     fundInvestment:
//       "กองทุนที่ลงทุนในหุ้นที่กระจุกตัวอยู่ในกลุ่มอุตสาหกรรมเดียวกันโดยเฉพาะ",
//   },
//   {
//     fundRiskLevelName: "กองทุนรวมสินทรัพย์ทางเลือก",
//     fundInvestment: "กองทุนที่ลงทุนในสินทรัพย์ทางเลือก เช่น น้ำมัน ทองคำ",
//   },
// ];

async function seedDB() {
  await prisma.riskAssessmentResult.createMany({
    data: riskAssessmentResultData,
  });
  await prisma.riskAssessmentQuestion.createMany({
    data: riskAssessmentQuestionData,
  });
  await prisma.riskLevelMapping.createMany({
    data: riskLevelMappingData,
  });
  await prisma.recommendPort.createMany({
    data: recommendPortData,
  });
  await prisma.recommendCriteria.createMany({
    data: recommendCriteriaData,
  });

  async function run() {
    const fundsData = await isFundsData();

    if (fundsData.length > 0) {
      await prisma.fundDetail.createMany({
        data: fundsData,
      });
      console.log("Seed success!");
    } else {
      console.log("No data to seed.");
    }
  }

  run();
}

seedDB();
