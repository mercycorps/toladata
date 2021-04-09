"""
There doesn't seem to be an existing tool to merge a partial .po file
into an existing complete .po file, so here we are.

This is needed as parse_po.py was used to create a CSV where temporary
translator notes were added. The --newOrFuzzy flag was used so only a subset
of strings were loaded into the CSV. A partial PO file was then created from this CSV.

`msgmerge` doesn't appear to handle this well, as each missing string is seen as
a string no longer used in the codebase. Other downsides are line numbers and fuzzy
msg comment strings were thrown out as well.

This script uses polib which is not part of the main requirements.txt

  pip install polib
"""
import polib
import argparse


def main():
    parser = argparse.ArgumentParser(description='Merge a partial .po file into a complete one')
    parser.add_argument('basefile', help='the filepath to the main .po file')
    parser.add_argument('partialfile', help='the filepath to the partial .po file')
    args = parser.parse_args()

    base_po = polib.pofile(args.basefile)
    partial_po = polib.pofile(args.partialfile)

    partial_po_entry_map = {}

    for entry in partial_po:
        partial_po_entry_map[entry.msgid] = entry

    # only merge translator comments at the moment
    for entry in base_po:
        if entry.msgid in partial_po_entry_map:
            partial_entry = partial_po_entry_map[entry.msgid]
            if partial_entry.comment:
                entry.comment = partial_entry.comment

    # send updated PO file to STDOUT for now
    print(base_po)


if __name__ == '__main__':
    main()
