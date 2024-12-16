import { select, input, confirm } from '@inquirer/prompts';
import { NpmPackage } from '@tuanzii/utils';
import os from 'node:os'
import path from 'node:path';
import ora from 'ora';
import fse from 'fs-extra';
import ejs from 'ejs'
import { glob } from 'glob';

async function create() {

  const projectTemplate = await select({
    message: '请选择项目模版',
    choices: [
      {
        name: 'vue-ts 项目',
        value: '@tuanzii/template-vue-ts'
      },
      {
        name: 'vue 项目',
        value: '@tuanzii/template-vue'
      }
    ],
  });

  let projectName = '';

  while (!projectName) {
    projectName = await input({ message: '请输入项目名' });
  }

  const pkg = new NpmPackage({
    name: projectTemplate,
    targetPath: path.join(os.homedir(), '.tuanzii-cli-template')
  });

  if (!await pkg.exists()) {
    const spinner = ora('下载模版中...').start();
    await pkg.install();
    spinner.stop();
  } else {
    const spinner = ora('更新模版中...').start();
    await pkg.update();
    spinner.stop();
  }


  const spinner = ora('创建项目中...').start();
  const templatePath = path.join(pkg.npmFilePath, 'template');
  const targetPath = path.join(process.cwd(), projectName);


  if (fse.existsSync(targetPath)) {
    const empty = await confirm({ message: '该目录不为空，是否清空' });
    if (empty) {
      fse.emptyDirSync(targetPath);
    } else {
      process.exit(0);
    }
  }
  fse.copySync(templatePath, targetPath);

  const files = await glob('**', {
    cwd: targetPath,
    nodir: true,
    ignore: 'node_modules/**'
  })

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(targetPath, files[i]);
    const renderResult = await ejs.renderFile(filePath, {
      projectName
    })
    fse.writeFileSync(filePath, renderResult);
  }

  spinner.stop();
}


create();

export default create;
