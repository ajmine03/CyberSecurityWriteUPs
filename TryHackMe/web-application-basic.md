# Web Application Basics

## Platform

TryHackMe

## Overview

This lab introduces the fundamental concepts behind web applications and how browsers communicate with web servers.

The room focuses on understanding the different components that make up a web application, the structure of URLs, HTTP requests and responses, request methods, headers, status codes, and common security headers.

It is designed as an introductory lab for anyone beginning to learn web application security and penetration testing.

## Learning Objectives

By completing this lab, you will learn:

• The difference between front end and back end components

• The roles of HTML, CSS, and JavaScript

• How databases, web servers, infrastructure, and WAFs support web applications

• How URLs are structured

• How HTTP requests and responses work

• Common HTTP request methods

• HTTP request and response headers

• Common HTTP status codes

• Different formats used in HTTP request bodies

• The purpose of important HTTP security headers

## Topics Covered

### Front End

The front end is the part of a web application that users interact with through their browser.

The main technologies discussed are:

**HTML**

Defines the structure and content of a web page.

**CSS**

Controls the appearance, layout, colours, fonts, and visual presentation.

**JavaScript**

Adds logic, interaction, and dynamic behaviour to web pages.

### Back End

The back end contains the systems and services that operate behind the scenes.

Important components include:

**Database**

Stores, modifies, and retrieves application data.

**Web Server**

Handles HTTP requests and delivers resources or responses to clients.

**Infrastructure**

Includes networking, storage, application servers, and other systems required to operate the application.

**WAF**

A Web Application Firewall can inspect and filter potentially dangerous requests before they reach the application.

## URL Structure

A URL provides the address needed to locate a resource on the web.

The main components covered in this lab are:

**Scheme**

Defines the protocol being used, such as HTTP or HTTPS.

**User**

Can contain authentication information, although credentials in URLs are generally unsafe and uncommon.

**Host or Domain**

Identifies the website or server being accessed.

**Port**

Identifies the network service being accessed. Common web ports include 80 and 443.

**Path**

Identifies a particular resource on the server.

**Query String**

Contains parameters supplied to the server, usually after a `?`.

**Fragment**

Identifies a particular section of a resource and begins with `#`.

Understanding URL components is especially useful when analysing applications during security testing.

## HTTP Messages

HTTP communication consists primarily of two types of messages:

**HTTP Request**

Sent by a client to a web server.

**HTTP Response**

Sent by the server back to the client.

An HTTP message generally contains:

**Start Line**

Describes the request or response.

**Headers**

Provide additional information and instructions.

**Empty Line**

Separates the headers from the message body.

**Body**

Contains the data being transmitted when a body is present.

## HTTP Request Methods

The lab introduces several HTTP methods.

**GET**

Used to retrieve information.

**POST**

Used to send data to the server.

**PUT**

Used to replace or update a resource.

**PATCH**

Used to partially modify a resource.

**DELETE**

Used to remove a resource.

**HEAD**

Similar to GET but returns headers without the response body.

**OPTIONS**

Provides information about supported methods.

**TRACE**

Used for diagnostic purposes and is commonly disabled when unnecessary.

**CONNECT**

Used to establish a connection, commonly associated with proxy tunnelling.

Understanding request methods is important when analysing how an application handles different types of actions.

## HTTP Request Headers

Request headers provide additional information about a request.

Some important headers include:

**Host**

Identifies the destination host.

**User Agent**

Identifies information about the client or browser.

**Referer**

Indicates the page that led to the current request.

**Cookie**

Contains cookies previously stored by the browser.

**Content Type**

Describes the format of data contained in the request body.

## Request Bodies

HTTP requests that send data can contain a request body.

Common formats include:

**URL Encoded**

Uses key value pairs such as `key=value`.

**Multipart Form Data**

Useful for forms and file uploads.

**JSON**

Uses a structured key value format commonly used by APIs.

**XML**

Uses nested tags to represent structured data.

Understanding these formats is useful when inspecting requests and interacting with web APIs.

## HTTP Response Status Codes

HTTP responses use three digit status codes to describe the result of a request.

### 1xx

Informational responses.

### 2xx

Successful responses.

### 3xx

Redirection responses.

### 4xx

Client side errors.

### 5xx

Server side errors.

Some commonly encountered examples include:

`200 OK`

The request was successful.

`301 Moved Permanently`

The requested resource has permanently moved.

`404 Not Found`

The requested resource could not be found.

`500 Internal Server Error`

The server encountered an unexpected problem.

## Response Headers

Response headers provide information about the server's response and instructions for the client.

Important examples include:

**Date**

Indicates when the response was generated.

**Content Type**

Describes the type of content being returned.

**Server**

Can identify the software handling the request.

**Set Cookie**

Allows the server to set cookies in the client.

**Cache Control**

Controls how responses may be cached.

**Location**

Indicates another location when redirecting a client.

## Security Headers

The lab introduces several HTTP security headers that help reduce common web application risks.

### Content Security Policy

CSP controls which sources a browser is allowed to load for resources such as scripts and styles.

It can provide an additional layer of protection against attacks such as Cross Site Scripting.

### Strict Transport Security

HSTS instructs browsers to use HTTPS when communicating with a website.

Important directives include:

`max age`

`includeSubDomains`

`preload`

### X Content Type Options

The `nosniff` directive prevents browsers from attempting to guess the MIME type of a resource.

### Referrer Policy

Controls how much referrer information is shared when navigating between resources.

Common policies include:

`no-referrer`

`same-origin`

`strict-origin`

`strict-origin-when-cross-origin`

## Practical Component

The lab includes an interactive static website that acts as an HTTP request and response emulator.

This allows you to practise identifying:

• HTTP methods

• URL paths

• Request headers

• Request bodies

• Response status codes

• Response headers

• Security headers

The practical section is designed to reinforce the concepts introduced throughout the room.

## Security Relevance

Understanding HTTP fundamentals is essential for web application security.

During security testing, requests and responses can reveal how an application handles:

• Authentication

• Authorisation

• User input

• Cookies

• Sessions

• Redirects

• File uploads

• API communication

• Error handling

• Security controls

A strong understanding of HTTP makes it much easier to understand and investigate vulnerabilities in later web security labs.

## Key Takeaways

By the end of this lab, you should be comfortable explaining:

• What a web application consists of

• The difference between front end and back end

• The purpose of HTML, CSS, and JavaScript

• The main components of a URL

• The structure of HTTP requests and responses

• The purpose of common HTTP methods

• The meaning of major HTTP status code categories

• The role of request and response headers

• Common request body formats

• The purpose of important HTTP security headers

## Next Steps

After completing this room, continue practising HTTP traffic analysis using browser developer tools and interception proxies such as Burp Suite.

The concepts learned here provide the foundation for more advanced web security topics such as authentication testing, access control, injection vulnerabilities, XSS, SSRF, file upload vulnerabilities, and API security.
