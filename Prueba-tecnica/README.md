# Base de datos :
SQL server, ejecuta el siguiente query.
```bash
CREATE DATABASE JournalDB;
GO


USE JournalDB;
GO


CREATE TABLE Journals (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255) NOT NULL,
    Author NVARCHAR(255) NOT NULL,
    PublicationDate DATE NOT NULL,
    FilePath NVARCHAR(255) NOT NULL
);
GO


CREATE TABLE Subscriptions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    SubscriberId INT NOT NULL,
    ResearcherId INT NOT NULL
);
GO


CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(255) NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) NOT NULL
);
GO

```
### Backend
 
 1. .NET 8
 2. Swagger
 3. EntityFrameworkCore 8.0.8
 4. Abrirlo con ISS
