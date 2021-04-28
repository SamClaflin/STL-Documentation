# Deep Diver Architecture
## Sam Claflin
### April 23, 2021
<br>

## Language
To maintain consistency with the various pre-existing codebases at STL, the Directory Diver is written entirely in LabVIEW. As you'll notice, a few Python files are present, but these exist only to generate dummy data to feed to the application for testing purposes.
<br>

## Project Structure
This project contains the equivalent of a "main" file: `Deep-Diver.vi`. Upon executing this file, the main GUI associated with the application will be opened. Since the very nature of this project involves performing several similar tasks (searching for files of different types), the bulk of the low-level, backend code is split into several sub VIs, which are all conveniently located in the `src/subvi` directory. All aforementioned Python scripts for data generation are located in the `src/scripts` directory.
<br>

## Sub VIs
There are currently 4 primary sub VIs that are responsible for the majority of the project's computational tasks: `Parse-PNG (SubVI).vi`, `Parse-JPG (SubVI).vi`, `Parse-ZIP-DOCX (SubVI).vi`, and `Current-Timestamp (SubVI).vi`. Each sub VI prefixed with `Parse` is responsible for identifying any number of files of a given type within a single input file of an arbitrary type. For example, `Parse-PNG (SubVI).vi` is solely responsible for finding any number of PNGs embedded in any given input file and use the data (if present) to construct actual PNGs that can be viewed by the user. A good way to test any of these modules is to simply pass in an input file of the given type; an identical file of the same type should be automatically produced upon running the program. Additionally, the `Current-Timestamp (SubVI).vi` is a dependency of all three parsing modules; this module is simply responsible for producing a timestamp-based filename given some input file extension. Details regarding the implementations of these sub VIs can be found in `Architecture.md`
<br>

## Output
Currently, since all program output (in the form of files) is produced by the various `Parse` sub VIs, the location of the output is defaulted to the `src/subvi` directory. By default, the Diver application will search for *all* filetypes that it's currently capable of searching for (PNG, JPG, ZIP, DOCX). To alter this, the various switches on the left side of the main application's front panel can be toggled on/off accordingly. Aside from the auto-generated files, the only other program output is the number of each filetype found, which is displayed in the bottom left corner of the front panel. 
<br>

## Context Search 
The final component of the Diver application in its current state is the `Context-Search.vi` file located in the `src` directory. This file is currently not associated with the main application file in any way and originally existed so that I could test out various methods are parsing binary input files. While not currently in use, it contains all the logic required to search for a particular substring within a given input string, return the number of occurrences of this substring, and return *context* of a desired length (in characters) both before and after each occurrence of the substring if found. Since this functionality is desired within the main application, I figured that the code from `Context-Search.vi` could easily be reused in the main application in order to quickly and easily implement dynamic substring/context searching.