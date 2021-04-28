#!/usr/bin/python3


def write_file(words, filename):
    with open(filename, "w") as f:
        for word in words:
            f.write(f"{word}\r")

        f.close()


def main():
    words = ["lunch", "respectable", "scrape", "committed", "outlet", "empirical", "aquarium", "comment", "courage", "depart"] 
    write_file(words, "search_words.txt")


if __name__ == "__main__":
    main()

