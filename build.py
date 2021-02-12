
import yaml
import os
import sys
import shutil
import git
import subprocess
import functools
import re
from tqdm import tqdm


class Build:
    
    class Progress(git.remote.RemoteProgress):

        def __init__(self):
            super().__init__()
            disabled = os.environ.get("CI") == "true"
            self.bar = tqdm(unit="", bar_format="{l_bar}{bar}[{elapsed}<{remaining}]", disable=disabled)

        def update(self, op_code, cur_count, max_count=None, message=''):
            self.bar.total = max_count
            self.bar.set_description(f"{str(op_code)} {message}")
            self.bar.n = cur_count
        
        def finalize(self):
            self.bar.close()

    def __init__(self, cfg):
        self.cfg = cfg
    
    @staticmethod
    def __dirs():
        return ['doc', 'jamstack', 'migrator']
    
    @staticmethod
    def __run(*args, **kw):
        cwd = kw["cwd"]
        ret = subprocess.run(args, cwd=cwd, stderr=sys.stderr, stdout=sys.stdout)
        ret.check_returncode()
        
    def prepare_repo(self):
        for i in self.__dirs(): 
            if os.path.exists(i):
                print("prepare: clean existing directory", i)
                shutil.rmtree(i)
            os.mkdir(f'./{i}')

            with git.Repo.init(path=f'./{i}') as repo:
                print(f"prepare: git: checkout {i}")
                remote = repo.create_remote("origin", self.cfg[i]["repo"])

                progress = self.Progress()
                if i == "doc":
                    remote.fetch(progress=progress)
                else:
                    remote.fetch(depth=1, progress=progress)
                
                progress.finalize()
                repo.git.checkout(self.cfg[i]["ref"])

    def install(self):
        self.__run("yarn", "install", cwd="./migrator")
        # for i in self.__dirs():
        #    self.__run("yarn", "install", cwd=f"./{i}")
        
    def convert(self):
        print("build: convert doc")
        if not os.path.exists("./migrator/raw/OI-Wiki"):
            os.symlink(os.path.abspath("./doc"), "./migrator/raw/OI-Wiki")
        
        if os.path.exists("./migrator/out/docs"):
            print("convert: clean old docs")
            shutil.rmtree("./migrator/out/docs")
        os.mkdir("./migrator/out/docs")
        
        self.__run("node", ".", cwd=f"./migrator")
    
    def __gen_nav(self):
        with open("./doc/mkdocs.yml", "r") as f:
            mkdoc_cfg = yaml.load(f, yaml.BaseLoader)
            os.makedirs("./cauldron/src/gatsby-theme-oi-wiki/", exist_ok=True)
            
            nav = mkdoc_cfg["nav"]
            
            def __strip_md(item):
                if type(item) is list:
                    ret = list(map(lambda x: __strip_md(x), item))
                    return ret
                elif type(item) is dict:
                    it = list(item.items())[0]
                    if type(it[1]) is str:
                        return { it[0]: "/" + re.sub("(index)?\.md$", "", it[1]) }
                    elif type(it[1]) is list:
                        return { it[0]: __strip_md(it[1]) }
            
            nav = __strip_md(nav)
            with open("./cauldron/src/gatsby-theme-oi-wiki/sidebar.yaml", "w") as fs:
                yaml.dump(nav, fs, allow_unicode=True)

    def prepare_cauldron(self):
        print("build: prepare cauldron")
        if os.path.exists("./cauldron"):
            shutil.rmtree("./cauldron")
        
        shutil.copytree("./jamstack/example", "./cauldron", 
            ignore=shutil.ignore_patterns("docs", "package.json"))
        shutil.copytree("./migrator/out/docs", "./cauldron/docs")
        shutil.copy("./build_package.json", "./cauldron/package.json")
        shutil.copy("./build_gatsby-node.js", "./cauldron/gatsby-node.js")
        shutil.copy("./build.env.production", "./cauldron/.env.production")
        shutil.copy("./test.md", "./cauldron/docs/test.md")
        shutil.copytree("./doc/.git", "./cauldron/.git")

        self.__gen_nav()
        self.__run("yarn", "install", cwd="./cauldron")

    def generate(self):
        self.__run("yarn", "build", cwd="./cauldron")
        shutil.copytree("./cauldron/public", "./public")

    def build(self):
        self.prepare_repo()
        self.install()
        self.convert()
        self.prepare_cauldron()
        self.generate()


def main():
    cfg = None
    with open("config.yml", "r") as f:
        data = f.read()
        cfg = yaml.safe_load(data)
    print("config:", cfg)
    Build(cfg).build()

if __name__ == "__main__":
    main()
