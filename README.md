# PrismaEmployeeAPI
- Working with prisma [Prisma Quickstart](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgres)
1. install node moudles
    - npm i
2. set an environment variable POSTGRES_CONN
    - The format of the connection string is in the schema.prisma
3. npx prisma migrate
    - Will read the schema.prisma to generate db
4. npx prisma generate
    - Will generate the Types used in the application
    - I had to close VS code and reopen it for the typings to appear
