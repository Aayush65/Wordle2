import json
from os import system
system("cls")

dictionary = json.loads(open('dictionary.json').read())

def isAllAlpha(word):
    if len(word) < 4 or len(word) > 6:
        return False
    for i in word:
        if not (ord('a') <= ord(i) <= ord('z')):
            return False
    return True

wordlist = []
for i in dictionary:
    if isAllAlpha(i):
        wordlist.append(i)

wordlist.sort(key= lambda x: [len(x), x])

words = {4: [], 5: [], 6: []}
for i in wordlist:
    if len(i) in {4,5,6}:
        words[len(i)].append(i.upper())

with open('./words.json', 'w') as file:
    json.dump(words, file, indent=2)

dictionary = {i: dictionary[i] for i in wordlist}

with open('./dictionary.json', 'w') as file:
    json.dump(dictionary, file, indent=2)