import { App, Stack, StackProps, RemovalPolicy, CfnOutput } from "aws-cdk-lib";
import { aws_certificatemanager as certificatemanager } from "aws-cdk-lib";

export interface AppStackProps extends StackProps {
  domainNames?: [string];
}
export class AppStack extends Stack {
  constructor(scope: App, id: string, props: AppStackProps = {}) {
    super(scope, id, props);
    const { domainNames } = props;
    // make a cert that will not wait for validation
    // we will validate this outside of AWS
    let cert;
    if (domainNames && domainNames.length > 0) {
      let subjectAlternativeNames;
      if (domainNames.length > 1) {
        subjectAlternativeNames = domainNames.slice(1);
      }
      cert = new certificatemanager.Certificate(this, "Cert", {
        domainName: domainNames[0],
        subjectAlternativeNames,
        validation: certificatemanager.CertificateValidation.fromDns(),
      });
      new CfnOutput(this, "CertArn", { value: cert.certificateArn });
    }
  }
}
