
"""
This script uses GitHub APIs to fetch a list of issues associated with a project.
It outputs issue numbers and titles for all cards in all columns of the project.
The output is particularly useful for putting into the GitHub release notes.
You can store your github token in the settings.secret.yml file, if you wish, as GITHUB_TOKEN
"""

import requests
from requests.auth import HTTPBasicAuth
import json
import os
import yaml
import sys
import re
import getpass
import argparse

headers = {'Accept': 'application/vnd.github.inertia-preview+json'}

parser = argparse.ArgumentParser(description='Parse a .po file')
parser.add_argument('--column', help='the column name of the tickets you want to extract')
parser.add_argument('--closeissues', action='store_true', help='Close all of the issues in the column')
args = parser.parse_args()

project_name = input('Enter the project name: ')
print('\nEnter 1 to use GitHub token authorization (https://github.com/settings/tokens)')
print('Enter 2 to use GitHub username and password: ')
auth_pref = input('Enter 1 or 2: ')
if auth_pref == '1':
    CONFIG_PATH = os.path.abspath(os.path.join(os.path.abspath(__file__), os.pardir, os.pardir, 'config', 'settings.secret.yml'))
    with open(CONFIG_PATH, 'r') as fh:
        app_settings = yaml.full_load(fh)
    try:
        token = app_settings['GITHUB_TOKEN']
        print('Found your GitHub key in the settings file\n')
    except KeyError:
        token = getpass.getpass('GitHub token: ')
    headers['Authorization'] = 'token %s' % token
    auth = ''
elif auth_pref == '2':
    username = input('GitHub username: ')
    password = getpass.getpass('GitHub password: ')
    auth = HTTPBasicAuth(username, password)
else:
    print (type(auth_pref))
    print('You must choose either 1 or 2.  You chose %s. Exiting.' % auth_pref)
    sys.exit()

projects_url = 'https://api.github.com/repos/mercycorps/TolaActivity/projects'
columns_template = 'https://api.github.com/projects/%s/columns'
cards_template = 'https://api.github.com/projects/columns/{}/cards'
issue_template = 'https://api.github.com/repos/mercycorps/TolaActivity/issues/{}'

# Get the project id
print('Fetching data')
response = requests.get(projects_url, headers=headers, auth=auth)
projects = json.loads(response.text)
project_id = ''
columnn_ids = []
for project in projects:
    try:
        pname = project['name'].strip()
    except TypeError:
        print('Exiting, failed to process this project:')
        print(project)
        sys.exit()
    if project_name == pname:
        project_id = project['id']
        break
else:
    print("The project you entered couldn't be found in the list of your available projects. Exiting.")
    sys.exit()

# Get the columns ids associated with the project
columns_url = columns_template % project_id
response = requests.get(columns_url, headers=headers, auth=auth)
cols_to_fetch = ['Done', 'Ready for Deploy']
if args.column:
    cols_to_fetch = [args.column]

column_ids = [col['id'] for col in json.loads(response.text) if col['name'] in cols_to_fetch]
issues = []
for col_id in column_ids:

    # Loop through each card in each column and the the issue data associated
    # with the card
    cards_url_partial = cards_template.format(col_id) + '?page={}'
    page_num = 1
    has_next = True
    while has_next:
        cards_url = cards_url_partial.format(page_num)
        cards_response = requests.get(cards_url, headers=headers, auth=auth)
        for card in json.loads(cards_response.text):
            # If there is a note in the column, it will not have a content url and can be skipped
            try:
                match = re.search('(\d+)$', card['content_url'])
            except KeyError:
                continue
            issue_num = match.group(1)
            issue_url = issue_template.format(issue_num)
            issue_response = requests.get(issue_url, headers=headers, auth=auth)
            issues.append((issue_num, json.loads(issue_response.text)['title']))
            if args.closeissues:
                response = requests.patch(issue_url, headers=headers, auth=auth, json={'state': 'closed'})

        if 'next' in cards_response.links:
            page_num += 1
        else:
            has_next = False

if issues:
    issues.sort(key=lambda k: int(k[0]), reverse=True)
    print('')
    for i in issues:
        print('#%s - %s' % i)
else:
    print("No cards in the column(s)", ', '.join(cols_to_fetch))
