USE [X-BOOK]
GO
/****** Object:  StoredProcedure [dbo].[AccountBalance]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Tuan
-- Create date: 31/12/2019
-- Description:	Account balance for one accountNumber
-- exec AccountBalance '1111','11/1/19','11/30/19'
-- =============================================
CREATE PROCEDURE [dbo].[AccountBalance]	
	@accountNumber as nvarchar(50) ='',
	@fromDate as datetime ='1/1/2000',
	@toDate as dateTime ='1/1/2000',
	@Currency as nvarchar(50) ='VND'
AS
BEGIN
	--SET TRANSACTION isolation level READ uncommitted 
-- set default date
	if @fromDate='1/1/2000' or @fromDate is NULL or @fromDate=''
	begin
		set @fromDate = DATEFROMPARTS (Year(getdate()),Month(getdate()),1)
		set @toDate = EOMONTH(getdate())
	END

	Declare  @T Table(
	[accNumber] [nvarchar](20) NOT NULL,
	[accName] [nvarchar](100) NOT NULL,
	[debitOpening] [decimal](18, 4) default 0 NULL,
	[creditOpening] [decimal](18, 4) default 0  NULL,
	[debit] [decimal](18, 4) default 0  NULL,
	[credit] [decimal](18, 4) default 0  NULL,
	[debitClosing] [decimal](18, 4) default 0  NULL,
	[creditClosing] [decimal](18, 4) default 0  NULL
	) 
	If @accountNumber='' Begin
		Select * from @T
		Return
	End
	-- Get Value
	Insert into @T Select @accountNumber,accountName,0.0,0.0,0.0,0.0,0.0,0.0 from AccountChart where accountNumber=@accountNumber
	
	Update @T set debitOpening=(select isnull(Sum(g.debit),0) From GeneralLedger g 
								Where g.accNumber in (select accNumber from dbo.GetChildrenAccount(@accountNumber))								
								and g.dateIssue<@fromDate 
								)
				, creditOpening=(select isnull(Sum(g.credit),0) From GeneralLedger g 
								Where g.accNumber in (select accNumber from dbo.GetChildrenAccount(@accountNumber))								
								and g.dateIssue<@fromDate 
								)
	Update @T set debit=(select isnull(Sum(g.debit),0) From GeneralLedger g 
								Where g.accNumber in (select accNumber from dbo.GetChildrenAccount(@accountNumber))								
								and g.dateIssue between @fromDate and @toDate
								)
				, credit=(select isnull(Sum(g.credit),0) From GeneralLedger g 
								Where g.accNumber in (select accNumber from dbo.GetChildrenAccount(@accountNumber))								
								and g.dateIssue between @fromDate and @toDate
								)
	-- Set opening Value to debit or credit 
	
	if  (select debitOpening-creditOpening from @T) > 0 Begin
		Update @T set debitOpening = debitOpening-creditOpening, creditOpening=0,debitClosing=debitOpening+debit,creditClosing=credit
	end
	else begin		
		Update @T set creditOpening = creditOpening-debitOpening, debitOpening=0,debitClosing=debit,creditClosing=creditOpening+credit
	end

	-- Set closing Value to debit or credit 	
	if  (select debitClosing-creditClosing from @T) > 0 Begin
		Update @T set debitClosing = debitClosing-creditClosing, creditClosing=0
	end
	else begin
		Update @T set debitClosing = 0,  creditClosing=creditClosing-debitClosing
	end

	-- Return value
	Select * from @T
END

GO
/****** Object:  StoredProcedure [dbo].[Book_AccountBalance]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Tuan
-- Create date: 24/12/2019
-- Description:	Báo cáo cân đối phát sinh tài khoản
-- =============================================
CREATE PROCEDURE [dbo].[Book_AccountBalance]	
	@fromDate as datetime ='1/1/2000',
	@toDate as dateTime ='1/1/2000',
	@Currency as nchar(50) ='VND'
AS
BEGIN
	SET TRANSACTION isolation level READ uncommitted 
-- set default date
	if @fromDate='1/1/2000' or @fromDate is NULL or @fromDate=''
	begin
		set @fromDate = DATEFROMPARTS (Year(getdate()),Month(getdate()),1)
		set @toDate = EOMONTH(getdate())
	END

	Declare  @T Table(
	[accNumber] [nvarchar](20) NOT NULL,
	[accName] [nvarchar](100) NOT NULL,
	[debitOpening] [decimal](18, 4) NOT NULL,
	[creditOpening] [decimal](18, 4) NOT NULL,
	[debit] [decimal](18, 4) NOT NULL,
	[credit] [decimal](18, 4) NOT NULL,
	[debitClosing] [decimal](18, 4) NOT NULL,
	[creditClosing] [decimal](18, 4) NOT NULL
	) 
-- Value 
		Declare @accountNumber as nvarchar(100)
		DECLARE mycursor CURSOR FOR SELECT accountNumber from AccountChart
		OPEN mycursor FETCH NEXT FROM mycursor INTO @accountNumber

		WHILE @@FETCH_STATUS = 0
		BEGIN
			Insert into @T exec AccountBalance @accountNumber, @fromDate,@toDate

		FETCH NEXT FROM mycursor INTO @accountNumber
		END
		CLOSE mycursor
		DEALLOCATE mycursor
	
	Select * from @T
	
END

GO
/****** Object:  StoredProcedure [dbo].[Book_AccountDetail]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Tuan
-- Create date: 24/12/2019
-- Description:	Báo cáo cân đối phát sinh tài khoản
-- =============================================
CREATE PROCEDURE [dbo].[Book_AccountDetail]	
	@accountName as nvarchar(50) ='',
	@fromDate as datetime ='1/1/2000',
	@toDate as dateTime ='1/1/2000',
	@Client as nvarchar(50) ='VND'
AS
BEGIN
	SET TRANSACTION isolation level READ uncommitted 
-- set default date
	if @fromDate='1/1/2000' or @fromDate is NULL or @fromDate=''
	begin
		set @fromDate = DATEFROMPARTS (Year(getdate()),Month(getdate()),1)
		set @toDate = EOMONTH(getdate())
	END

	Declare  @T Table(
	[accountNumber] [nvarchar](50) NOT NULL,
	[accountName] [nvarchar](50) NOT NULL,
	[companyName] [nvarchar](50) NOT NULL,
	[invoiceNumber] [nvarchar](50) NOT NULL,
	[date] dateTime,
	[transactionNo] [nvarchar](50) NOT NULL,
	[reference] [nvarchar](50) NOT NULL,
	[crspAccNumber] [nvarchar](50) NOT NULL,
	[Debit] [decimal](18, 4) default 0 NULL,
	[Credit] [decimal](18, 4) default 0 NULL,
	[DebitClosing] [decimal](18, 4) default 0 NULL,
	[CreditClosing] [decimal](18, 4) default 0 NULL
	) 
	INSERT INTO @T	VALUES (N'1311',N'Tài khoản phải thu',N'Công ty TNHH Hoàng Khang','IV00001',1/1/2020,'xxxxxx',N'Diễn giải','3111',1000000,1000000,1000000,1000000);
		INSERT INTO @T	VALUES (N'1311',N'Tài khoản phải thu',N'Công ty TNHH Hoàng Khang','IV00001',1/1/2020,'xxxxxx',N'Diễn giải','3111',1000000,1000000,1000000,1000000);
	INSERT INTO @T	VALUES (N'1311',N'Tài khoản phải thu',N'Công ty TNHH ABC','IV00001',1/1/2020,'xxxxxx',N'Diễn giải','3111',1000000,1000000,1000000,1000000);
	INSERT INTO @T	VALUES (N'1311',N'Tài khoản phải thu',N'Công ty TNHH DEF','IV00001',1/1/2020,'xxxxxx',N'Diễn giải','3111',1000000,1000000,1000000,1000000);

	
	select * from @T
End
GO
/****** Object:  StoredProcedure [dbo].[Book_DebitAge]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Tuan
-- Create date: 24/12/2019
-- Description:	Báo cáo cân đối phát sinh tài khoản
-- =============================================
CREATE PROCEDURE [dbo].[Book_DebitAge]	
	@Date as datetime ='1/1/2000',
	@Currency as nchar(50) ='VND'
AS
BEGIN
	SET TRANSACTION isolation level READ uncommitted 
-- set default date
	if @Date='1/1/2000' or @Date is NULL or @Date=''
	begin
		set @Date = DATEFROMPARTS (Year(getdate()),Month(getdate()),1)
	END

	Declare  @T Table(
	[CompanyName] [nvarchar](50) NOT NULL,
	[FirstMonth] [decimal](18, 4) default 0 NULL,
	[SecondMonth][decimal](18, 4) default 0 NULL,
	[ThirdMonth] [decimal](18, 4) default 0 NULL,
	[fourthMonth] [decimal](18, 4) default 0 NULL,
	[Sumtotal] [decimal](18, 4) default 0 NULL
	) 
	INSERT INTO @T	VALUES (N'Anh Cường','26000000', '26000000', '0','26000000','0');
	INSERT INTO @T	VALUES (N'Hoàng Phát','0', '28000000', '28000000','0','28000000');
    INSERT INTO @T	VALUES (N'Hoàng Cường','30000000', '0', '0','30000000','30000000');
	INSERT INTO @T	VALUES (N'Tiến Nhật','0', '30000000', '0','30000000','30000000');
	INSERT INTO @T	VALUES (N'Cty TNHH Hoàng Bửu ','0', '30000000', '0','30000000','30000000');
	select * from @T
End
GO
/****** Object:  StoredProcedure [dbo].[Book_PurchaseReport]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Tuan
-- Create date: 24/12/2019
-- Description:	Báo cáo cân đối phát sinh tài khoản
-- =============================================
CREATE PROCEDURE [dbo].[Book_PurchaseReport]	
	@supplier as nvarchar(50) ='',
	@fromDate as datetime ='1/1/2000',
	@toDate as dateTime ='1/1/2000',
	@productServices as nvarchar(50) ='VND'
AS
BEGIN
	SET TRANSACTION isolation level READ uncommitted 
-- set default date
	if @fromDate='1/1/2000' or @fromDate is NULL or @fromDate=''
	begin
		set @fromDate = DATEFROMPARTS (Year(getdate()),Month(getdate()),1)
		set @toDate = EOMONTH(getdate())
	END

	Declare  @T Table(
	[ProductName] [nvarchar](50) NOT NULL,
	[Supplier] [nvarchar](50) NOT NULL,
	[InvoiceNumber] [nvarchar](50) NOT NULL,
	[InvoiceID] [nvarchar](50) NOT NULL,
	[Date] dateTime,
	[UnitPrice] [decimal](18, 4) default 0 NULL,
	[Amount] [decimal](18, 4) default 0 NULL,
	[Discount] [decimal](18, 4) default 0 NULL,
	[Payment] [decimal](18, 4) default 0 NULL
	) 
	INSERT INTO @T	VALUES (N' Nguyen Van Anh Cường',N'Nguyen Van Anh Cường',N'N0007','30007','1/1/2000', '0','1','0','26000000');
		INSERT INTO @T	VALUES (N' Nguyen Van Anh Cường',N'Nguyen Van Anh Cường',N'N0009','30007','1/1/2000', '0','1','0','26000000');
			INSERT INTO @T	VALUES (N' Nguyen Van Anh Cường',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
				INSERT INTO @T	VALUES (N' Nguyen Van Anh Cường',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
					INSERT INTO @T	VALUES (N' Nguyen Van Anh Cường',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
	INSERT INTO @T	VALUES (N' Nguyen Van Anh',N'Nguyen Van Anh Cường',N'N0007','40360','1/1/2000', '0','1','0','26000000');
		INSERT INTO @T	VALUES (N' Nguyen Van Anh',N'Nguyen Van Anh Cường',N'N0007','40362','1/1/2000', '0','1','0','26000000');
			INSERT INTO @T	VALUES (N' Nguyen Van Anh',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
				INSERT INTO @T	VALUES (N' Nguyen Van Anh',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
					INSERT INTO @T	VALUES (N' Nguyen Van Anh',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
						INSERT INTO @T	VALUES (N' Nguyen Van Anh',N'Nguyen Van Anh Cường',N'N0007','40360','1/1/2000', '0','1','0','26000000');
		INSERT INTO @T	VALUES (N' Nguyen Van',N'Nguyen Van Anh Cường',N'N0007','40362','1/1/2000', '0','1','0','26000000');
			INSERT INTO @T	VALUES (N' Nguyen Van',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
				INSERT INTO @T	VALUES (N' Nguyen Van',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
					INSERT INTO @T	VALUES (N' Nguyen Van',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
	select * from @T
End
GO
/****** Object:  StoredProcedure [dbo].[Book_SalesReport]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Tuan
-- Create date: 24/12/2019
-- Description:	Báo cáo cân đối phát sinh tài khoản
-- =============================================
CREATE PROCEDURE [dbo].[Book_SalesReport]	
	@productName as nvarchar(50) ='',
	@fromDate as datetime ='1/1/2000',
	@toDate as dateTime ='1/1/2000',
	@Currency as nvarchar(50) ='VND'
AS
BEGIN
	SET TRANSACTION isolation level READ uncommitted 
-- set default date
	if @fromDate='1/1/2000' or @fromDate is NULL or @fromDate=''
	begin
		set @fromDate = DATEFROMPARTS (Year(getdate()),Month(getdate()),1)
		set @toDate = EOMONTH(getdate())
	END

	Declare  @T Table(
	[ProductName] [nvarchar](50) NOT NULL,
	[CustomerName] [nvarchar](50) NOT NULL,
	[InvoiceNumber] [nvarchar](50) NOT NULL,
	[InvoiceID] [nvarchar](50) NOT NULL,
	[Date] dateTime,
	[UnitPrice] [decimal](18, 4) default 0 NULL,
	[Amount] [decimal](18, 4) default 0 NULL,
	[Discount] [decimal](18, 4) default 0 NULL,
	[Payment] [decimal](18, 4) default 0 NULL
	) 
	INSERT INTO @T	VALUES (N' Nguyen Van Anh Cường',N'Nguyen Van Anh Cường',N'N0007','40360','1/1/2000', '0','1','0','26000000');
		INSERT INTO @T	VALUES (N' Nguyen Van Anh Cường',N'Nguyen Van Anh Cường',N'N0009','40362','1/1/2000', '0','1','0','26000000');
			INSERT INTO @T	VALUES (N' Nguyen Van Anh Cường',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
				INSERT INTO @T	VALUES (N' Nguyen Van Anh Cường',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
					INSERT INTO @T	VALUES (N' Nguyen Van Anh Cường',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
	INSERT INTO @T	VALUES (N' Nguyen Van Anh',N'Nguyen Van Anh Cường',N'N0007','40360','1/1/2000', '0','1','0','26000000');
		INSERT INTO @T	VALUES (N' Nguyen Van Anh',N'Nguyen Van Anh Cường',N'N0007','40362','1/1/2000', '0','1','0','26000000');
			INSERT INTO @T	VALUES (N' Nguyen Van Anh',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
				INSERT INTO @T	VALUES (N' Nguyen Van Anh',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
					INSERT INTO @T	VALUES (N' Nguyen Van Anh',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
						INSERT INTO @T	VALUES (N' Nguyen Van Anh',N'Nguyen Van Anh Cường',N'N0007','40360','1/1/2000', '0','1','0','26000000');
		INSERT INTO @T	VALUES (N' Nguyen Van',N'Nguyen Van Anh Cường',N'N0007','40362','1/1/2000', '0','1','0','26000000');
			INSERT INTO @T	VALUES (N' Nguyen Van',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
				INSERT INTO @T	VALUES (N' Nguyen Van',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
					INSERT INTO @T	VALUES (N' Nguyen Van',N'Nguyen Van Anh Cường',N'N0007','26000000','1/1/2000', '0','1','0','26000000');
	select * from @T
End
GO
/****** Object:  StoredProcedure [dbo].[GetBuyInvoiceList]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetBuyInvoiceList]
	@searchString as nvarchar(100)='', -- separate by ';'
	@fromDate as datetime ='1/1/2000',
	@toDate as dateTime ='1/1/2000',
	@isIssueDate as bit=1
AS
BEGIN
	Declare @Temp TABLE (	Item nvarchar(200)	)
	Insert into @Temp Select * from StringToTable(@searchString,';')

	if @fromDate='1/1/2000' or @fromDate is NULL or @fromDate=''
	begin
		set @fromDate = DATEFROMPARTS (Year(getdate()),Month(getdate()),1)
		set @toDate = EOMONTH(getdate())
	END

	Declare @Result TABLE (	invoiceID  bigint,invoiceNumber  nvarchar(50), invoiceSerial  nvarchar(50)
		,supplierName  nvarchar(150), supplierID int, bankAccount nvarchar(150),note  nvarchar(250),contactName nvarchar(200),issueDate   dateTime,dueDate  dateTime
		, amount  Decimal(18,4),amountPaid  Decimal(18,4)	)

	If 	0=(select count(*) from @Temp)
		BEGIN
			Insert into @result
			Select  b.invoiceID, b.invoiceNumber, b.invoiceSerial,a.supplierName,a.supplierID,a.bankAccount,b.note,a.contactName,b.issueDate,b.dueDate
			,'amount' = isnull((subTotal+isnull(vatTax,0)-isnull(discount,0)),0) 
			,'amountPaid'=isnull((select sum(amount) from Payments_2 where invoiceID=b.invoiceID),0)
			from [dbo].[Supplier] a join  [dbo].[BuyInvoice] b ON a.supplierID=b.supplierID
			Where ((b.issueDate between @fromdate and @toDate)  and  @isIssueDate =1 )
					OR  ((b.dueDate between @fromdate and @toDate)  and  @isIssueDate =0 )
				
			order by b.issueDate desc
		END
	Else
	BEGIN
		Declare @item as nvarchar(100)
		DECLARE mycursor CURSOR FOR SELECT Item from @temp
		OPEN mycursor FETCH NEXT FROM mycursor INTO @item
		WHILE @@FETCH_STATUS = 0
		BEGIN
		Insert into @result
			Select  b.invoiceID, b.invoiceNumber, b.invoiceSerial,a.supplierName,a.supplierID,a.bankAccount,b.note,a.contactName,b.issueDate,b.dueDate
			,'amount' = isnull((subTotal+isnull(vatTax,0)-isnull(discount,0)),0) 
			,'amountPaid'=isnull((select sum(amount) from Payments_2 where invoiceID=b.invoiceID),0)
			from [dbo].[Supplier] a join  [dbo].[BuyInvoice] b ON a.supplierID=b.supplierID
			Where (supplierName like N'%' + @item + '%' OR  invoiceNumber like N'%' + @item + '%'
					OR  b.note like N'%' + @item + '%'	)
					And (
					((b.issueDate between @fromdate and @toDate)  and  @isIssueDate =1 )
					OR  ((b.dueDate between @fromdate and @toDate)  and  @isIssueDate =0 )
					)
			order by b.issueDate desc
				FETCH NEXT FROM mycursor INTO @item
		END
		CLOSE mycursor	
		DEALLOCATE mycursor
	END
	Select distinct invoiceID, invoiceNumber, invoiceSerial,supplierID,supplierName,note,issueDate,dueDate,amount,amountPaid,contactName,bankAccount
	from @result
	END

GO
/****** Object:  StoredProcedure [dbo].[GetClientList]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- exec GetClientList ''
CREATE PROCEDURE [dbo].[GetClientList]
	@searchString as nvarchar(100)
AS
BEGIN

Set @searchString=replace(@searchString,' ','%')
Select top 200 a.clientID,clientName,a.address,a.note
,'Outstanding' = isnull((select Sum(subTotal+isnull(vatTax,0)-isnull(discount,0)
			-isnull(amountPaid,0)) 
	from [SaleInvoice] b where clientID=a.clientID ),0)
, 'Overdue' = isnull((select Sum(subTotal+isnull(vatTax,0)-isnull(discount,0)-isnull(amountPaid,0)) 
	from [SaleInvoice] b where clientID=a.clientID and dueDate < getdate()),0)

from [dbo].[Client] a 
Where clientName like N'%' + @searchString + '%' OR  address like N'%' + @searchString + '%'  
		OR  note like N'%' + @searchString + '%'  
order by clientName
END

GO
/****** Object:  StoredProcedure [dbo].[GetInvoiceList]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- exec GetInvoiceList 'a'
CREATE PROCEDURE [dbo].[GetInvoiceList]
	@searchString as nvarchar(100)='', -- separate by ';'
	@fromDate as datetime ='1/1/2000',
	@toDate as dateTime ='1/1/2000',
	@isIssueDate as bit=1
AS
BEGIN

-- bring string to table separate by ';'
	Declare @Temp TABLE (	Item nvarchar(200)	)
	Insert into @Temp Select * from StringToTable(@searchString,';')

-- set default date
	if @fromDate='1/1/2000' or @fromDate is NULL or @fromDate=''
	begin
		set @fromDate = DATEFROMPARTS (Year(getdate()),Month(getdate()),1)
		set @toDate = EOMONTH(getdate())
	END
	
-- create result table
	Declare @Result TABLE (	invoiceID  bigint,invoiceNumber  nvarchar(50), invoiceSerial  nvarchar(50)
		,clientName  nvarchar(150), clientID int, bankAccount nvarchar(150),note  nvarchar(250),contactName nvarchar(200),issueDate   dateTime,dueDate  dateTime
		, amount  Decimal(18,4),amountPaid  Decimal(18,4)	)
-- Get result
	If 	0=(select count(*) from @Temp)
		BEGIN
			Insert into @result
			Select  b.invoiceID, b.invoiceNumber, b.invoiceSerial,a.clientName,a.clientID,a.bankAccount,b.note,a.contactName,b.issueDate,b.dueDate
			,'amount' = isnull((subTotal+isnull(vatTax,0)-isnull(discount,0)),0) 
			,'amountPaid'=isnull((select sum(amount) from Payments where invoiceID=b.invoiceID),0)
			from [dbo].[Client] a join  [dbo].[SaleInvoice] b ON a.clientID=b.clientID
			Where ((b.issueDate between @fromdate and @toDate)  and  @isIssueDate =1 )
					OR  ((b.dueDate between @fromdate and @toDate)  and  @isIssueDate =0 )
				
			order by b.issueDate desc
		END
	Else
	BEGIN
		-- get result from each searching item
		Declare @item as nvarchar(100)
		DECLARE mycursor CURSOR FOR SELECT Item from @temp
		OPEN mycursor FETCH NEXT FROM mycursor INTO @item

		WHILE @@FETCH_STATUS = 0
		BEGIN
		Insert into @result
			Select  b.invoiceID, b.invoiceNumber, b.invoiceSerial,a.clientName,a.clientID,a.bankAccount,b.note,a.contactName,b.issueDate,b.dueDate
			,'amount' = isnull((subTotal+isnull(vatTax,0)-isnull(discount,0)),0) 
			,'amountPaid'=isnull((select sum(amount) from Payments where invoiceID=b.invoiceID),0)
			from [dbo].[Client] a join  [dbo].[SaleInvoice] b ON a.clientID=b.clientID
			Where (clientName like N'%' + @item + '%' OR  invoiceNumber like N'%' + @item + '%'
					OR  b.note like N'%' + @item + '%'	)
					And (
					((b.issueDate between @fromdate and @toDate)  and  @isIssueDate =1 )
					OR  ((b.dueDate between @fromdate and @toDate)  and  @isIssueDate =0 )
					)
			order by b.issueDate desc
		FETCH NEXT FROM mycursor INTO @item
		END
		CLOSE mycursor
		DEALLOCATE mycursor
	END
-- return distinct result	
	Select distinct invoiceID, invoiceNumber, invoiceSerial,clientID,clientName,note,issueDate,dueDate,amount,amountPaid,contactName,bankAccount
	from @result
		
END

GO
/****** Object:  StoredProcedure [dbo].[GetSupplierList]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetSupplierList]
	@searchString as nvarchar(100)
AS
BEGIN
	Set @searchString=replace(@searchString,' ','%')
	Select top 200 a.supplierID,supplierName,a.address,a.note,'Outstanding' = isnull((select Sum(subTotal+isnull(vatTax,0)-isnull(discount,0)-isnull(amountPaid,0)) 
			from  BuyInvoice b where supplierID=a.supplierID ),0),'Overdue' = isnull((select Sum(subTotal+isnull(vatTax,0)-isnull(discount,0)-isnull(amountPaid,0)) 
	from BuyInvoice b where supplierID=a.supplierID and dueDate < getdate()),0)
			from Supplier a
	Where supplierName like N'%' + @searchString + '%' OR  address like N'%' + @searchString + '%'  
		OR  note like N'%' + @searchString + '%'  
order by supplierName
END

GO
/****** Object:  StoredProcedure [dbo].[MoneyReceiptList]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Tuan
-- Create date: 24/12/2019
-- Description:	Báo cáo cân đối phát sinh tài khoản
-- =============================================

CREATE PROCEDURE [dbo].[MoneyReceiptList]
	@searchString as nvarchar(100)='', -- separate by ';'
	@fromDate as datetime ='1/1/2000',
	@toDate as dateTime ='1/1/2000',
	@Currency as nchar(50) ='VND'
AS
BEGIN

-- bring string to table separate by ';'
	Declare @Temp TABLE (	Item nvarchar(200)	)
	Insert into @Temp Select * from StringToTable(@searchString,';')

-- set default date
	if @fromDate='1/1/2000' or @fromDate is NULL or @fromDate=''
	begin
		set @fromDate = DATEFROMPARTS (Year(getdate()),Month(getdate()),1)
		set @toDate = EOMONTH(getdate())
	END
	
-- create result table
	Declare @Result TABLE (	ID  bigint,receiptNumber  nvarchar(50), entryType  nvarchar(100)
		,clientID bigint,clientName  nvarchar(150),receiverName  nvarchar(150),payDate   dateTime
		,payTypeID int,payType nvarchar(50)
		,bankAccount nvarchar(150), amount  Decimal(18,4),note  nvarchar(250)
		)
-- Get result
	If 	0=(select count(*) from @Temp)
		BEGIN
			Insert into @result
			Select  * from dbo.MoneyReceipt 
			Where payDate between @fromdate and @toDate			
			order by payDate desc
		END
	Else
	BEGIN
		-- get result from each searching item
		Declare @item as nvarchar(100)
		DECLARE mycursor CURSOR FOR SELECT Item from @temp
		OPEN mycursor FETCH NEXT FROM mycursor INTO @item

		WHILE @@FETCH_STATUS = 0
		BEGIN
		Insert into @result
			Select * from dbo.MoneyReceipt 
			Where (clientName like N'%' + @item + '%' OR  receiptNumber like N'%' + @item + '%'
					OR  note like N'%' + @item + '%'	OR  receiverName like N'%' + @item + '%'
					OR  bankAccount like N'%' + @item + '%')
					And (payDate between @fromdate and @toDate)				
			order by payDate desc
		FETCH NEXT FROM mycursor INTO @item
		END
		CLOSE mycursor
		DEALLOCATE mycursor
	END
-- return distinct result	
	Select distinct 
		ID ,receiptNumber , entryType
		,clientID ,clientName  ,receiverName ,payDate   
		,payTypeID ,payType	,bankAccount , amount ,note 
	from @result

END

GO
/****** Object:  StoredProcedure [dbo].[PaymentReceiptList]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[PaymentReceiptList]
	@searchString as nvarchar(100)='', -- separate by ';'
	@fromDate as datetime ='1/1/2000',
	@toDate as dateTime ='1/1/2000',
	@Currency as nchar(50) ='VND'
AS
BEGIN

-- bring string to table separate by ';'
	Declare @Temp TABLE (	Item nvarchar(200)	)
	Insert into @Temp Select * from StringToTable(@searchString,';')

-- set default date
	if @fromDate='1/1/2000' or @fromDate is NULL or @fromDate=''
	begin
		set @fromDate = DATEFROMPARTS (Year(getdate()),Month(getdate()),1)
		set @toDate = EOMONTH(getdate())
	END
	
-- create result table
	Declare @Result TABLE (	ID  bigint,receiptNumber  nvarchar(50), entryType  nvarchar(100)
		,[supplierID] bigint,[supplierName]  nvarchar(150),receiverName  nvarchar(150),payDate   dateTime
		,payTypeID int,payType nvarchar(50)
		,bankAccount nvarchar(150), amount  Decimal(18,4),note  nvarchar(250)
		)
-- Get result
	If 	0=(select count(*) from @Temp)
		BEGIN
			Insert into @result
			Select  * from  [dbo].[PaymentReceipt]
			Where payDate between @fromdate and @toDate			
			order by payDate desc
		END
	Else
	BEGIN
		-- get result from each searching item
		Declare @item as nvarchar(100)
		DECLARE mycursor CURSOR FOR SELECT Item from @temp
		OPEN mycursor FETCH NEXT FROM mycursor INTO @item

		WHILE @@FETCH_STATUS = 0
		BEGIN
		Insert into @result
			Select * from [dbo].[PaymentReceipt]
			Where (supplierName like N'%' + @item + '%' OR  receiptNumber like N'%' + @item + '%'
					OR  note like N'%' + @item + '%'	OR  receiverName like N'%' + @item + '%'
					OR  bankAccount like N'%' + @item + '%')
					And (payDate between @fromdate and @toDate)				
			order by payDate desc
		FETCH NEXT FROM mycursor INTO @item
		END
		CLOSE mycursor
		DEALLOCATE mycursor
	END
-- return distinct result	
	Select distinct 
		ID ,receiptNumber , entryType
		,[supplierID] , [supplierName] ,receiverName ,payDate   
		,payTypeID ,payType	,bankAccount , amount ,note 
	from @result

END

GO
/****** Object:  Table [dbo].[AccountChart]    Script Date: 2/14/2020 6:08:13 PM ******/
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
/****** Object:  Table [dbo].[AppRoleClaims]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppRoleClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleId] [int] NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_AppRoleClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AppRoles]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppRoles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](256) NULL,
	[NormalizedName] [nvarchar](256) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
	[Description] [nvarchar](250) NULL,
 CONSTRAINT [PK_AppRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AppUserClaims]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_AppUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AppUserLogins]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppUserLogins](
	[LoginProvider] [nvarchar](450) NOT NULL,
	[ProviderKey] [nvarchar](450) NOT NULL,
	[ProviderDisplayName] [nvarchar](max) NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [PK_AppUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [AK_AppUserLogins_UserId] UNIQUE NONCLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AppUserRoles]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppUserRoles](
	[UserId] [int] NOT NULL,
	[RoleId] [int] NOT NULL,
 CONSTRAINT [PK_AppUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [AK_AppUserRoles_RoleId_UserId] UNIQUE NONCLUSTERED 
(
	[RoleId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AppUsers]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppUsers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](256) NULL,
	[NormalizedUserName] [nvarchar](256) NULL,
	[Email] [nvarchar](256) NULL,
	[NormalizedEmail] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEnd] [datetimeoffset](7) NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
	[FullName] [nvarchar](max) NULL,
	[BirthDay] [datetime2](7) NULL,
	[Balance] [decimal](18, 2) NOT NULL,
	[Avatar] [nvarchar](max) NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateModified] [datetime2](7) NOT NULL,
	[Status] [int] NOT NULL,
 CONSTRAINT [PK_AppUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AppUserTokens]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppUserTokens](
	[UserId] [int] NOT NULL,
	[LoginProvider] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](450) NOT NULL,
	[Value] [nvarchar](max) NULL,
 CONSTRAINT [PK_AppUserTokens] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[LoginProvider] ASC,
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [AK_AppUserTokens_UserId] UNIQUE NONCLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[BuyInvDetail]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BuyInvDetail](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[invoiceID] [bigint] NOT NULL,
	[productID] [int] NOT NULL,
	[productName] [nvarchar](100) NULL,
	[description] [nvarchar](100) NULL,
	[qty] [decimal](18, 4) NULL,
	[price] [decimal](18, 4) NULL,
	[amount] [decimal](18, 4) NULL,
	[vat] [decimal](4, 2) NULL,
 CONSTRAINT [PK_BuyInvDetail] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[BuyInvoice]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[BuyInvoice](
	[invoiceID] [bigint] IDENTITY(1,1) NOT NULL,
	[invoiceSerial] [varchar](50) NOT NULL,
	[invoiceNumber] [varchar](50) NOT NULL,
	[issueDate] [datetime] NULL,
	[dueDate] [datetime] NULL,
	[supplierID] [int] NULL,
	[reference] [nvarchar](100) NULL,
	[subTotal] [decimal](18, 4) NULL,
	[discRate] [decimal](4, 2) NULL,
	[discount] [decimal](18, 4) NULL,
	[vatTax] [decimal](18, 4) NULL,
	[amountPaid] [decimal](18, 4) NULL,
	[note] [nvarchar](200) NULL,
	[term] [nvarchar](200) NULL,
	[status] [nvarchar](50) NULL,
 CONSTRAINT [PK_buyInvoice] PRIMARY KEY CLUSTERED 
(
	[invoiceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Category]    Script Date: 2/14/2020 6:08:13 PM ******/
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
/****** Object:  Table [dbo].[Client]    Script Date: 2/14/2020 6:08:13 PM ******/
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
	[bankAccount] [nvarchar](150) NULL,
 CONSTRAINT [PK_Clients] PRIMARY KEY CLUSTERED 
