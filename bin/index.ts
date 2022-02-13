#!/usr/bin/env node
import { App } from "aws-cdk-lib";
const AWS = require("aws-sdk");
const crypto = require("crypto");
import { AppStack, AppStackProps } from "../lib";
const stackname = require("@cdk-turnkey/stackname");

(async () => {
  const app = new App();
  class ConfigParam {
    appParamName: string;
    ssmParamName = () => stackname(this.appParamName);
    ssmParamValue?: string;
    print = () => {
      console.log("appParamName");
      console.log(this.appParamName);
      console.log("ssmParamName:");
      console.log(this.ssmParamName());
      console.log("ssmParamValue:");
      console.log(this.ssmParamValue);
    };
    constructor(appParamName: string) {
      this.appParamName = appParamName;
    }
  }
  const configParams: Array<ConfigParam> = [new ConfigParam("domainNames")];
  const ssmParams = {
    Names: configParams.map((c) => c.ssmParamName()),
    WithDecryption: true,
  };
  AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
  const ssm = new AWS.SSM();
  let ssmResponse: any;
  ssmResponse = await new Promise((resolve, reject) => {
    ssm.getParameters(ssmParams, (err: any, data: any) => {
      resolve({ err, data });
    });
  });
  if (!ssmResponse.data) {
    console.log("error: unsuccessful SSM getParameters call, failing");
    console.log(ssmResponse);
    process.exit(1);
  }
  const ssmParameterData: any = {};
  let valueHash;
  enum AWS_SSM_SDK_PARAMETER_TYPES {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#getParameters-property
    STRING = "String",
    SECURE_STRING = "SecureString",
    STRING_LIST = "StringList",
  }
  ssmResponse?.data?.Parameters?.forEach(
    (p: { Name: string; Type: string; Value: string }) => {
      console.log("Received parameter named:");
      console.log(p.Name);
      valueHash = crypto
        .createHash("sha256")
        .update(p.Value)
        .digest("hex")
        .toLowerCase();
      console.log("value hash:");
      console.log(valueHash);
      console.log("**************");
      if (
        p.Type == AWS_SSM_SDK_PARAMETER_TYPES.STRING ||
        p.Type == AWS_SSM_SDK_PARAMETER_TYPES.SECURE_STRING
      ) {
        ssmParameterData[p.Name] = p.Value;
      }
      if (p.Type == AWS_SSM_SDK_PARAMETER_TYPES.STRING_LIST)
        ssmParameterData[p.Name] = p.Value.split(",");
    }
  );
  console.log("==================");
  configParams.forEach((c) => {
    c.ssmParamValue = ssmParameterData[c.ssmParamName()];
  });
  const appProps: any = {};
  configParams.forEach((c) => {
    appProps[c.appParamName] = c.ssmParamValue;
  });
  // Param validation
  let domainNames;
  if (appProps.domainNames) {
    // Validate the customProp, if provided
  }
  console.log("and domainNames:");
  console.log(appProps.domainNames);
  new AppStack(app, stackname("app"), {
    ...(appProps as AppStackProps),
  });
})();
