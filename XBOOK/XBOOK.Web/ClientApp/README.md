# Build and Test
* Run EF migrations: 
    - Run update database:
    ```
    dotnet ef database update --project "CITS.Repo" --startup-project "CITS.Web"
    ```
    - Add migration
    ```
    dotnet ef migrations add [migration-name] --project "CITS.Repo" --startup-project "CITS.Web"
    ```
* Run Front-End Angular app
    - npm install: open folder ClientApp and run:
    ```
    npm install
    ```
    - Run Angular application:
    ```
    npm start
    ```