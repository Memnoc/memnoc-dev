---
title: "Let's run our first C program"
date: 2026-10-06
description: "Lesson 1 of the C course: a little history, Hello World, compilation, assembly, headers, and function prototypes."
tldr: "Let's learn the C programming language without AI doing all the work for us."
sourceCode: "https://github.com/Memnoc/C_course/tree/main/lesson_1"
disclaimer: "This post was not generated using an LLM."
tags: [learning, c_language, no_ai]
course:
  name: C course
  lesson: 1
image: "../../assets/blog/learning-c/programming-in-c-banner.png"
draft: false
---

## A little history of C

![Programming in C course banner: syntax, patterns, best practices and manual code writing, no AI.](../../assets/blog/learning-c/programming-in-c-banner.png)

The C programming language was developed between 1969 and 1973, with its most significant development in 1972. The first K&R book appeared in 1978. Distinguish editions of the book from revisions of the language:
When _The C Programming Language_, first edition, debuted in 1978, it was, without a doubt, something quite revolutionary. Assembly, Pascal, Fortran, and B were among the languages available at the time, and C had a lot of niceties and innovative ideas in comparison. I mention this because I think it is interesting to consider the perspective of the people who first adopted the language.

Despite the wild success of the first edition, the language had many features still in progress, unrealized ideas, and mechanisms that were not well defined. Both users and implementers were itching to define them. It was this need for clarity and precision that led to the birth of ANSI (American National Standards Institute) C as the second edition of the language.

