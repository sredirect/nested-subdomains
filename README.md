# Just Certs

This repo contains:
  * One or more AWS ACM certificates, codified using the [AWS Cloud Development Kit (CDK)](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html);
  * CI code to deploy it to a test and prod account, with example contents;
  * CI code to deploy development instances of it to forks of this repo on development branches;
  * CI code to integration-test it;
  * Code to configure the CDK stack by reading [SSM parameters](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) from the accounts where it's deployed.

It is meant to be used as a template for when you want some AWS resources, as code, with pre-built machinery for deployment and testing.

## How to deploy from this repo
Go to your repository Settings and add GitHub Actions repository secrets called:
  * `DEV_AWS_ACCESS_KEY_ID`
  * `DEV_AWS_SECRET_ACCESS_KEY`
  * `TEST_AWS_ACCESS_KEY_ID`
  * `TEST_AWS_SECRET_ACCESS_KEY`
  * `PROD_AWS_ACCESS_KEY_ID`
  * `PROD_AWS_SECRET_ACCESS_KEY`

The Actions pipeline from `.github/workflows/feature-branch.yml` will deploy to the account corresponding to the environment variables starting with `DEV_`. The Actions pipeline from `.github/workflows/main.yml` will deploy to the accountS corresponding to the environment variables starting with `TEST_`, then `PROD_`.
