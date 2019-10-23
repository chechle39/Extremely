USE [master]
GO
/****** Object:  Database [X-BOOK]    Script Date: 10/21/2019 9:55:58 AM ******/
CREATE DATABASE [X-BOOK]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'X-BOOK', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\DATA\X-BOOK.mdf' , SIZE = 3072KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'X-BOOK_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\DATA\X-BOOK_log.ldf' , SIZE = 4224KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [X-BOOK] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [X-BOOK].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [X-BOOK] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [X-BOOK] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [X-BOOK] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [X-BOOK] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [X-BOOK] SET ARITHABORT OFF 
GO
ALTER DATABASE [X-BOOK] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [X-BOOK] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [X-BOOK] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [X-BOOK] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [X-BOOK] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [X-BOOK] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [X-BOOK] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [X-BOOK] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [X-BOOK] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [X-BOOK] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [X-BOOK] SET  DISABLE_BROKER 
GO
ALTER DATABASE [X-BOOK] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [X-BOOK] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [X-BOOK] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [X-BOOK] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [X-BOOK] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [X-BOOK] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [X-BOOK] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [X-BOOK] SET RECOVERY FULL 
GO
ALTER DATABASE [X-BOOK] SET  MULTI_USER 
GO
ALTER DATABASE [X-BOOK] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [X-BOOK] SET DB_CHAINING OFF 
GO
ALTER DATABASE [X-BOOK] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [X-BOOK] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
EXEC sys.sp_db_vardecimal_storage_format N'X-BOOK', N'ON'
GO
USE [X-BOOK]
GO
/****** Object:  Table [dbo].[AccountChart]    Script Date: 10/21/2019 9:55:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[AccountChart](
	[accountNumber] [varchar](50) NOT NULL,
	[accountName] [nvarchar](100) NOT NULL,
	[accountType] [nvarchar](50) NOT NULL,
	[isParent] [bit] NOT NULL,
	[parentAccount] [varchar](50) NULL,
	[openingBalance] [decimal](18, 4) NULL,
	[closingBalance] [decimal](18, 4) NULL,
 CONSTRAINT [PK_AcountChart] PRIMARY KEY CLUSTERED 
(
	[accountNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Category]    Script Date: 10/21/2019 9:55:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Category](
	[CategoryID] [int] IDENTITY(1,1) NOT NULL,
	[CategoryName] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_category] PRIMARY KEY CLUSTERED 
(
	[CategoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Client]    Script Date: 10/21/2019 9:55:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Client](
	[clientID] [int] IDENTITY(1,1) NOT NULL,
	[clientName] [nvarchar](100) NOT NULL,
	[address] [nvarchar](200) NULL,
	[taxCode] [nvarchar](50) NULL,
	[Tag] [nvarchar](50) NULL,
	[contactName] [nvarchar](200) NULL,
	[email] [nvarchar](200) NULL,
	[note] [nvarchar](200) NULL,
 CONSTRAINT [PK_Clients] PRIMARY KEY CLUSTERED 
(
	[clientID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[EntryPattern]    Script Date: 10/21/2019 9:55:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntryPattern](
	[patternID] [int] IDENTITY(1,1) NOT NULL,
	[transactionType] [nvarchar](100) NOT NULL,
	[entryType] [nvarchar](100) NOT NULL,
	[deditAccNumber] [nvarchar](20) NOT NULL,
	[creditAccNumber] [nvarchar](20) NOT NULL,
	[note] [nvarchar](200) NULL,
 CONSTRAINT [PK_EntryPattern] PRIMARY KEY CLUSTERED 
(
	[patternID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[GeneralLedger]    Script Date: 10/21/2019 9:55:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[GeneralLedger](
	[ledgerID] [bigint] IDENTITY(1,1) NOT NULL,
	[transactionType] [nvarchar](100) NOT NULL,
	[transactionNo] [nvarchar](50) NOT NULL,
	[deditAccNumber] [nvarchar](20) NOT NULL,
	[creditAccNumber] [nvarchar](20) NOT NULL,
	[dateIssue] [datetime] NOT NULL,
	[clientID] [varchar](100) NULL,
	[clientName] [nvarchar](200) NULL,
	[note] [nvarchar](200) NULL,
	[reference] [nvarchar](200) NULL,
	[amount] [decimal](18, 4) NOT NULL,
 CONSTRAINT [PK_GeneralLedger] PRIMARY KEY CLUSTERED 
(
	[ledgerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[JournalDetail]    Script Date: 10/21/2019 9:55:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[JournalDetail](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[JournalID] [bigint] NOT NULL,
	[deditAccNumber] [nvarchar](20) NOT NULL,
	[creditAccNumber] [nvarchar](20) NOT NULL,
	[clientID] [varchar](100) NULL,
	[clientName] [nvarchar](200) NULL,
	[note] [nvarchar](200) NULL,
	[amount] [decimal](18, 4) NOT NULL,
 CONSTRAINT [PK_JournalDetail] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[JournalEntry]    Script Date: 10/21/2019 9:55:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[JournalEntry](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[entryName] [nvarchar](200) NOT NULL,
	[description] [nvarchar](500) NULL,
	[dateCreate] [datetime] NOT NULL,
 CONSTRAINT [PK_JournalEntry] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Payments]    Script Date: 10/21/2019 9:55:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Payments](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[invoiceID] [bigint] NOT NULL,
	[payDate] [datetime] NOT NULL,
	[payTypeID] [int] NOT NULL,
	[payType] [nvarchar](100) NOT NULL,
	[bankAccount] [nvarchar](300) NULL,
	[amount] [decimal](18, 4) NOT NULL,
	[note] [nvarchar](200) NULL,
 CONSTRAINT [PK_Payments] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Product]    Script Date: 10/21/2019 9:55:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Product](
	[productID] [int] IDENTITY(1,1) NOT NULL,
	[productName] [varchar](100) NULL,
	[description] [varchar](100) NULL,
	[unitPrice] [decimal](18, 0) NULL,
	[categoryID] [int] NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[productID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[SaleInvDetail]    Script Date: 10/21/2019 9:55:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SaleInvDetail](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[invoiceID] [bigint] NOT NULL,
	[productID] [int] NOT NULL,
	[productName] [nvarchar](100) NULL,
	[description] [nvarchar](100) NULL,
	[qty] [decimal](18, 4) NULL,
	[price] [decimal](18, 4) NULL,
	[amount] [decimal](18, 4) NULL,
	[vat] [decimal](4, 2) NULL,
 CONSTRAINT [PK_SaleInvDetail] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[SaleInvoice]    Script Date: 10/21/2019 9:55:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[SaleInvoice](
	[invoiceID] [bigint] IDENTITY(1,1) NOT NULL,
	[invoiceSerial] [varchar](50) NOT NULL,
	[invoiceNumber] [varchar](50) NOT NULL,
	[issueDate] [datetime] NULL,
	[dueDate] [datetime] NULL,
	[clientID] [int] NULL,
	[reference] [nvarchar](100) NULL,
	[subTotal] [decimal](18, 4) NULL,
	[discRate] [decimal](4, 2) NULL,
	[discount] [decimal](18, 4) NULL,
	[vatTax] [decimal](18, 4) NULL,
	[amountPaid] [decimal](18, 4) NULL,
	[note] [nvarchar](200) NULL,
	[term] [nvarchar](200) NULL,
	[status] [nvarchar](50) NULL,
 CONSTRAINT [PK_saleInvoice] PRIMARY KEY CLUSTERED 
(
	[invoiceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Tax]    Script Date: 10/21/2019 9:55:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tax](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[taxName] [nvarchar](50) NULL,
	[taxRate] [decimal](4, 2) NULL,
 CONSTRAINT [PK_Tax] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
ALTER TABLE [dbo].[AccountChart] ADD  CONSTRAINT [DF_AcountChart_openingBalance]  DEFAULT ((0)) FOR [openingBalance]
GO
ALTER TABLE [dbo].[AccountChart] ADD  CONSTRAINT [DF_AcountChart_closingBalance]  DEFAULT ((0)) FOR [closingBalance]
GO
ALTER TABLE [dbo].[JournalDetail] ADD  CONSTRAINT [DF_JournalDetail_Amount]  DEFAULT ((0)) FOR [amount]
GO
ALTER TABLE [dbo].[Payments]  WITH CHECK ADD  CONSTRAINT [FK_Payments_SaleInvoice1] FOREIGN KEY([invoiceID])
REFERENCES [dbo].[SaleInvoice] ([invoiceID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Payments] CHECK CONSTRAINT [FK_Payments_SaleInvoice1]
GO
ALTER TABLE [dbo].[SaleInvDetail]  WITH CHECK ADD  CONSTRAINT [FK_SaleInvDetail_Product] FOREIGN KEY([productID])
REFERENCES [dbo].[Product] ([productID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[SaleInvDetail] CHECK CONSTRAINT [FK_SaleInvDetail_Product]
GO
ALTER TABLE [dbo].[SaleInvDetail]  WITH CHECK ADD  CONSTRAINT [FK_SaleInvDetail_SaleInvoice] FOREIGN KEY([invoiceID])
REFERENCES [dbo].[SaleInvoice] ([invoiceID])
GO
ALTER TABLE [dbo].[SaleInvDetail] CHECK CONSTRAINT [FK_SaleInvDetail_SaleInvoice]
GO
ALTER TABLE [dbo].[SaleInvoice]  WITH CHECK ADD  CONSTRAINT [FK_SaleInvoice_Customer] FOREIGN KEY([clientID])
REFERENCES [dbo].[Client] ([clientID])
GO
ALTER TABLE [dbo].[SaleInvoice] CHECK CONSTRAINT [FK_SaleInvoice_Customer]
GO
USE [master]
GO
ALTER DATABASE [X-BOOK] SET  READ_WRITE 
GO
