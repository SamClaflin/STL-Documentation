# Deep Diver Implementation
## Sam Claflin
### May 4, 2021
<br>

## Parsing
Each of the sub VIs responsible for parsing data of various file types work in fundamentally the same way:
1. The entirety of the given input file is read in binary format and promptly closed.
2. The binary data obtained from the previous step is passed into a primary `while` loop. 
3. The `Match Pattern` vi is immediately used to search for any occurrence of a particular stream of bytes within the binary data (this stream of bytes represents the "magic number" or "file signature" that corresponds with that file type; a comprehensive list of file signatures can be found [here](https://en.wikipedia.org/wiki/List_of_file_signatures)). If no occurrence of these bytes is found, the main loop is exited.
4. If found, the match substring (the file signature) and everything that occurs after it is passed into a second `Match Pattern` vi (this searches for the particular stream of bytes that corresponds with the end of the given input file type).
5. The entirety of the substring prior to the occurrence of the final byte stream (the file signature and file data) are then concatenated with the EOF signature.
6. The `Current-Timestamp` sub VI is used to generate a name for the output file that will soon be created; the output of this sub VI is simply concatenated with the file extension that correlates with the current file type.
7. The parsed binary data is both written to a file and stored in a string array that's continuously passed through a shift register; the purpose of this array is to allow for users to easily cycle through a variety of parsed data instances on the main application's front panel in the future.
8. At the beginning of the following loop iteration, the `offset past match` output from the *first* `Match Pattern` vi (which is pushed into a shift register) is obtained from the shift register and used as an input to the very same `Match Pattern` vi. This allows for the same input byte stream to be searched without copying the data starting from immediately after the initial file signature match. This way, an arbitrary number of the given input file type could be efficiently extracted from any input file. If the `offset past match` value is `-1` (returned when no match is found), the main loop is exited. 
<br>

## ZIP/DOCX
While all the parsing modules are quite similar aside from the file signatures that are being searched for, there's an essential difference with ZIP and DOCX files that serves as one of the primary motivators for splitting all these modules into sub VIs in the first place. Unlike PNG and JPG files, ZIP and DOCX files (which have the same file signature), do **not** have a single, searchable EOF signature. Instead, they have a searchable EOF signature that's **exactly 18 bytes away** from the true end of the file. Therefore, the EOF signature is searched for, and the 18 bytes that immediately follow it in addition to the signature itself are appended onto the end of the file data prior to being saved as an actual ZIP or DOCX.
<br>

## Context Search
As mentioned in the `Architecture` documentation file, `Context-Search.vi` is located in the `src` directory and is not currently being used by the main application, but contains all of the code required to parse a given substring and its surrounding context of a desired length from any input string. The implementation for this works in the following way:
1. Read from a given input text file and store the data in a string
2. Read from a predetermined delimited spreadsheet (text file in which each word is separated by a carriage return) and store each word in an array
3. Determine which of these words the user wants to search for
4. Pass the original text data string and the selected word string into the main `while` loop of the application
5. During each iteration of the while loop, begin by shifting an integer out of the shift register that represents the offset at which to begin searching the original string for the substring (initialized to 0) 
6. Using the `Match Pattern` function, search text data for an exact match of the desired word
7. If the word is not found (indicated by the `offset after match` field returning `-1`), exit the main loop
8. Otherwise, use a multitude of additional `Match Pattern` functions with the given desired context length as the `offset` argument in order to retrieve the context both before and after the match
9. After both contexts are retrieved, concatenate the context before, the match, and the context after into a single string
10. Push the concatenated context string into the context array
11. Repeat 