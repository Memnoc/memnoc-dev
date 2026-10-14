# Codex review notes - C-course Lessons 1 and 2

Prepared by Codex for author review on 2026-10-14. These are review findings and suggested changes, not additions to the author's lesson prose. Course source files were not edited.

## Revision and scope

GitHub `main` and the clean local checkout both resolved to `c4d58526967268e2d66b9a7feec828a70a52fab3`. Reviewed all seven `.c` files under `lesson_1` and `lesson_2`, including the exercise files.

## Executed checks

Built each file independently with GCC and Clang, using:

```sh
cc -std=c17 -Wall -Wextra -Wpedantic -Wformat=2 -Wshadow -Wstrict-prototypes -Werror source.c -o /tmp/program
```

Six nonempty programs compiled without diagnostics and exited successfully with both compilers. Their GCC and Clang output matched. Checks confirmed:

- Lesson 1 prints `Hello, World!` with a newline.
- Fahrenheit converters produce 16 rows, from 0 through 300 in steps of 20.
- The integer version gives -17 at 0 F and 148 at 300 F.
- Formatted floating-point versions give -17.8 at 0 F and 148.9 at 300 F.
- Reverse converters produce eight rows, from 0 through 140 C in steps of 20; 0 C gives 32 F and 100 C gives 212 F.
- Each printed conversion was checked against the corresponding mathematical formula, allowing for its displayed precision or integer truncation.

The three complete programs in the article were also compiled and run. All three displayed output tables were compared exactly with executed output, including the variant that adds literal F/C suffixes. The article explains that the committed V2 currently omits those suffixes.

## Findings for author review

| Finding | Location | Suggested action |
| --- | --- | --- |
| Empty exercise file cannot build as a standalone program. | [exercise_2.c](https://github.com/Memnoc/C_course/blob/c4d58526967268e2d66b9a7feec828a70a52fab3/lesson_2/exercises/exercise_2.c) | Implement it, or identify it as an unfinished placeholder. The article now directs readers to the existing reverse converter instead. |
| First commented output row says `03000`, but execution prints `0`. | [f_to_c_V1.c](https://github.com/Memnoc/C_course/blob/c4d58526967268e2d66b9a7feec828a70a52fab3/lesson_2/f_to_c_V1.c) | Replace the malformed row with actual output. The article's copy has been corrected. |
| Commented output still shows six decimal places, although current format strings print zero/one decimal places. | [f_to_c_V2.c](https://github.com/Memnoc/C_course/blob/c4d58526967268e2d66b9a7feec828a70a52fab3/lesson_2/f_to_c_V2.c), [exercise_1_V1.c](https://github.com/Memnoc/C_course/blob/c4d58526967268e2d66b9a7feec828a70a52fab3/lesson_2/exercises/exercise_1_V1.c) | Refresh those output comments from execution. The computations themselves work. |
| Optional `-Wconversion` reports narrowing from double to float in the reverse-conversion expression. | [c_to_f.c, line 19](https://github.com/Memnoc/C_course/blob/c4d58526967268e2d66b9a7feec828a70a52fab3/lesson_2/c_to_f.c#L19), [exercise_1_V2.c, line 22](https://github.com/Memnoc/C_course/blob/c4d58526967268e2d66b9a7feec828a70a52fab3/lesson_2/exercises/exercise_1_V2.c#L22) | If the intent is float arithmetic throughout, use `celsius * (9.0f / 5.0f) + 32.0f`. This is a warning about possible loss of precision, not a demonstrated wrong result for the tested inputs. |
| Displayed headers misspell Fahrenheit as `Farhnehit`. | Both `exercise_1` versions | Correct the spelling and check the ASCII alignment afterward. |
| An upper bound of 148 with a step of 20 ends at 140. | Both reverse converters | This is consistent with the loop. If you intend to print 148 as well, change the iteration scheme or print that endpoint separately. |

No functional defect was found in `lesson_1/hello_world.c`. Its explicit `return 0;` and `int main(void)` are appropriate. No incorrect computed conversion was observed in the five complete Lesson 2 programs at their configured inputs.

## Limits and references

The final publication scan rechecked the complete examples in both website lessons after the author's edits. It found two `return 0;` statements outside `main` in Lesson 2; these were moved inside their functions without changing the surrounding prose. All five complete article programs then compiled and ran with the strict flags above on GCC and Clang. All four Lesson 2 output blocks, including the limits-inspection example and the formatted converter variant, matched execution. Course repository files remain unchanged.

This review covers the current fixed tables, not hypothetical user input, every C implementation, or arbitrary integer ranges. Floating-point output is implementation-dependent. The empty placeholder is reported separately from the six runnable programs.

The website typecheck and production build passed after the article edits. The built Lesson 2 contains both exercise banners and the compact sources block. Independent factual/specification and standards/grammar reviews reported no actionable findings.

- [GCC warning options](https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html) - `-Werror`, format checks, and conversion warnings.
- [GNU C Library output conversion syntax](https://sourceware.org/glibc/manual/latest/html_node/Output-Conversion-Syntax.html) - widths and precision affect display, not the stored result.
- [Lesson 2 fact-check notes](2026-10-14-c-course-lesson-2-fact-check.md) - standard sections and primary sources behind the article corrections.
