# JavaScript Essentials

## Platform

TryHackMe

## Overview

**JavaScript Essentials** is an introductory TryHackMe room focused on understanding the fundamentals of JavaScript from both a web development and cybersecurity perspective.

The room starts with basic JavaScript concepts and gradually moves into how JavaScript interacts with HTML, how browser based JavaScript can be inspected, and how poorly implemented JavaScript functionality can introduce security issues.

It also introduces techniques for analysing minified and obfuscated JavaScript code and finishes with practical security best practices.

## Learning Objectives

By completing this room, you will learn:

• JavaScript fundamentals

• Variables and data types

• Functions and loops

• JavaScript control flow

• The request response cycle

• How JavaScript interacts with HTML

• Internal and external JavaScript

• Browser developer tools

• JavaScript dialogue functions

• Client side control flow

• JavaScript source code analysis

• Minification and obfuscation

• JavaScript security best practices

## Topics Covered

### JavaScript Fundamentals

The room introduces the basic building blocks of JavaScript.

Important concepts include:

**Variables**

Used to store and reference values.

JavaScript provides different ways of declaring variables, including `var`, `let`, and `const`.

**Data Types**

JavaScript supports different types of values such as:

`string`

`number`

`boolean`

`null`

`undefined`

`object`

**Functions**

Functions group reusable pieces of code together so that a particular task can be performed when needed.

**Loops**

Loops allow a block of code to execute repeatedly while a particular condition is satisfied.

Common examples include:

`for`

`while`

`do...while`

## JavaScript in the Browser

JavaScript is commonly executed within the browser and can interact with HTML elements.

The room demonstrates using the browser's developer tools and JavaScript console to execute and experiment with JavaScript code.

This is an important skill for web security because JavaScript running in a browser is generally accessible to the client and can therefore be inspected.

## Integrating JavaScript with HTML

JavaScript can be integrated into an HTML document in different ways.

### Internal JavaScript

JavaScript can be written directly inside an HTML document using the `<script>` element.

This approach can be useful for small examples and learning how JavaScript interacts with HTML.

### External JavaScript

JavaScript can also be stored in a separate `.js` file and loaded into an HTML document.

This keeps HTML and JavaScript separate and generally makes larger projects easier to maintain.

The room also demonstrates how to identify whether a webpage uses internal or external JavaScript by examining its source.

## Browser Developer Tools

Developer tools are an important part of web application analysis.

The room introduces the browser console and source inspection features to help understand JavaScript behaviour.

These tools can be useful during security testing for examining:

• JavaScript source code

• Client side logic

• Loaded scripts

• HTML elements

• Application behaviour

## JavaScript Dialogue Functions

JavaScript provides several built in functions for interacting with users.

### Alert

`alert()` displays a message to the user.

### Prompt

`prompt()` asks the user to provide input and returns the entered value.

### Confirm

`confirm()` asks the user to confirm an action and returns a Boolean result depending on the user's choice.

The room also demonstrates why these functions can become problematic when JavaScript functionality is implemented insecurely.

## Control Flow

Control flow determines which parts of a program are executed and when.

The room introduces structures such as:

`if`

`else`

`switch`

and different types of loops.

Understanding control flow is particularly important when analysing client side authentication or validation logic.

Client side logic should not be treated as a trusted security boundary because users can inspect and manipulate code running in their own browser.

## JavaScript Source Code Analysis

One important cybersecurity skill covered by the room is analysing JavaScript that is delivered to the browser.

JavaScript files can sometimes contain useful information about:

• Application functionality

• Client side validation

• API endpoints

• Application logic

• Variables

• Functions

• Potentially exposed sensitive information

This makes JavaScript analysis a useful part of web application reconnaissance.

## Minification

Minification reduces the size of JavaScript files by removing unnecessary characters such as:

• Whitespace

• Line breaks

• Comments

and sometimes shortening identifiers.

The main goal is usually to reduce file size and improve loading performance.

Minified JavaScript may be more difficult for humans to read, but it remains executable by the browser.

## Obfuscation

Obfuscation makes JavaScript more difficult for humans to understand.

It may involve:

• Renaming variables

• Renaming functions

• Transforming expressions

• Adding unnecessary code

• Changing the structure of the original code

Obfuscation can make analysis harder, but it should not be considered a reliable way of hiding secrets or preventing reverse engineering.

## Deobfuscation

The room introduces the concept of reversing obfuscated JavaScript into a more understandable form.

This is particularly useful during security assessments because JavaScript that initially looks unreadable may still contain important application logic.

Security testers may need to analyse and reconstruct this logic to understand how an application works.

## Security Considerations

The room highlights several important JavaScript security principles.

### Do Not Rely Only on Client Side Validation

Client side validation can improve user experience, but it should not be the only validation mechanism.

Users can modify JavaScript or bypass browser based checks.

Important security validation should therefore also be performed on the server.

### Be Careful With Third Party Libraries

External JavaScript libraries should come from trusted sources.

Including untrusted or compromised JavaScript can introduce security risks to the application.

### Do Not Hardcode Secrets

Sensitive information such as:

• Passwords

• API keys

• Access tokens

• Private credentials

should not be placed inside client side JavaScript.

Anything delivered to the browser should generally be considered accessible to the user.

### Minification and Obfuscation

Minification and obfuscation can make JavaScript harder to understand and can reduce file size, but they should not be treated as a security mechanism for protecting secrets.

Sensitive information should never depend on obfuscation for protection.

## Practical Skills

After completing this room, you should have experience with:

• Reading basic JavaScript

• Creating simple JavaScript programs

• Using the browser console

• Connecting JavaScript with HTML

• Identifying internal and external scripts

• Inspecting JavaScript source code

• Understanding client side logic

• Recognising minified JavaScript

• Understanding obfuscated JavaScript

• Thinking about JavaScript from a security perspective

## Why This Room Matters for Cybersecurity

JavaScript is heavily used in modern web applications.

During web application security testing, JavaScript can provide valuable information about how an application works on the client side.

Understanding JavaScript makes it easier to investigate:

• Client side validation

• Authentication logic

• Application behaviour

• API interactions

• Hidden functionality

• Exposed information

• Potential security weaknesses

This makes JavaScript knowledge an important foundation for progressing into more advanced web application security topics.

## Key Takeaways

The main concepts from this room are:

**JavaScript is client accessible**

Code delivered to the browser can be inspected by the user.

**Client side controls are not trusted**

Security decisions should not rely entirely on JavaScript running in the browser.

**Source code can reveal application logic**

JavaScript files may contain useful information about how a web application works.

**Obfuscation is not encryption**

Obfuscated code can still be analysed and potentially reconstructed.

**Secrets should not be exposed**

Credentials, API keys, and other sensitive information should not be placed in client side JavaScript.

**Developer tools are valuable**

Browser developer tools provide useful capabilities for understanding and analysing web applications.

## Final Summary

The JavaScript Essentials room provides a foundation for understanding JavaScript in the context of web applications and cybersecurity.

It begins with fundamental programming concepts and progresses toward browser based JavaScript analysis, HTML integration, dialogue functions, control flow, source inspection, minification, obfuscation, and secure development practices.

The knowledge gained from this room provides a useful foundation for later web security topics and penetration testing labs.
