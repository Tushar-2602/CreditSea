import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { User } from "../Models/UserModel.js";
import { CreditAccount } from "../Models/CreditAccountModel.js";
import { ReportSummary } from "../Models/ReportSummaryModel.js";

const sendData = AsyncHandler(async (req,res)=>{
 try {
    // Fetch all users
    console.log();
    
    const users = await User.find({}).lean();
  console.log(users);
  
    const results = await Promise.all(
      users.map(async (user) => {
        // Fetch related credit accounts
        const creditAccounts = await CreditAccount.find({ PAN: user.PAN }).lean();

        // Fetch report summary for user (if exists)
        const reportSummaryData = await ReportSummary.findOne({ PAN: user.PAN }).lean();

        // Destructure to remove PAN
        const { PAN, ...reportSummary } = reportSummaryData || {};

        return {
          ...user,
          creditAccounts,
          ...reportSummary,
        };
      })
    );

    res.status(200).json(new ApiResponse(200,results,"data retrieved"));
  } catch (err) {
    console.error(err);
    throw new ApiError(402,"error retrieving info");
  }
})

export {sendData}