import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Website } from '../src';

let app:App;

test('website snapshot', () => {
  const stack = new Stack(app, 'TestStack');
  new Website(stack, 'Test');
  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});