(
	[clientID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[companyProfile]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[companyProfile](
	[companyName] [nvarchar](100) NOT NULL,
	[address] [nvarchar](200) NOT NULL,
	[city] [nvarchar](100) NOT NULL,
	[country] [nvarchar](100) NOT NULL,
	[zipCode] [nvarchar](100) NULL,
	[currency] [nvarchar](100) NULL,
	[dateFormat] [nvarchar](100) NULL,
	[bizPhone] [nvarchar](100) NULL,
	[mobilePhone] [nvarchar](100) NULL,
	[directorName] [nvarchar](100) NULL,
	[logoFilePath] [varchar](100) NULL,
	[taxCode] [nvarchar](50) NULL,
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[bankAccount] [nvarchar](150) NULL,
	[code] [varchar](50) NULL,
 CONSTRAINT [PK_companyProfile] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[EntryPattern]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntryPattern](
	[patternID] [int] IDENTITY(1,1) NOT NULL,
	[transactionType] [nvarchar](100) NOT NULL,
	[entryType] [nvarchar](100) NOT NULL,
	[accNumber] [nvarchar](20) NOT NULL,
	[crspAccNumber] [nvarchar](20) NOT NULL,
	[note] [nvarchar](200) NULL,
 CONSTRAINT [PK_EntryPattern] PRIMARY KEY CLUSTERED 
(
	[patternID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[GeneralLedger]    Script Date: 2/14/2020 6:08:13 PM ******/
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
	[accNumber] [nvarchar](20) NOT NULL,
	[crspAccNumber] [nvarchar](20) NOT NULL,
	[dateIssue] [datetime] NOT NULL,
	[clientID] [varchar](100) NULL,
	[clientName] [nvarchar](200) NULL,
	[note] [nvarchar](200) NULL,
	[reference] [nvarchar](200) NULL,
	[debit] [decimal](18, 4) NOT NULL,
	[credit] [decimal](18, 4) NOT NULL,
 CONSTRAINT [PK_GeneralLedger] PRIMARY KEY CLUSTERED 
(
	[ledgerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[JournalDetail]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[JournalDetail](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[JournalID] [bigint] NOT NULL,
	[accNumber] [nvarchar](20) NOT NULL,
	[crspAccNumber] [nvarchar](20) NOT NULL,
	[note] [nvarchar](200) NULL,
	[debit] [decimal](18, 4) NOT NULL,
	[credit] [decimal](18, 4) NOT NULL,
 CONSTRAINT [PK_JournalDetail] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[JournalEntry]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[JournalEntry](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[entryName] [nvarchar](200) NOT NULL,
	[description] [nvarchar](500) NULL,
	[dateCreate] [datetime] NOT NULL,
	[objectType] [varchar](50) NULL,
	[objectID] [bigint] NULL,
	[objectName] [nvarchar](200) NULL,
 CONSTRAINT [PK_JournalEntry] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[MasterParam]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[MasterParam](
	[paramType] [varchar](50) NOT NULL,
	[key] [varchar](50) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[description] [nvarchar](200) NOT NULL,
 CONSTRAINT [PK_MasterParam] PRIMARY KEY CLUSTERED 
(
	[paramType] ASC,
	[key] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[MoneyReceipt]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MoneyReceipt](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[receiptNumber] [nvarchar](100) NOT NULL,
	[entryType] [nvarchar](100) NOT NULL,
	[clientID] [bigint] NULL,
	[clientName] [nvarchar](200) NULL,
	[receiverName] [nvarchar](100) NULL,
	[payDate] [datetime] NOT NULL,
	[payTypeID] [int] NOT NULL,
	[payType] [nvarchar](100) NOT NULL,
	[bankAccount] [nvarchar](300) NULL,
	[amount] [decimal](18, 4) NOT NULL,
	[note] [nvarchar](200) NULL,
 CONSTRAINT [PK_MoneyReceipt] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[PaymentReceipt]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PaymentReceipt](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[receiptNumber] [nvarchar](100) NOT NULL,
	[entryType] [nvarchar](100) NOT NULL,
	[supplierID] [bigint] NULL,
	[supplierName] [nvarchar](200) NULL,
	[receiverName] [nvarchar](100) NULL,
	[payDate] [datetime] NOT NULL,
	[payTypeID] [int] NOT NULL,
	[payType] [nvarchar](100) NOT NULL,
	[bankAccount] [nvarchar](300) NULL,
	[amount] [decimal](18, 4) NOT NULL,
	[note] [nvarchar](200) NULL,
 CONSTRAINT [PK_PaymentReceipt] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Payments]    Script Date: 2/14/2020 6:08:13 PM ******/
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
	[amount] [decimal](18, 4) NOT NULL,
	[note] [nvarchar](200) NULL,
	[receiptNumber] [nvarchar](100) NULL,
 CONSTRAINT [PK_Payments] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Payments_2]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Payments_2](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[invoiceID] [bigint] NOT NULL,
	[payDate] [datetime] NOT NULL,
	[payTypeID] [int] NOT NULL,
	[payType] [nvarchar](100) NOT NULL,
	[amount] [decimal](18, 4) NOT NULL,
	[note] [nvarchar](200) NULL,
	[receiptNumber] [nvarchar](100) NULL,
 CONSTRAINT [PK_Payments-2] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Product]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product](
	[productID] [int] IDENTITY(1,1) NOT NULL,
	[productName] [nvarchar](100) NULL,
	[description] [nvarchar](100) NULL,
	[unitPrice] [decimal](18, 4) NULL,
	[categoryID] [int] NULL,
	[Unit] [nvarchar](50) NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[productID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[SaleInvDetail]    Script Date: 2/14/2020 6:08:13 PM ******/
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
/****** Object:  Table [dbo].[SaleInvoice]    Script Date: 2/14/2020 6:08:13 PM ******/
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
/****** Object:  Table [dbo].[Supplier]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Supplier](
	[supplierID] [int] IDENTITY(1,1) NOT NULL,
	[supplierName] [nvarchar](100) NOT NULL,
	[address] [nvarchar](200) NULL,
	[taxCode] [nvarchar](50) NULL,
	[Tag] [nvarchar](50) NULL,
	[contactName] [nvarchar](200) NULL,
	[email] [nvarchar](200) NULL,
	[note] [nvarchar](200) NULL,
	[bankAccount] [nvarchar](150) NULL,
 CONSTRAINT [PK_Suppliers] PRIMARY KEY CLUSTERED 
(
	[supplierID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Tax]    Script Date: 2/14/2020 6:08:13 PM ******/
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
/****** Object:  Table [dbo].[User]    Script Date: 2/14/2020 6:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[User](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [varchar](50) NOT NULL,
	[Password] [varchar](50) NOT NULL,
	[FristName] [nvarchar](60) NULL,
	[LastName] [nvarchar](60) NULL,
	[Type] [varchar](20) NOT NULL,
	[Token] [varchar](100) NULL,
 CONSTRAINT [PK_dbo.User] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
ALTER TABLE [dbo].[AccountChart] ADD  CONSTRAINT [DF_AcountChart_openingBalance]  DEFAULT ((0)) FOR [openingBalance]
GO
ALTER TABLE [dbo].[AccountChart] ADD  CONSTRAINT [DF_AcountChart_closingBalance]  DEFAULT ((0)) FOR [closingBalance]
GO
ALTER TABLE [dbo].[Client] ADD  DEFAULT ('') FOR [bankAccount]
GO
ALTER TABLE [dbo].[companyProfile] ADD  DEFAULT ('') FOR [bankAccount]
GO
ALTER TABLE [dbo].[companyProfile] ADD  DEFAULT ('') FOR [code]
GO
ALTER TABLE [dbo].[GeneralLedger] ADD  CONSTRAINT [DF_GeneralLedger_debit]  DEFAULT ((0)) FOR [debit]
GO
ALTER TABLE [dbo].[GeneralLedger] ADD  CONSTRAINT [DF_GeneralLedger_credit]  DEFAULT ((0)) FOR [credit]
GO
ALTER TABLE [dbo].[JournalDetail] ADD  CONSTRAINT [DF_JournalDetail_debit]  DEFAULT ((0)) FOR [debit]
GO
ALTER TABLE [dbo].[JournalDetail] ADD  CONSTRAINT [DF_JournalDetail_credit]  DEFAULT ((0)) FOR [credit]
GO
ALTER TABLE [dbo].[JournalEntry] ADD  DEFAULT ('') FOR [objectType]
GO
ALTER TABLE [dbo].[JournalEntry] ADD  DEFAULT ('') FOR [objectName]
GO
ALTER TABLE [dbo].[MasterParam] ADD  CONSTRAINT [DF_MasterParam_description]  DEFAULT ('--') FOR [description]
GO
ALTER TABLE [dbo].[Product] ADD  DEFAULT ('') FOR [Unit]
GO
ALTER TABLE [dbo].[AppRoleClaims]  WITH CHECK ADD  CONSTRAINT [FK_AppRoleClaims_AppRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AppRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AppRoleClaims] CHECK CONSTRAINT [FK_AppRoleClaims_AppRoles_RoleId]
GO
ALTER TABLE [dbo].[AppUserClaims]  WITH CHECK ADD  CONSTRAINT [FK_AppUserClaims_AppUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AppUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AppUserClaims] CHECK CONSTRAINT [FK_AppUserClaims_AppUsers_UserId]
GO
ALTER TABLE [dbo].[AppUserLogins]  WITH CHECK ADD  CONSTRAINT [FK_AppUserLogins_AppUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AppUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AppUserLogins] CHECK CONSTRAINT [FK_AppUserLogins_AppUsers_UserId]
GO
ALTER TABLE [dbo].[AppUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_AppUserRoles_AppRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AppRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AppUserRoles] CHECK CONSTRAINT [FK_AppUserRoles_AppRoles_RoleId]
GO
ALTER TABLE [dbo].[AppUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_AppUserRoles_AppUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AppUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AppUserRoles] CHECK CONSTRAINT [FK_AppUserRoles_AppUsers_UserId]
GO
ALTER TABLE [dbo].[AppUserTokens]  WITH CHECK ADD  CONSTRAINT [FK_AppUserTokens_AppUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AppUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AppUserTokens] CHECK CONSTRAINT [FK_AppUserTokens_AppUsers_UserId]
GO
ALTER TABLE [dbo].[BuyInvDetail]  WITH CHECK ADD  CONSTRAINT [FK_BuyInvDetail_BuyInvoice] FOREIGN KEY([invoiceID])
REFERENCES [dbo].[BuyInvoice] ([invoiceID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[BuyInvDetail] CHECK CONSTRAINT [FK_BuyInvDetail_BuyInvoice]
GO
ALTER TABLE [dbo].[BuyInvDetail]  WITH CHECK ADD  CONSTRAINT [FK_BuyInvDetail_Product] FOREIGN KEY([productID])
REFERENCES [dbo].[Product] ([productID])
GO
ALTER TABLE [dbo].[BuyInvDetail] CHECK CONSTRAINT [FK_BuyInvDetail_Product]
GO
ALTER TABLE [dbo].[BuyInvoice]  WITH CHECK ADD  CONSTRAINT [FK_BuyInvoice_Supplier] FOREIGN KEY([supplierID])
REFERENCES [dbo].[Supplier] ([supplierID])
GO
ALTER TABLE [dbo].[BuyInvoice] CHECK CONSTRAINT [FK_BuyInvoice_Supplier]
GO
ALTER TABLE [dbo].[Payments]  WITH CHECK ADD  CONSTRAINT [FK_Payments_SaleInvoice1] FOREIGN KEY([invoiceID])
REFERENCES [dbo].[SaleInvoice] ([invoiceID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Payments] CHECK CONSTRAINT [FK_Payments_SaleInvoice1]
GO
ALTER TABLE [dbo].[Payments_2]  WITH CHECK ADD  CONSTRAINT [FK_Payments_2_BuyInvoice] FOREIGN KEY([invoiceID])
REFERENCES [dbo].[BuyInvoice] ([invoiceID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Payments_2] CHECK CONSTRAINT [FK_Payments_2_BuyInvoice]
GO
ALTER TABLE [dbo].[SaleInvDetail]  WITH CHECK ADD  CONSTRAINT [FK_SaleInvDetail_Product] FOREIGN KEY([productID])
REFERENCES [dbo].[Product] ([productID])
GO
ALTER TABLE [dbo].[SaleInvDetail] CHECK CONSTRAINT [FK_SaleInvDetail_Product]
GO
ALTER TABLE [dbo].[SaleInvDetail]  WITH CHECK ADD  CONSTRAINT [FK_SaleInvDetail_SaleInvoice] FOREIGN KEY([invoiceID])
REFERENCES [dbo].[SaleInvoice] ([invoiceID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[SaleInvDetail] CHECK CONSTRAINT [FK_SaleInvDetail_SaleInvoice]
GO
ALTER TABLE [dbo].[SaleInvoice]  WITH CHECK ADD  CONSTRAINT [FK_SaleInvoice_Customer] FOREIGN KEY([clientID])
REFERENCES [dbo].[Client] ([clientID])
GO
ALTER TABLE [dbo].[SaleInvoice] CHECK CONSTRAINT [FK_SaleInvoice_Customer]
GO
