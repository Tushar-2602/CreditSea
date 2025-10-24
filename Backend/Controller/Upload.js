import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { isXMLFile } from "../Utils/CheckXML.js";
import { parseCreditReport } from "../Utils/ExtractXML.js";
import { User } from "../Models/UserModel.js";
import { CreditAccount } from "../Models/CreditAccountModel.js";
import { ReportSummary } from "../Models/ReportSummaryModel.js";
const uploadXml = AsyncHandler(async (req,res)=>{

if(!isXMLFile(req.file)){
throw new ApiError(400,"XML file not found");
}
const XMLData = await parseCreditReport(req.file);
if(XMLData.status==0){
    throw new ApiError(400,XMLData.message);
}
const basicDetails = XMLData.data.Basic_Details;
const ReportData = XMLData.data.Report_Summary;
const CreditAccountsInformation = XMLData.data.Credit_Accounts_Information.Credit_Cards;

try {
    await User.findOneAndUpdate(
        {PAN:basicDetails.PAN},
        {
           PAN:basicDetails.PAN,
           name:basicDetails.Name,
           mobilePhone:basicDetails.Mobile_Phone,
           creditScore:basicDetails.Credit_Score
        },
         { upsert: true, new: true }
        )
} catch (err) {
    console.error("Error saving User:", err);
    throw new ApiError(400,"error saving User")
}
try {
    await ReportSummary.findOneAndUpdate(
            { PAN: basicDetails.PAN },
            {
              PAN: basicDetails.PAN,
              totalAccounts: ReportData.Total_Accounts,
              activeAccounts: ReportData.Active_Accounts,
              closedAccounts: ReportData.Closed_Accounts,
              currentBalanceAmount: ReportData.Current_Balance_Amount,
              securedAccountsAmount: ReportData.Secured_Accounts_Amount,
              unsecuredAccountsAmount: ReportData.Unsecured_Accounts_Amount,
              last7DaysCreditEnquiries: ReportData.Last_7_Days_Credit_Enquiries
            },
            { upsert: true, new: true }
          );
} catch (err) {
    console.error("Error saving Report Summary:", err);
    throw new ApiError(400,"error saving Report Summary")
}

// const creditAccountsDocs = CreditAccountsInformation.map(account => ({
//     accountNumber: account.Account_Number,
//     PAN: basicDetails.PAN,
//     bankName: account.Bank,
//     address: account.Address,
//     amountOverdue: account.Amount_Overdue,
//     currentBalance: account.Current_Balance
//   }));

//   try {
//     await CreditAccount.insertMany(creditAccountsDocs, { ordered: false });
    
//   } catch (err) {
//     console.error("Error saving credit accounts:", err);
//     throw new ApiError(400,"error saving CreditAccount")
//   }
const creditAccountsDocs = CreditAccountsInformation.map(account => ({
  accountNumber: account.Account_Number,
  PAN: basicDetails.PAN,
  bankName: account.Bank,
  address: account.Address,
  amountOverdue: account.Amount_Overdue,
  currentBalance: account.Current_Balance
}));

try {
  const bulkOps = creditAccountsDocs.map(doc => ({
    updateOne: {
      filter: { accountNumber: doc.accountNumber },
      update: { $set: doc },
      upsert: true
    }
  }));

  await CreditAccount.bulkWrite(bulkOps);
  
} catch (err) {
  console.error("Error saving credit accounts:", err);
  throw new ApiError(400, "Error saving CreditAccount");
}


  return res
  .status(201)
  .json(new ApiResponse(201,{},"user info saved"))
})

export {uploadXml}