ANSI C became a standard in 1989, [Dennis Ritchie's history of C](https://cm-bell-labs.github.io/who/dmr/chist.html), [GCC's standards documentation](https://gcc.gnu.org/onlinedocs/gcc/Standards.html).

It is important to mention that we are following _The C Programming Language_, ANSI C edition, in this course.

Passionate C programmers like to make this distinction clear: in programming circles, the first book is considered something of a programming bible, while the ANSI revision is "the one you should actually study from." At least, that has been my experience.

The book is also famous for being incredibly small, not particularly easy to digest or follow, and, of course, very opinionated about imperative programming languages such as C. I frankly understand that, and I must say I do not find it annoying in the slightest.

So, what's new in this second edition? Many things, most prominently a new way to define functions and a standard library for I/O operations, memory management, string manipulation, and much more.

C is an incredibly small language, meaning it does not have a lot of features. Using it well, however, takes considerable effort, discipline, common sense, and practice. As the authors themselves put it, it "wears well as one's experience with it grows."

C is considered a general-purpose, low-level systems programming language. Both at the time the book was written and especially nowadays, it is the language you need to master if you want to develop compilers or operating systems. It is no coincidence that C was designed for and in UNIX. To this day, an enormous amount of UNIX is still written in C, although Rust is gaining ground there, and very quickly too, I might add.

Lots of software the world relies on is written in C: the Linux kernel, the C compiler (and many others), graphics libraries, sound libraries, and video drivers. Seriously, the world would stop if, by some magic spell, we could wipe out all the C code.

Just for fun, I would like to rage-bait someone here by mentioning some of the things you most commonly hear about C on Reddit or in other programming circles. In no particular order:

### C is not a safe language

True, with a big caveat. Since C does not have a garbage collector, does not provide automatic memory management (unchecked array access and incorrect pointer or allocation lifetimes.), and is statically typed, writing safe, correct, and bulletproof C code is quite hard.
Despite that, so many amazing things, including:

- powering the software systems of the [Mars Exploration Rovers](https://robotics.jpl.nasa.gov/media/documents/casah_aero_2018b.pdf)
- running literally the entire digital world for decades
- about 35 years of Linux kernels written in a very sophisticated and customized C (it also includes assembly and now supports Rust [Linux Foundation history](https://www.linuxfoundation.org/blog/blog/anniversary-of-first-linux-kernel-release-a-look-at-collaborative-value), [kernel programming-language documentation](https://docs.kernel.org/next/process/programming-language.html).

, do offer a compelling counterargument: if the programmer is competent, C becomes an enormously versatile tool that allows you to do pretty much anything you want, safely. That is, if you know how. This is also why learning to write good C code is a pretty safe bet for becoming a really good programmer.

### C is super fast

Super true! Because C code compiles directly to machine code, there is no latency or computationally heavy operation that might slow down your program. Assembly is faster than C, and below that is practically a binary world. You can see why, compared with interpreted languages such as Python or TypeScript (JavaScript), C is so much more performant.

### C is easy to learn and hard to use

False and true, at least in my opinion. Yes, you can pick up the syntax in a few hours. It is very simple and readable, and there are basically a dozen things to memorize. But it is not easy to fully understand what is going on in those few lines. Incidentally, this is the very reason it is hard to use. You will see what I mean when we dissect a simple Hello World program.

### C must be abandoned; let's rewrite everything in Rust

This is quite literally a holy war on both sides. Programmers apparently like those. This programmer finds them entertaining but ultimately silly. Yes, I love Rust and I write Rust. And yes, if I start a new project, I am more likely to consider Rust than C. It is pretty logical, really: a language that is safer by default, with similar performance, should be a first choice.

Does that mean rewriting all the software ever written in C is justified? Hell no! Some of the best programmers who have ever walked the Earth wrote their masterpieces in C, and those programs have stood the test of time from a security perspective. Writing a new implementation is a Herculean effort that would undermine the very principle the rewrite claims to uphold: security. In other words, in my humble opinion, leave C alone and welcome Rust as a new default where it is sensible and beneficial.

## An overview of the C programming language (Chapter 1)

As I said in the introduction, we are following the structure of _The C Programming Language_, ANSI C edition, by K&R.

The first chapter is an introductory, hands-on chapter that deliberately avoids dense explanations. It aims to get experienced and novice programmers alike started with the language and its syntax. We shall respect that, with a caveat: I am going to expand on the Hello World example at the centre of the chapter and show how even a few lines of C code warrant pages of discussion.

It won't be a waste of time. Reflecting on the fundamentals is one of the best things you can do to master anything. So let's do that!

### Hello World

**Disclaimer:** I am assuming that, at this point, you know how to access your system's console, use an IDE, install and use a C compiler, and ultimately run a C program. This is the kind of thing you want to learn. So, even if you delegate this work to an LLM, please take some time to understand how to perform these operations yourself. It is not much trouble, and with repetition, it will become second nature.

As tradition dictates, we start with the introductory Hello World program: a very simple program that prints "Hello, World" to the console.

### The code

```c
#include <stdio.h>

int main(void) {
  printf("Hello, World!");
  return 0;
}
```

C is a compiled language. This means the compiler must compile your `hello_world.c` file (usually called `main`) and turn it into an executable, often—but not necessarily—with the same name:

```sh
gcc hello_world.c -o hello_world
```

What you obtain is a file called `hello_world`.
More on [GCC output options](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html).

You can run it like this:

```sh
./hello_world
```

As the book puts it, "if you haven't botched anything or missed a semicolon," it will spit out "Hello, World!"

It is worth mentioning that the GCC compiler we just used was created by Richard Stallman, perhaps the most prominent figure in open source and the father of the OSS movement that gave life to Linux as we know it.

**Fun fact**: if you now compile your `.c` file with the `-S` flag:

```sh
gcc -S hello_world.c
```

a `hello_world.s` file containing the assembly translation of your C code is automatically generated.
You might be asking yourself: why are we talking about this?.
Well, you will find that, in this course, we are not content to run things and simply accept that they work. We like to know why certain things happen and work the way they do. Understanding the level underneath your code and learning how to work with it is therefore useful.

Case in point: you can (and eventually should) invoke the compiler with different optimization levels. When you call your compiler with a particular flag, it emits a particular type of code with a particular level of optimization. The difference in performance is often dramatic, so you will want to learn how to perform these operations and spend some time understanding their ins and outs.

More on flags and the compiler itself in future lesson. For now, just know there are a lot of commands the compiler accepts, and expert C programmers make good use of them to generate faster and safer C code.

### Headers and preprocessor directives

You have probably noticed this line at the beginning of the C file:

```c
#include <stdio.h>
```

You will hear this referred to as a _preprocessor directive_ while the `stdio.h` part is commonly referred as _header_, hence the extension `.h`. More specifically:

In simple terms—because this gets complicated very quickly: before working on your code, the compiler runs an auxiliary program to process its directives. This is why it is called a "preprocessor": it runs before compilation takes place.

All of this is good, but why do we need it?
We mentioned earlier that the new version of C includes a standard library. `stdio.h` is a part of that much bigger standard library. Think of it like a phone book, if you are old enough to remember what that is. In it, we list all the code that is not part of C as a language but is very useful, if not absolutely fundamental, for writing C programs.

In our case, we need that library to use this function:

```c
printf("Hello, World!");
```

That function is not part of C as a language, but it is provided as a utility because it is handy to use.

**Fun fact**: try deleting the directive without touching any other part of the code. See how loudly the compiler yells at you and what it says! :)

Furthermore, we could define `printf` in the file and omit the directive entirely. If we type `man printf`, we can access the function's official documentation. We can then copy its prototype for as shown, and include it in `hello_world.c` in place of the directive:

```c
int printf(const char* restrict format, ...);
```

Everything compiles just the same. This is no surprise, as in this way the compiler no longer needs the directive to know what `printf()` is.

Defining a function in the way we have defined `printf` here is called _function prototyping_, another important feature of C that we will explore later when we discuss functions.

To sum up, the compiler needs to know everything about your code before it attempts to translate it into assembly. To do this, it may employ helpers to decode the parts that are not intrinsically part of C as a programming language. Standard library headers, other library headers, and, generally speaking, external parts of one's code are examples.

The duality of C is a fundamental part of the language. Generally speaking, you will find source files containing implementations and headers commonly sharing declarations, types, and macros.
More on this topic: [GCC's explanation of headers](https://gcc.gnu.org/onlinedocs/cpp/Header-Files.html).

> [!EXERCISE] 1 - Make Hello World your own
>
> Put this lesson into practice before moving on:
>
> 1. Without copying the example, write a `hello_world.c` program that prints `Hello, World!` followed by a newline.
> 2. Compile it with `gcc hello_world.c -o hello_world`, then run `./hello_world` and check the output.
> 3. Change the greeting to include your name. Compile and run the program again to see the change.
> 4. Run `gcc -S hello_world.c` and open `hello_world.s`. Find your greeting in the assembly output and explain what the `-S` flag changed about the compiler's output.
> 5. Add a `\c` character to `printf` and try to compile.
>
> _Exercise prompt drafted with Codex for author review._

### What did we learn?

We have covered some ground in this first lesson:

- We talked about the history of C.
- We moved on to writing our first C code: a program that prints "Hello, World!" to the console.
- We talked about compilers, particularly the GNU C Compiler (GCC), which we will use throughout this course.
- We looked at some assembly code, how to access it, and how it changes when we change compilation flags:
  - `-o` gives the compiled executable a name.
  - `-S` outputs the assembly code for our `.c` file.
  - `-S -O2` drastically optimizes our compiled code.
- We talked about functions:
  - Signatures.
  - Prototypes.
- We talked about preprocessor directives:
  - Header files.
  - Libraries.

I am sure I have left some gaps in my explanations, so spend some time going over the material and asking questions. Feeding this section to an LLM and asking it to explain the parts you did not understand is an awesome way to make sure you are following along. If you know someone with experience in C, engage with them and discuss these topics. You may get an even better overview!

See you at the next one!

---

> [!SOURCES]
>
> **The book**
>
> - Kernighan, B. W. and Ritchie, D. M., _The C Programming Language_, 2nd edition (ANSI C), Prentice Hall, 1988. [Publisher's page](https://www.pearson.com/en-us/subject-catalog/p/c-programming-language/P200000003426) and [Kernighan's companion page](https://www.cs.princeton.edu/~bwk/cbook.html).
>
> **History of C and ANSI C**
>
> - Dennis Ritchie, [_The Development of the C Language_](https://cm-bell-labs.github.io/who/dmr/chist.html), the primary account of how and why C came to be, including the road to the ANSI standard.
> - ISO/IEC JTC1/SC22/WG14, [the C standards committee](https://www.open-std.org/jtc1/sc22/wg14/), home of the official drafts, including the C89/C90 "ANSI C" lineage.
> - GCC documentation, [Language Standards Supported by GCC](https://gcc.gnu.org/onlinedocs/gcc/Standards.html), a concise list of the C revisions (C89, C99, C11, C17, C23) and how to select them.
>
> **C in the real world**
>
> - NASA JPL, [_Mars Exploration Rover Surface Operations_](https://robotics.jpl.nasa.gov/media/documents/casah_aero_2018b.pdf), on the rover flight software.
> - Linux Foundation, [Anniversary of the first Linux kernel release](https://www.linuxfoundation.org/blog/blog/anniversary-of-first-linux-kernel-release-a-look-at-collaborative-value).
> - Linux kernel documentation, [Programming Language](https://docs.kernel.org/next/process/programming-language.html), which spells out the C dialect the kernel uses and its Rust support.
> - [Redis](https://redis.io/) and its [source code on GitHub](https://github.com/redis/redis), a production-grade in-memory database written in C and a great example of real-world C to read.
>
> **GCC and compilation**
>
> - GNU Project, [A Brief History of GCC](https://gcc.gnu.org/wiki/History), on Richard Stallman and the origins of the compiler.
> - GCC documentation, [Options Controlling the Kind of Output](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html), where `-o`, `-S`, `-c` and `-E` are defined.
> - GCC documentation, [Options That Control Optimization](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html), for `-O0` through `-O3`, `-Os` and friends.
> - GCC documentation, [An Introduction to GCC](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html), the top of the "Invoking GCC" chapter for everything else.
>
> **Headers, the preprocessor and the standard library**
>
> - GNU C Preprocessor manual, [Header Files](https://gcc.gnu.org/onlinedocs/cpp/Header-Files.html).
> - GNU C Preprocessor manual, [Overview](https://gcc.gnu.org/onlinedocs/cpp/Overview.html), on what the preprocessor does before compilation.
> - GNU C Library manual, [Introduction](https://sourceware.org/glibc/manual/latest/html_node/Introduction.html), for the standard library that `stdio.h` belongs to.
> - Linux man-pages, [printf(3)](https://man7.org/linux/man-pages/man3/printf.3.html), the prototype we copied with `man printf`.
> - cppreference, [C standard library headers](https://en.cppreference.com/w/c/header), a compact map of every header in the standard library.
>
> **Video**
>
> - Salvatore Sanfilippo (antirez, creator of Redis), [_Impariamo il C: lezione 1_](https://www.youtube.com/watch?v=HjXBXBgfKyk), the first lesson of his C course on YouTube (in Italian).
