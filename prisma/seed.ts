// npx prisma db seed
// https://sec.gdcatalog.go.th/api/3/action/datastore_search?resource_id=1e3f090f-0b24-4f47-8d8b-d3de1c49414b&limit=10000&offset=0

import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { readFile } from "fs/promises";
import path from "path";

interface FundTypeProps {
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
          policyThaiDesc: record.POLICY_THAI_DESC.substring(0, 199),
          specGrDesc: record.SPEC_GR_DESC.substring(0, 199),
          mainFeederFund: record.main_feeder_fund,
          feederCountry: record.feeder_country,
          mainFeederFundUcits: record.main_feeder_fund_ucits,
          futureFlag: record.FUTURE_FLAG,
          futureReason: record.future_reas,
          riskFlag: record.risk_flag,
          globalExposureLimitMethod: record.global_exposure_limit_method,
          noteFlag: record.NOTE_FLAG,
          policySpecDesc: record.policyspec_desc.substring(0, 199),
          currentRmfPvdType: record.current_rmf_pvd_type,
          managementStyleTh: record.management_style_th,
          fundCompare: record.fund_compare,
          mutualInvType: record.MUTUAL_INV_TYPE,
          investCountryFlagEng: record.INVEST_COUNTRY_FLAG_ENG,
          redempPeriodEng: record.redemp_period_eng,
          redempPeriodOth: record.redemp_period_oth.substring(0, 199),
          projTermTh: record.proj_term_th,
          trackingError: record.tracking_error,
          benchmarkDescTh: record.benchmark_desc_th.substring(0, 199),
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

async function seedDB() {

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
