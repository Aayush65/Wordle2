from json import dump
with open('./wordlist.txt', 'r') as file:
    wordlist = file.read().split('\n')

wordlist.sort(key= lambda x: [len(x), x])

words = {4: [], 5: [], 6: [], 7: [], 8: []}
for i in wordlist:
    if len(i) in {4,5,6,7,8}:
        words[len(i)].append(i.upper())

with open('./words.json', 'w') as file:
    dump(words, file, indent=2)