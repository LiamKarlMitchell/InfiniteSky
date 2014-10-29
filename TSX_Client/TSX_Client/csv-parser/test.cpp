#include "csv_parser.hpp"

void display_vector_contents(const STR& input_line, const CSV_FIELDS& output_fields)
{
    CONST_VECTOR_ITR it = output_fields.begin();
    int i = 0;

    for( ; it != output_fields.end(); ++it)
    {
        std :: cout << "Field [" << i++ << "] - " << *it << "\n";
    }
}

void display_map_contents(const STR& input_line, const KEY_VAL_FIELDS& output_map)
{
    CONST_MAP_ITR it = output_map.begin();
    for (; it != output_map.end(); ++it)
    {
        std :: cout << "Key - " << it->first << " ,Value - " << it->second << "\n";
    }
}

int main()
{
    CSV_Parser csv_parser;
    CSV_FIELDS output_fields;
    STR line;
    bool status;

    // Open the test case CSV file
    std :: ifstream test_file("test_case.csv");
    if(test_file.is_open())
    {
        while(getline(test_file, line))
        {
            std :: cout << "CSV line - " << line << "\n";
            status = csv_parser.parse_line(line, output_fields);
            if(status)
            {
                display_vector_contents(line, output_fields);
                output_fields.clear();
            }
            else
            {
                std :: cout << "Error encountered while parsing the input line\n";
            }
        }
    }

    // Test case to handle the second overloaded method
    line = "1997,Ford,E350";
    CSV_FIELDS header;
    // Populate the header
    header.push_back("Year");
    header.push_back("Company");
    header.push_back("Model");
    KEY_VAL_FIELDS output_map;
    status = csv_parser.parse_line(line, header, output_map);
    if(status)
    {
        display_map_contents(line, output_map);
    }
    else
    {
        std :: cout << "Error encountered while parsing the input line\n";
    }
    return 0;
}
