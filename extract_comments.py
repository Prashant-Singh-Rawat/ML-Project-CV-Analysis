import json

with open('open_issues_comments.json', encoding='utf-16') as f:
    data = json.load(f)

for issue in data:
    for comment in issue.get('comments', []):
        author = comment.get('author')
        if not author:
            continue
        author = author.get('login', 'unknown')
        if author != 'Prashant-Singh-Rawat':
            print(f"Issue #{issue['number']} (by {author}):\n{comment['body'][:500]}\n{'-'*40}")
