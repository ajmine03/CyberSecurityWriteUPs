# SQL Fundamentals

## Platform

TryHackMe

## Overview

**SQL Fundamentals** is an introductory TryHackMe room focused on understanding databases and using SQL to interact with relational databases.

The room starts with basic database concepts and gradually introduces SQL statements, database and table management, CRUD operations, clauses, operators, and SQL functions.

It is designed to build a foundation for working with databases and understanding how SQL is used in web applications and cybersecurity.

## Learning Objectives

By completing this lab, you will learn:

• The difference between relational and non relational databases

• The basic structure of relational databases

• Tables, rows, columns, and keys

• Primary keys and foreign keys

• The purpose of a Database Management System

• The fundamentals of SQL

• How to create and interact with databases and tables

• CRUD operations

• SQL clauses

• SQL operators

• SQL functions

• How SQL is used to retrieve and filter information

## Database Fundamentals

A database is used to store and organise information so that it can be efficiently accessed and managed.

### Relational Databases

Relational databases store structured data using tables.

A table generally consists of:

**Columns**

Define the type or category of information being stored.

**Rows**

Represent individual records within a table.

For example, a books table might contain columns such as:

`id`

`name`

`author`

`publication_date`

Each individual book would then be represented as a row.

### Non Relational Databases

Non relational databases are designed for data that may not follow a fixed structure.

They are commonly useful when information can vary significantly in format.

## Database Keys

Keys are important for identifying and connecting records.

### Primary Key

A primary key uniquely identifies a record within a table.

A common example is an `id` column.

### Foreign Key

A foreign key creates a relationship between tables by referencing a key from another table.

This allows related information to be connected across multiple tables.

## DBMS

A **Database Management System**, or DBMS, provides an interface between users and databases.

A DBMS allows users and applications to:

• Retrieve information

• Insert data

• Modify records

• Delete records

• Manage databases and tables

Examples of relational database management systems include MySQL, PostgreSQL, Microsoft SQL Server, and Oracle Database.

## SQL

**SQL**, or Structured Query Language, is used to interact with relational databases.

SQL allows users to communicate with a database and perform operations on stored information.

Some common SQL statements include:

`SELECT`

`INSERT`

`UPDATE`

`DELETE`

`CREATE`

`ALTER`

`DROP`

## Database and Table Statements

The lab introduces statements used to inspect and manage databases.

### Listing Databases

A database server can contain multiple databases.

A common MySQL command for displaying available databases is:

```sql
SHOW DATABASES;
```

### Selecting a Database

Before working with tables, a database can be selected as the active database.

```sql
USE database_name;
```

### Listing Tables

Once a database has been selected, its tables can be displayed using:

```sql
SHOW TABLES;
```

These commands are useful during database enumeration and administration.

## CRUD Operations

CRUD represents the four basic operations performed on data.

### Create

Adding new records to a database.

```sql
INSERT
```

### Read

Retrieving existing information.

```sql
SELECT
```

### Update

Changing existing records.

```sql
UPDATE
```

### Delete

Removing records.

```sql
DELETE
```

Understanding CRUD operations is essential when working with databases and web applications.

## SELECT

The `SELECT` statement is one of the most commonly used SQL commands.

It is used to retrieve information from a table.

For example:

```sql
SELECT * FROM table_name;
```

The `*` represents all columns.

Specific columns can also be selected:

```sql
SELECT name, category FROM table_name;
```

## SQL Clauses

SQL clauses allow queries to be controlled and filtered.

Important clauses covered in the room include:

### WHERE

Used to filter records based on a condition.

```sql
SELECT *
FROM table_name
WHERE category = 'example';
```

### ORDER BY

Used to sort query results.

Ascending order:

```sql
ORDER BY name ASC;
```

Descending order:

```sql
ORDER BY name DESC;
```

### DISTINCT

Used to remove duplicate values from query results.

```sql
SELECT DISTINCT category
FROM table_name;
```

### LIMIT

Can be used to restrict the number of returned records.

```sql
SELECT *
FROM table_name
LIMIT 10;
```

## SQL Operators

Operators allow conditions to be compared or combined.

Common comparison operators include:

`=`

`!=`

`>`

`<`

`>=`

`<=`

SQL also provides logical operators such as:

`AND`

`OR`

