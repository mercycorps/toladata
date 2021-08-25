"""
This script clears out the comments in all of the po files.  Used to clear pofilter spam
that got into the files from an ill-advised use of pofilter.  If you're reading this, this file si probbly safe
to delete
"""
import os
import re
import argparse


def main():
    parser = argparse.ArgumentParser(description='Deletes comments from .po files.')
    parser.add_argument('filepath', help='Relative path to po file')
    parser.add_argument('--force', action='store_true', help='Without this flag, running the script will be a dry run.')
    args = parser.parse_args()
    print('args', args)
    with open(args.filepath, 'r') as fh:
        lines = fh.readlines()
    with open(args.filepath.replace('.po', '_Xcomments.po'), 'w') as fh:
        for line in lines:
            match = re.search(r'^\#\n', line)
            if line[:2] != '# ' and match is None:
                fh.write(line)
            else:
                print('Omitting', line)




if __name__ == '__main__':
    main()
