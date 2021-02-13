# oiwiki-bootstrap

![GitHub Pages](https://github.com/OI-wiki/oiwiki-bootstrap/workflows/GitHub%20Pages/badge.svg)

A build script to build a full version (with all docs included) of [gatsby-oi-wiki](https://github.com/OI-wiki/gatsby-oi-wiki/).

## Usage

```sh
# install dependencies
pip3 install -r requirements.txt

# run script
python3 build.py
```

You'll find artifacts in `/public` after build.

This repo also includes a GitHub Workflow to deploy a GitHub Pages version of Gatsby OI Wiki. https://next.oi-wiki.org

## Steps
1. Clone `doc`, `migrator` and `jamstack` repositories.
2. Convert documents (add frontmatters etc) using [oiwiki-migrator](https://github.com/OI-Wiki/oiwiki-migrator)
3. Generate a project linking [gatsby-oi-wiki](https://github.com/OI-Wiki/gatsby-oi-wiki) as theme.
4. Copy files in `/shadow` and replace into the project.
5. Call Gatsby to build the project
6. If running in Actions, deploy to GitHub Pages

## Related Repositories
[gatsby-oi-wiki](https://github.com/OI-Wiki/gatsby-oi-wiki)

[oiwiki-migrator](https://github.com/OI-Wiki/oiwiki-migrator)