csv-parser
==========

A simple CSV Parser library written in C++

To know more about CSV - http://en.wikipedia.org/wiki/Comma-separated_values

Test cases borrowed from the same wiki

To know more about the RFC that governs CSV - http://tools.ietf.org/html/rfc4180

Usage:

The core files of this repository are

a. csv_parser.hpp

b. csv_parser.cpp

This library exposes two public methods both with the same name - "parse_line" albeit different signatures.

a. The first, accepts an input line and a vector of strings which contains the parsed contents of the input line

b. The second accepts an input line, a vector which contains the header names and a map which which contains as key a value from the header and the corresponding field obtained by parsing the input line
Both these methods return a Boolean value that indicates whether the parsing was a success or a failure

A test file along with a sample CSV file is also included to test the library

The contents for the test being

a. test.cpp

b. test_case.csv

For more details on how to create the object of the class contained in csv_parser refer the file test.cpp

Compilation:

    g++ -o csv_parser csv_parser.cpp test.cpp

Features:
Handles every case except the embedded line quotes being present in the input line
For instance, lines like these are not supported

    1997,Ford,E350,"Go get one now
    they are going fast"

Sample Output

    A sample run for the test cases contained in test_case.csv is as follows
    CSV line - 1997,Ford,E350
    Field [0] - 1997
    Field [1] - Ford
    Field [2] - E350
    CSV line - "1997","Ford","E350"
    Field [0] - 1997
    Field [1] - Ford
    Field [2] - E350
    CSV line - 1997,Ford,E350,"Super, luxurious truck"
    Field [0] - 1997
    Field [1] - Ford
    Field [2] - E350
    Field [3] - Super, luxurious truck
    CSV line - 1997,Ford,E350,"Super, ""luxurious"" truck"
    Field [0] - 1997
    Field [1] - Ford
    Field [2] - E350
    Field [3] - Super, "luxurious" truck
    CSV line - 1999,Chevy,"Venture ""Extended Edition""","",4900.00
    Field [0] - 1999
    Field [1] - Chevy
    Field [2] - Venture "Extended Edition"
    Field [3] - 
    Field [4] - 4900.00
    CSV line - 1999,Chevy,"Venture ""Extended Edition, Very Large""",,5000.00
    Field [0] - 1999
    Field [1] - Chevy
    Field [2] - Venture "Extended Edition, Very Large"
    Field [3] - 
    Field [4] - 5000.00
    CSV line - 
    Error encountered while parsing the input line

A test case around the second method is documented here

    Key - Company ,Value - Ford
    Key - Model ,Value - E350
    Key - Year ,Value - 1997
    Since its a map, the order is not the same as the one present in the input line
    But its guaranteed the correct header will be mapped to the parsed input
