FROM public.ecr.aws/lambda/nodejs:14

COPY *.ts package.json tsconfig.json /var/task/


RUN npm install
RUN npx tsc

RUN ls

CMD [ "index.handler"]