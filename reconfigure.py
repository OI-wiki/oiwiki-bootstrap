#!/usr/bin/python3

import os
import yaml
import argparse

def main():
    # if not os.environ.get("CI") == "true":
    #    print("skip configuration: not in CI")
    cfg = None
    with open("config.yml", "r") as f:
        data = f.read()
        cfg = yaml.safe_load(data)

    parser = argparse.ArgumentParser(description='Reconfigure bootstrap')
    parser.add_argument("--doc-repo", type=str)
    parser.add_argument("--doc-ref", type=str)
    parser.add_argument("--jamstack-repo", type=str)
    parser.add_argument("--jamstack-ref", type=str)

    args = parser.parse_args()
    if args.doc_repo is not None:
        cfg["doc"]["repo"] = f"https://github.com{args.doc_repo}"
    if args.doc_ref is not None:
        cfg["doc"]["ref"] = args.doc_ref
    
    if args.jamstack_repo is not None:
        cfg["jamstack"]["repo"] = f"https://github.com/{args.jamstack_repo}"
    if args.jamstack_ref is not None:
        cfg["jamstack"]["ref"] = args.jamstack_ref


    with open("config.yml", "w") as f:
        yaml.dump(cfg, f)

if __name__ == "__main__":
    main()
