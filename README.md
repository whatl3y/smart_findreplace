# Find and return all matches of text

Quickly find and return all matches of text based on an algorithm
defined in a regular expression from a large flat file.

## Algorithms

1. email (default): find all email addresses in the flat file
2. phone: find all phone numbers in the flat file

## Parameters

1. -f or --file (required): the path to the file you want to search for a particular algorithm of text
2. -t or --type (optional): the type of algorithm you want to search for (DEFAULT: email)
3. -u or --unique (optional): true/false as to whether you want to return unique matches or all matches (DEFAULT: true)

## Examples

- ~>node index -f ~/my/dir/file.txt
- ~>node index --file "~/my/dir/my file with spaces"
- ~>node index -f ~/my/dir/file.txt -t phone
- ~>node index -f ~/my/dir/file.txt -u false
