---
title: "Practice with C"
date: 2026-10-07
description: "Exercise and solution banner fixture."
tldr: "Read the assignment, try it yourself, then reveal the answer."
disclaimer: "These examples are browser test fixtures."
tags: [learning]
---

> [!BONUS] Explore your compiler
>
> Print **INT_MAX** and compare it with the [integer limits](https://example.com/limits).
>
> ```c
> #include <limits.h>
> printf("%d\n", INT_MAX);
> ```
>
> This optional exploration stays visible.

> [!EXERCISE] Exercise 1 - Print a greeting
>
> Write a program that prints **Hello, World!**.
>
> 1. Compile your program.
> 2. Run it in your terminal.
>
> Consult the [C reference](https://example.com/c).

> [!SOLUTION] Exercise 1 - Print a greeting
>
> One possible answer:
>
> ```c
> #include <stdio.h>
> int main(void) {
>     puts("Hello, World!");
>     return 0;
> }
> ```
>
> The following deliberately long line should scroll inside the code block:
>
> ```text
> aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
> ```
>
> [Read the explanation](https://example.com/explanation).

> [!EXERCISE]
>
> Change the greeting to your name.

> [!SOLUTION]
>
> Replace the string with your name.
>
> ![An illustration inside the answer](../../assets/blog/brain-gym/brain-gym-banner.png)

> An ordinary quotation stays a quotation.

> [!NOTE]
>
> An unrecognized marker stays a quotation too.

```text
> [!SOLUTION] This is a literal example, not a banner.
```
