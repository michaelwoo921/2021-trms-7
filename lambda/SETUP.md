1. make sure you are in project root directory
2. build docker file
   `docker build -f Dockerfile -t trms-lambda .`

3. deploy the cloud stack
   1. make sure that the IAM role has the `AmazonEC2ContainerRegistryFullAccess` permission.
   2. you should already have the `AWSCloudFormationFullAccess` permission already.
   3. `aws cloudformation deploy --template-file ecr.yaml --stack-name TrmsLambda`
4. add the built docker image to the ECR that was created.
   1. Register Docker with ECR
      1. `aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-west-2.amazonaws.com`
   2. Tag Image for ECR
      1. `docker tag trms-lambda:latest <account>.dkr.ecr.us-west-2.amazonaws.com/trms-lambda:latest`
   3. Upload to ECR
      1. `docker push <account>.dkr.ecr.us-west-2.amazonaws.com/trms-lambda:latest`

## Create lambda stacks using CloudFormation (with paths listed above)

- `aws cloudformation deploy --template-file ./lambda/trms-lambda.yaml --stack-name trms-lambda-stack`
