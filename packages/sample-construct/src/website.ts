import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class Website extends Construct {

  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Bucket(this, 'Site', {});
  }
}