`NOT`

These operators become particularly useful when constructing filtered queries.

## LIKE Operator

The `LIKE` operator is useful when searching for patterns within text.

For example:

```sql
SELECT *
FROM table_name
WHERE name LIKE '%test%';
```

The `%` wildcard represents zero or more characters.

This makes `LIKE` useful when the exact value is not known.

## SQL Functions

SQL provides built in functions for processing and analysing data.

### COUNT

Counts records or values.

```sql
SELECT COUNT(*)
FROM table_name;
```

### SUM

Calculates the total of numeric values.

```sql
SELECT SUM(amount)
FROM table_name;
```

### LENGTH

Returns the number of characters in a string.

```sql
SELECT LENGTH(name)
FROM table_name;
```

### CONCAT

Combines multiple strings into one value.

```sql
SELECT CONCAT(first_name, ' ', last_name)
FROM users;
```

Functions can be combined with other SQL clauses to perform more advanced queries.

## Aliases

Aliases allow columns or calculated values to be given a temporary name.

For example:

```sql
SELECT SUM(amount) AS total
FROM table_name;
```

Here, `total` becomes the name displayed for the calculated result.

Aliases can make query results easier to understand.

## Grouping and Aggregation

SQL can be used to group information and perform calculations across multiple records.

Common aggregation functions include:

`COUNT()`

`SUM()`

`AVG()`

`MIN()`

`MAX()`

These are useful for analysing datasets and extracting meaningful information from large tables.

## Practical Skills

After completing the room, you should be comfortable with:

• Identifying different database types

• Understanding relational database structures

• Working with tables and records

• Understanding primary and foreign keys

• Selecting databases

• Listing tables

• Retrieving records

• Filtering results

• Sorting results

• Removing duplicate values

• Using comparison operators

• Using pattern matching

• Performing basic calculations

• Using SQL functions

• Combining multiple SQL concepts in a query

## SQL and Cybersecurity

SQL knowledge is particularly important in cybersecurity because many web applications rely on databases.

Security professionals may encounter SQL while investigating:

• Web applications

• APIs

• Authentication systems

• User databases

• Application data

• Database permissions

• SQL injection vulnerabilities

Understanding normal SQL behaviour is an important prerequisite for understanding SQL injection.

Before learning how SQL injection works, it is useful to understand how legitimate SQL queries are constructed and processed.

## Important Commands

A few useful commands introduced throughout the room include:

```sql
SHOW DATABASES;
```

```sql
USE database_name;
```

```sql
SHOW TABLES;
```

```sql
SELECT * FROM table_name;
```

```sql
SELECT DISTINCT column_name
FROM table_name;
```

```sql
SELECT *
FROM table_name
WHERE condition;
```

```sql
SELECT *
FROM table_name
ORDER BY column_name ASC;
```

```sql
SELECT *
FROM table_name
ORDER BY column_name DESC;
```

```sql
SELECT COUNT(*)
FROM table_name;
```

```sql
SELECT SUM(amount)
FROM table_name;
```

```sql
SELECT LENGTH(name)
FROM table_name;
```

## Key Takeaways

The most important concepts from this lab are:

**Databases store organised information**

They provide a structured way to store and retrieve data.

**Relational databases use tables**

Data is organised into rows and columns.

**Primary keys identify records**

They help ensure that records can be uniquely identified.

**Foreign keys connect tables**

They allow relationships between different tables.

**SQL is used to interact with relational databases**

It provides commands for retrieving and manipulating data.

**CRUD represents basic data operations**

Create, Read, Update, and Delete form the foundation of database interaction.

**Clauses control queries**

Commands such as `WHERE`, `ORDER BY`, and `DISTINCT` help filter and organise results.

**Functions process data**

Functions such as `COUNT()`, `SUM()`, and `LENGTH()` allow information to be analysed.

## Final Summary

SQL Fundamentals provides the foundation required to understand relational databases and SQL.

The room progresses from basic database concepts into practical SQL usage, including database enumeration, table interaction, CRUD operations, filtering, sorting, operators, and functions.

These fundamentals are useful not only for database administration and development but also for cybersecurity and web application security.

A strong understanding of SQL makes it much easier to understand how web applications communicate with databases and provides an essential foundation for studying more advanced topics such as SQL injection and database security.



