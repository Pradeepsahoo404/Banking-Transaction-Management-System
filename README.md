# Banking-Transaction-Management-System
# Features:

# 1.User Authentication and Authorization:
Users can sign up and log in.
Authorization middleware ensures only authorized users can access specific endpoints.

# 2.Account Management:
Users can create different types of accounts (Basic Savings, Savings, Current).
Limits are imposed on account types to ensure regulatory compliance (e.g., Basic Savings account cannot exceed Rs. 50,000).

# 3.Transaction Handling:
Users can transfer money between accounts.
Limits are enforced on transfer amounts based on account types.
Transactions can be scheduled for future dates.

# 4.Scheduled Transactions:
A cron job checks for scheduled transactions every minute and processes them.
Notifications are sent to users upon transaction completion, failure, or when account limits are exceeded.

# 5.Role-Based Access Control:
Different endpoints are protected by role-based access controls (e.g., admin can access all accounts, regular users can only access their own transactions).

# 6.Email Notifications:
Users receive email notifications for various transaction statuses (pending, completed, failed).
Notifications are also sent when account limits are exceeded.

# 7.Pagination and Filtering:
Transactions can be fetched with pagination and filtered based on criteria like currency, transaction type, and status