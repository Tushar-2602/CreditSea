import { parseStringPromise } from "xml2js";

// Assuming multer with memoryStorage
const parseCreditReport = async (file) => {
  try {
    if (!file) {
      return { status: 0, message: "No file uploaded" };
    }

    const xmlData = file.buffer.toString("utf-8");
    const result = await parseStringPromise(xmlData, { explicitArray: false, mergeAttrs: true });
    const root = result.INProfileResponse;

    const get = (path, source = root) => {
      try {
        const value = path.split(".").reduce((acc, key) => {
          if (!acc) throw new Error();
          if (key.endsWith("]")) {
            // handle array index like CAIS_Account_DETAILS[0]
            const [arrKey, index] = key.slice(0, -1).split("[");
            return acc[arrKey][parseInt(index, 10)];
          }
          return acc[key];
        }, source);

        if (value === undefined || value === null || value === "") {
          throw new Error(`❌ Field found but empty: ${path}`);
        }

        return value;
      } catch {
        throw new Error(`❌ Missing required field: ${path}`);
      }
    };
    const getPAN = () => {
  const accounts = Array.isArray(root.CAIS_Account.CAIS_Account_DETAILS)
    ? root.CAIS_Account.CAIS_Account_DETAILS
    : [root.CAIS_Account.CAIS_Account_DETAILS];

  for (const account of accounts) {
    const pan = account.CAIS_Holder_ID_Details?.Income_TAX_PAN;
    if (pan) return pan;
  }
  return ""; // fallback if none found
};

    // -------- BASIC DETAILS --------
    const applicant = get("Current_Application.Current_Application_Details.Current_Applicant_Details");
    const basicDetails = {
      Name: `${applicant.First_Name || ""} ${applicant.Last_Name || ""}`.trim(),
      Mobile_Phone: applicant.MobilePhoneNumber || "",
      PAN: getPAN(),
      Credit_Score: parseInt(get("SCORE.BureauScore") || 0)
    };

    // -------- REPORT SUMMARY --------
    const caisSummary = get("CAIS_Account.CAIS_Summary");
    const totalBalance = get("CAIS_Account.CAIS_Summary.Total_Outstanding_Balance");
    const totalCAPS = get("TotalCAPS_Summary");

    const reportSummary = {
      Total_Accounts: parseInt(caisSummary.Credit_Account.CreditAccountTotal || 0),
      Active_Accounts: parseInt(caisSummary.Credit_Account.CreditAccountActive || 0),
      Closed_Accounts: parseInt(caisSummary.Credit_Account.CreditAccountClosed || 0),
      Current_Balance_Amount: parseInt(totalBalance.Outstanding_Balance_All || 0),
      Secured_Accounts_Amount: parseInt(totalBalance.Outstanding_Balance_Secured || 0),
      Unsecured_Accounts_Amount: parseInt(totalBalance.Outstanding_Balance_UnSecured || 0),
      Last_7_Days_Credit_Enquiries: parseInt(totalCAPS.TotalCAPSLast7Days || 0)
    };

    // -------- CREDIT ACCOUNTS INFO --------
    const accounts = Array.isArray(root.CAIS_Account.CAIS_Account_DETAILS)
      ? root.CAIS_Account.CAIS_Account_DETAILS
      : root.CAIS_Account.CAIS_Account_DETAILS ? [root.CAIS_Account.CAIS_Account_DETAILS] : [];

    const creditAccountsInfo = { Credit_Cards: [] };

    accounts.forEach(account => {
      if (account.Portfolio_Type === "R") {
        const addr = account.CAIS_Holder_Address_Details || {};
        creditAccountsInfo.Credit_Cards.push({
          Bank: account.Subscriber_Name?.trim() || "",
          Address: [
            addr.First_Line_Of_Address_non_normalized || "",
            addr.Second_Line_Of_Address_non_normalized || "",
            addr.Third_Line_Of_Address_non_normalized || "",
            addr.City_non_normalized || "",
            addr.State_non_normalized || "",
            addr.ZIP_Postal_Code_non_normalized || ""
          ].filter(Boolean).join(", "),
          Account_Number: account.Account_Number || "",
          Amount_Overdue: parseInt(account.Amount_Past_Due || 0),
          Current_Balance: parseInt(account.Current_Balance || 0),
          Account_Status: account.Account_Status || "",
          Payment_Rating: account.Payment_Rating || "",
          Date_Reported: account.Date_Reported || ""
        });
      }
    });

    // -------- FINAL RESULT --------
    return {
      status: 1,
      data: {
        Basic_Details: basicDetails,
        Report_Summary: reportSummary,
        Credit_Accounts_Information: creditAccountsInfo
      }
    };
  } catch (err) {
    console.error("Error parsing XML:", err);
    return { status: 0, message: err.message };
  }
};

export { parseCreditReport };
